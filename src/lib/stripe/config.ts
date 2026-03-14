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
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
  STARTER_YEARLY: process.env.STRIPE_PRICE_STARTER_YEARLY!,
  ESSENTIAL_MONTHLY: process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY!,
  ESSENTIAL_YEARLY: process.env.STRIPE_PRICE_ESSENTIAL_YEARLY!,
  PRO_PLUS_MONTHLY: process.env.STRIPE_PRICE_PRO_PLUS_MONTHLY!,
  PRO_PLUS_YEARLY: process.env.STRIPE_PRICE_PRO_PLUS_YEARLY!,
} as const;

export type TierName = "Starter" | "Essential" | "Professional Plus";

const TIER_KEY_MAP: Record<TierName, string> = {
  Starter: "STARTER",
  Essential: "ESSENTIAL",
  "Professional Plus": "PRO_PLUS",
};

export function getPriceId(tier: TierName, period: "monthly" | "yearly"): string {
  const key = `${TIER_KEY_MAP[tier]}_${period.toUpperCase()}` as keyof typeof PRICE_IDS;
  return PRICE_IDS[key];
}

export const TIER_CONFIG = {
  STARTER: { creditsPerMonth: 3, hasCustomDashboard: false, hasOfficeHours: false },
  ESSENTIAL: { creditsPerMonth: 8, hasCustomDashboard: false, hasOfficeHours: false },
  PRO_PLUS: { creditsPerMonth: 15, hasCustomDashboard: true, hasOfficeHours: true },
} as const;
