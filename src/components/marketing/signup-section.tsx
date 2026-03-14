"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { RevealDiv } from "@/components/marketing/reveal-div";
import { LoginTrigger } from "@/components/auth/login-modal";

export function SignupSection() {
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await fetch("/api/auth/sync", { method: "POST" });
      router.push("/library");
      return;
    }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <section id="signup" className="relative overflow-hidden bg-base-dark py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/[0.08] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — text */}
          <div>
            <RevealDiv>
              <div className="animate-float mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink font-[family-name:var(--font-playfair)] text-xl font-bold text-white shadow-2xl shadow-pink/30 lg:mx-0">
                CG
              </div>
            </RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-left text-center">
                Ready to transform your<br />ELD classroom?
              </h2>
            </RevealDiv>
            <RevealDiv delay="delay-200">
              <p className="mx-auto mt-4 max-w-md text-base text-ink/50 lg:mx-0 lg:text-left text-center">
                Join 500+ educators who are saving hours every week with expert-crafted, standards-aligned lesson plans.
              </p>
            </RevealDiv>
            <RevealDiv delay="delay-300">
              <ul className="mt-8 space-y-3 lg:mx-0 mx-auto max-w-md">
                {["Flexible plans starting at $9.99/month", "Access to curated lesson plans instantly", "Cancel or change your plan anytime"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/20">
                      <svg className="h-3 w-3 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-sm text-ink/50">{item}</span>
                  </li>
                ))}
              </ul>
            </RevealDiv>
          </div>

          {/* Right — signup form */}
          <RevealDiv delay="delay-200">
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl shadow-ink/[0.06] backdrop-blur-sm">
              {success ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/20">
                    <svg className="h-6 w-6 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-ink font-[family-name:var(--font-playfair)]">Check your email</h3>
                  <p className="mt-2 text-sm text-ink/50">
                    We&apos;ve sent a confirmation link to <strong className="text-teal-dark">{email}</strong>. Click the link to verify your account.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-ink font-[family-name:var(--font-playfair)]">Create your account</h3>
                  <p className="mt-1 mb-6 text-sm text-ink/50">Sign up to get started</p>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label htmlFor="signup-name" className="mb-1.5 block text-xs font-medium text-ink/50">Name</label>
                      <input id="signup-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                        className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-ink/50">Email</label>
                      <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="you@example.com" />
                    </div>
                    <div>
                      <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium text-ink/50">Password</label>
                      <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="w-full rounded-xl border border-ink/10 bg-white/50 px-4 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/30 focus:border-pink/50 focus:outline-none focus:ring-2 focus:ring-pink/20" placeholder="Create a password" />
                    </div>
                    {error && <div className="rounded-lg bg-pink/10 px-3 py-2 text-sm text-pink-dark">{error}</div>}
                    <button type="submit" disabled={loading}
                      className="w-full rounded-xl bg-pink py-3 text-sm font-semibold text-white shadow-lg shadow-pink/25 transition-all hover:bg-pink-dark hover:-translate-y-0.5 disabled:opacity-50">
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-ink/40">
                    Already have an account?{" "}
                    <LoginTrigger className="font-semibold text-teal-dark hover:text-teal">Log in</LoginTrigger>
                  </p>
                </>
              )}
            </div>
          </RevealDiv>
        </div>
      </div>
    </section>
  );
}
