import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PRICE_IDS = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL!,
} as const;

export const TIER_LIMITS = {
  STARTER: {
    downloadsPerMonth: 5,
    allGradeBands: false,
  },
  PROFESSIONAL: {
    downloadsPerMonth: Infinity,
    allGradeBands: true,
  },
} as const;
