import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, PRICE_IDS, TIER_CONFIG } from "@/lib/stripe/config";
import { prisma } from "@/lib/db/prisma";
import { Prisma, SubscriptionStatus, SubscriptionTier } from "@prisma/client";

/* Prisma transaction client — the same surface as `prisma` but scoped to a
 * transaction, so all writes for one webhook event commit or roll back together. */
type Tx = Prisma.TransactionClient;

function isDuplicateEvent(err: unknown): boolean {
  // P2002 = unique constraint violation → this Stripe event id was already
  // recorded, i.e. a retry of an event we've already processed.
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

/* Records the event id as the first write in the processing transaction. On a
 * retry of an already-handled event this throws P2002, rolling back the whole
 * transaction (so nothing is granted twice). On a genuine processing failure
 * the transaction rolls back too — including this row — so Stripe's retry
 * re-processes the event cleanly. */
async function markEventProcessed(tx: Tx, event: Stripe.Event) {
  await tx.processedStripeEvent.create({
    data: { id: event.id, type: event.type },
  });
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    default:
      return "INACTIVE";
  }
}

function getTierFromPriceId(priceId: string): SubscriptionTier {
  if (priceId === PRICE_IDS.ESSENTIAL_MONTHLY || priceId === PRICE_IDS.ESSENTIAL_YEARLY) return "ESSENTIAL";
  if (priceId === PRICE_IDS.PRO_PLUS_MONTHLY || priceId === PRICE_IDS.PRO_PLUS_YEARLY) return "PRO_PLUS";
  return "STARTER";
}

async function grantMonthlyCredits(
  tx: Tx,
  subscriptionId: string,
  tier: SubscriptionTier
) {
  const config = TIER_CONFIG[tier];
  const sub = await tx.subscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });

  await tx.subscription.update({
    where: { id: subscriptionId },
    data: { creditsBalance: { increment: config.creditsPerMonth } },
  });
  await tx.creditTransaction.create({
    data: {
      userId: sub.userId,
      amount: config.creditsPerMonth,
      type: "GRANT",
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode !== "subscription" || !session.subscription || !session.customer) {
          break;
        }

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer.id;

        // Network read stays outside the transaction to avoid holding a DB
        // lock across an external call.
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = stripeSubscription.items.data[0]?.price.id;
        const tier = getTierFromPriceId(priceId);

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });

        if (!user) {
          console.error(`No user found for Stripe customer ${customerId}`);
          break;
        }

        const periodStart = (stripeSubscription as unknown as { current_period_start: number }).current_period_start;
        const periodEnd = (stripeSubscription as unknown as { current_period_end: number }).current_period_end;

        await prisma.$transaction(async (tx) => {
          await markEventProcessed(tx, event);

          await tx.subscription.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              tier,
              status: mapStripeStatus(stripeSubscription.status),
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              creditsBalance: TIER_CONFIG[tier].creditsPerMonth,
            },
            update: {
              tier,
              status: mapStripeStatus(stripeSubscription.status),
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              currentPeriodStart: new Date(periodStart * 1000),
              currentPeriodEnd: new Date(periodEnd * 1000),
              cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              creditsBalance: { increment: TIER_CONFIG[tier].creditsPerMonth },
            },
          });

          // Record the initial credit grant
          await tx.creditTransaction.create({
            data: {
              userId: user.id,
              amount: TIER_CONFIG[tier].creditsPerMonth,
              type: "GRANT",
            },
          });
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const tier = getTierFromPriceId(priceId);
        const subPeriodStart = (subscription as unknown as { current_period_start: number }).current_period_start;
        const subPeriodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

        const existingSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        const newPeriodStart = new Date(subPeriodStart * 1000);
        const periodRenewed = existingSub &&
          existingSub.currentPeriodStart &&
          newPeriodStart.getTime() > existingSub.currentPeriodStart.getTime();

        await prisma.$transaction(async (tx) => {
          await markEventProcessed(tx, event);

          await tx.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              status: mapStripeStatus(subscription.status),
              tier,
              stripePriceId: priceId,
              currentPeriodStart: newPeriodStart,
              currentPeriodEnd: new Date(subPeriodEnd * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              // Clear canceledAt if subscription is reactivated
              ...(subscription.status === "active" ? { canceledAt: null } : {}),
            },
          });

          // Grant credits on period renewal
          if (periodRenewed && existingSub) {
            await grantMonthlyCredits(tx, existingSub.id, tier);
          }
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.$transaction(async (tx) => {
          await markEventProcessed(tx, event);

          // Set 30-day grace period instead of immediately deactivating
          await tx.subscription.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              canceledAt: new Date(),
              cancelAtPeriodEnd: false,
            },
          });
        });

        break;
      }
    }
  } catch (err) {
    // A duplicate event (Stripe retry of something we already committed) trips
    // the ProcessedStripeEvent unique key and rolls the transaction back with
    // no side effects. Ack it so Stripe stops retrying.
    if (isDuplicateEvent(err)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error processing webhook event ${event.type}: ${message}`);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
