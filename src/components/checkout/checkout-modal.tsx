"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripeJs } from "@/lib/stripe/client";
import { createCheckoutSession } from "@/lib/stripe/actions";
import { createClient } from "@/lib/supabase/client";

/* ── Types ── */

type Tier = "Starter" | "Essential" | "Professional Plus";
type Period = "monthly" | "yearly";

/* ── Context ── */

const CheckoutModalContext = createContext<{
  open: (tier: Tier, period: Period) => void;
  close: () => void;
} | null>(null);

export function useCheckoutModal() {
  const ctx = useContext(CheckoutModalContext);
  if (!ctx) throw new Error("useCheckoutModal must be used within CheckoutModalProvider");
  return ctx;
}

/* ── Provider + Modal ── */

export function CheckoutModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ tier: Tier; period: Period } | null>(null);

  const open = useCallback((tier: Tier, period: Period) => setState({ tier, period }), []);
  const close = useCallback(() => {
    setState(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <CheckoutModalContext.Provider value={{ open, close }}>
      {children}
      {state && <CheckoutModal tier={state.tier} period={state.period} onClose={close} />}
    </CheckoutModalContext.Provider>
  );
}

/* ── Trigger button ── */

export function CheckoutTrigger({
  tier,
  period,
  children,
  className,
}: {
  tier: Tier;
  period: Period;
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useCheckoutModal();
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open(tier, period);
      }}
    >
      {children}
    </button>
  );
}

/* ── Plan labels ── */

const PLAN_PRICES: Record<Tier, Record<Period, string>> = {
  Starter: { monthly: "$14.99/mo", yearly: "$9.99/mo" },
  Essential: { monthly: "$19.99/mo", yearly: "$14.99/mo" },
  "Professional Plus": { monthly: "$29.99/mo", yearly: "$24.99/mo" },
};

/* ── Modal ── */

function CheckoutModal({ tier, period, onClose }: { tier: Tier; period: Period; onClose: () => void }) {
  const [step, setStep] = useState<"signup" | "checkout">("signup");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if already authenticated → skip to checkout
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setStep("checkout");
      setCheckingAuth(false);
    });
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Card */}
      <div className={`relative flex max-h-[90vh] flex-col overflow-y-auto rounded-2xl border border-white/40 bg-base/95 p-8 shadow-2xl shadow-ink/20 backdrop-blur-xl animate-in zoom-in-95 fade-in duration-200 ${step === "checkout" ? "w-full max-w-lg" : "w-full max-w-sm"}`}>
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-lg p-1.5 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Plan summary */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink font-bold text-white text-sm shadow-sm font-[family-name:var(--font-playfair)]">CG</div>
            <span className="text-[15px] font-semibold tracking-tight text-ink font-[family-name:var(--font-playfair)]">Curly Girl <span className="text-pink">ELD</span></span>
          </div>
          <p className="mt-3 text-sm font-medium text-ink/70">{tier} — {PLAN_PRICES[tier][period]}</p>
          {period === "yearly" && (
            <div className="mt-2">
              <span className="inline-block rounded-full bg-gold/80 px-4 py-1 text-xs font-bold tracking-wide text-ink uppercase">Billed Annually</span>
            </div>
          )}
        </div>

        {checkingAuth ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink/30 border-t-pink" />
          </div>
        ) : step === "signup" ? (
          <SignupStep onComplete={() => setStep("checkout")} />
        ) : (
          <CheckoutStep tier={tier} period={period} />
        )}
      </div>
    </div>
  );
}

/* ── Signup Step ── */

function SignupStep({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await fetch("/api/auth/sync", { method: "POST" });
    onComplete();
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-ink font-[family-name:var(--font-playfair)]">Create your account</h2>
      <p className="mt-2 mb-6 text-base text-ink/50">Sign up to continue to checkout</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="checkout-name" className="mb-1.5 block text-xs font-medium text-ink/50">Name</label>
          <input
            id="checkout-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="checkout-email" className="mb-1.5 block text-xs font-medium text-ink/50">Email</label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="checkout-password" className="mb-1.5 block text-xs font-medium text-ink/50">Password</label>
          <input
            id="checkout-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20"
            placeholder="At least 6 characters"
          />
        </div>
        {error && <div className="rounded-lg bg-pink/10 px-3 py-2 text-sm text-pink-dark">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-pink py-3 text-sm font-semibold text-white shadow-lg shadow-pink/25 transition-all hover:bg-pink-dark disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Continue to Checkout"}
        </button>
      </form>
    </>
  );
}

/* ── Checkout Step ── */

function CheckoutStep({ tier, period }: { tier: Tier; period: Period }) {
  const fetchClientSecret = useCallback(async () => {
    const { clientSecret } = await createCheckoutSession(tier, period);
    if (!clientSecret) throw new Error("Failed to create checkout session");
    return clientSecret;
  }, [tier, period]);

  return (
    <EmbeddedCheckoutProvider stripe={getStripeJs()} options={{ fetchClientSecret }}>
      <EmbeddedCheckout className="min-h-[400px]" />
    </EmbeddedCheckoutProvider>
  );
}
