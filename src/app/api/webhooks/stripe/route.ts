import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, PRICE_IDS, TIER_CONFIG } from "@/lib/stripe/config";
import { prisma } from "@/lib/db/prisma";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";

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

async function grantMonthlyCredits(subscriptionId: string, tier: SubscriptionTier) {
  const config = TIER_CONFIG[tier];
  const sub = await prisma.subscription.findUniqueOrThrow({
    where: { id: subscriptionId },
  });

  await prisma.$transaction([
    prisma.subscription.update({
      where: { id: subscriptionId },
      data: { creditsBalance: { increment: config.creditsPerMonth } },
    }),
    prisma.creditTransaction.create({
      data: {
        userId: sub.userId,
        amount: config.creditsPerMonth,
        type: "GRANT",
      },
    }),
  ]);
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

        const sub = await prisma.subscription.upsert({
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
        await prisma.creditTransaction.create({
          data: {
            userId: user.id,
            amount: TIER_CONFIG[tier].creditsPerMonth,
            type: "GRANT",
          },
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

        await prisma.subscription.update({
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
          await grantMonthlyCredits(existingSub.id, tier);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Set 30-day grace period instead of immediately deactivating
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            canceledAt: new Date(),
            cancelAtPeriodEnd: false,
          },
        });

        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error processing webhook event ${event.type}: ${message}`);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
