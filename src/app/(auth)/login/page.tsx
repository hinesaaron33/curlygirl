"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    router.push("/library");
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl shadow-ink/[0.06] backdrop-blur-sm">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink font-bold text-white text-sm shadow-sm font-[family-name:var(--font-playfair)]">CG</div>
          <span className="text-[15px] font-semibold tracking-tight text-ink font-[family-name:var(--font-playfair)]">Curly Girl <span className="text-pink">ELD</span></span>
        </Link>
      </div>

      <h1 className="text-xl font-bold text-ink font-[family-name:var(--font-playfair)]">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">Log in to access your lesson plans</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-muted">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink-muted">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="Enter your password" />
        </div>
        {error && <div className="rounded-lg bg-pink/10 px-3 py-2 text-sm text-pink-dark">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-pink py-3 text-sm font-semibold text-white shadow-lg shadow-pink/25 transition-all hover:bg-pink-dark disabled:opacity-50">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-pink hover:text-pink-dark">Sign up</Link>
      </p>
    </div>
  );
}
