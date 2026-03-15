"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/* ── Context ── */

const LoginModalContext = createContext<{
  open: () => void;
  close: () => void;
} | null>(null);

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error("useLoginModal must be used within LoginModalProvider");
  return ctx;
}

/* ── Provider + Modal ── */

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <LoginModalContext.Provider value={{ open, close }}>
      {children}
      {isOpen && <LoginModal onClose={close} />}
    </LoginModalContext.Provider>
  );
}

/* ── Trigger button (drop-in replacement for Link href="/login") ── */

export function LoginTrigger({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { open } = useLoginModal();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {children}
    </button>
  );
}

/* ── Modal ── */

function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const syncRes = await fetch("/api/auth/sync", { method: "POST" });
    const syncData = await syncRes.json();
    onClose();
    router.push(syncData.role === "ADMIN" ? "/admin" : "/library");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-white/40 bg-base/95 p-8 shadow-2xl shadow-ink/20 backdrop-blur-xl animate-in zoom-in-95 fade-in duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink font-bold text-white text-sm shadow-sm font-[family-name:var(--font-playfair)]">CG</div>
            <span className="text-[24px] font-semibold tracking-tight text-ink font-[family-name:var(--font-playfair)]">Curly Girl <span className="text-pink">ELD</span></span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-ink font-[family-name:var(--font-playfair)]">Welcome back</h2>
        <p className="mt-1 mb-6 text-sm text-ink">Log in to access your lesson plans</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="rounded-lg bg-pink/10 px-3 py-2 text-sm text-pink-dark">{error}</div>}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="group w-full rounded-xl border-2 border-pink bg-white py-3 text-base font-semibold text-pink shadow-lg shadow-pink/25 transition-all hover:bg-pink hover:text-white hover:border-gold disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
          >
            <span className="inline-flex items-center gap-2">
              {loading ? "Logging in..." : "Log In"}
              <svg className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-disabled:hidden" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/70">
          Don&apos;t have an account?{" "}
          <Link href="/signup" onClick={onClose} className="rounded-md bg-[#F5D491] px-2 py-0.5 font-semibold text-pink hover:text-pink-dark">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
