import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, PRICE_IDS } from "@/lib/stripe/config";
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
  if (priceId === PRICE_IDS.PROFESSIONAL) return "PROFESSIONAL";
  return "STARTER";
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

        await prisma.subscription.upsert({
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
          },
          update: {
            tier,
            status: mapStripeStatus(stripeSubscription.status),
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            currentPeriodStart: new Date(periodStart * 1000),
            currentPeriodEnd: new Date(periodEnd * 1000),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          },
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        const subPeriodStart = (subscription as unknown as { current_period_start: number }).current_period_start;
        const subPeriodEnd = (subscription as unknown as { current_period_end: number }).current_period_end;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: mapStripeStatus(subscription.status),
            tier: getTierFromPriceId(priceId),
            stripePriceId: priceId,
            currentPeriodStart: new Date(subPeriodStart * 1000),
            currentPeriodEnd: new Date(subPeriodEnd * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "INACTIVE",
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
