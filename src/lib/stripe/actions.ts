"use server";

import { stripe } from "@/lib/stripe/config";
import { prisma } from "@/lib/db/prisma";
import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Not authenticated");
  }

  return user;
}

async function getOrCreateStripeCustomer(userId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  if (dbUser.stripeCustomerId) {
    return dbUser.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: dbUser.email,
    name: dbUser.name,
    metadata: { userId: dbUser.id },
  });

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(priceId: string) {
  const user = await getAuthenticatedUser();
  const customerId = await getOrCreateStripeCustomer(user.id);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    ui_mode: "embedded",
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?session_id={CHECKOUT_SESSION_ID}`,
  });

  return { clientSecret: session.client_secret };
}

export async function createCustomerPortalSession() {
  const user = await getAuthenticatedUser();
  const customerId = await getOrCreateStripeCustomer(user.id);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
  });

  return { url: session.url };
}
