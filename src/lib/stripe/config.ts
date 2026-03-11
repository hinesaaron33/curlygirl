import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

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
