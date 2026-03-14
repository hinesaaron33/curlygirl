"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name }, emailRedirectTo: `${window.location.origin}/callback` },
    });

    if (error) { setError(error.message); setLoading(false); return; }
    // If session exists (no email confirmation required), sync and redirect
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetch("/api/auth/sync", { method: "POST" });
      router.push("/library");
      return;
    }
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl shadow-ink/[0.06] backdrop-blur-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/20">
          <svg className="h-6 w-6 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-ink font-[family-name:var(--font-playfair)]">Check your email</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We&apos;ve sent a confirmation link to <strong className="text-teal-dark">{email}</strong>. Click the link to verify your account.
        </p>
        <p className="mt-6"><Link href="/login" className="text-sm font-semibold text-pink hover:text-pink-dark">Back to login</Link></p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl shadow-ink/[0.06] backdrop-blur-sm">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink font-bold text-white text-sm shadow-sm font-[family-name:var(--font-playfair)]">CG</div>
          <span className="text-[15px] font-semibold tracking-tight text-ink font-[family-name:var(--font-playfair)]">Curly Girl <span className="text-pink">ELD</span></span>
        </Link>
      </div>

      <h1 className="text-xl font-bold text-ink font-[family-name:var(--font-playfair)]">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-ink-muted">Start your free 7-day trial</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-ink-muted">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-ink-muted">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-ink-muted">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="Create a password" />
        </div>
        {error && <div className="rounded-lg bg-pink/10 px-3 py-2 text-sm text-pink-dark">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-pink py-3 text-sm font-semibold text-white shadow-lg shadow-pink/25 transition-all hover:bg-pink-dark disabled:opacity-50">
          {loading ? "Creating account..." : "Get Started Free"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-teal-dark hover:text-teal">Log in</Link>
      </p>
    </div>
  );
}
