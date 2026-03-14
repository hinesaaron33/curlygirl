"use client";

import Link from "next/link";
import { useState } from "react";
import { RevealDiv } from "./reveal-div";

const pricingTiers = [
  {
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    period: "",
    description: "Explore what Curly Girl ELD has to offer.",
    features: ["Browse lesson plan previews", "1 PDF download per month", "Community access", "Email support"],
    highlighted: false,
  },
  {
    name: "Starter",
    monthlyPrice: "$14.99",
    yearlyPrice: "$9.99",
    period: "/mo",
    description: "Perfect for individual teachers getting started.",
    features: ["Core lesson plan library", "Basic customization tools", "5 PDF downloads per month", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    monthlyPrice: "$24.99",
    yearlyPrice: "$19.99",
    period: "/mo",
    description: "For educators who want the full toolkit.",
    features: ["Full lesson plan library", "Advanced editor & customization", "Unlimited PDF downloads", "Priority support", "New plans added monthly", "Collaboration tools"],
    highlighted: true,
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="relative overflow-hidden bg-base-dark pt-2 pb-28 sm:pt-3 sm:pb-36 scroll-mt-[72px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-[15%] h-[300px] w-[300px] rounded-full bg-blush/[0.1] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <RevealDiv>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">Choose your plan</h2>
          </RevealDiv>
          <RevealDiv delay="delay-200">
            <p className="mx-auto mt-4 max-w-md text-base text-ink/50">Start free and explore. Upgrade anytime to unlock the full library.</p>

            {/* Monthly / Yearly toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/30 p-1 backdrop-blur-sm">
              <button
                onClick={() => setYearly(false)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${!yearly ? "bg-pink text-white shadow-md" : "text-ink/50 hover:text-ink"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${yearly ? "bg-pink text-white shadow-md" : "text-ink/50 hover:text-ink"}`}
              >
                Yearly
                <span className="ml-1.5 rounded-full bg-gold/80 px-2 py-0.5 text-[10px] font-bold text-ink">SAVE 33%</span>
              </button>
            </div>
          </RevealDiv>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <RevealDiv key={tier.name} delay={`delay-${(i + 1) * 100}`}>
              <div className={`group relative flex h-full flex-col rounded-2xl border bg-white/30 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink/15 ${tier.highlighted ? "border-pink/30 ring-4 ring-pink/10 hover:border-pink hover:ring-pink/30" : "border-white/40 hover:border-pink hover:ring-4 hover:ring-pink/15"}`}>
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-pink px-6 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-pink/25 transition-all duration-300 group-hover:bg-white group-hover:text-pink group-hover:shadow-white/25">Most Popular</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-ink text-center">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate text-center">{tier.description}</p>
                <div className="mt-6 flex items-baseline justify-center gap-1">
                  <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-ink">{yearly ? tier.yearlyPrice : tier.monthlyPrice}</span>
                  {tier.period && <span className="text-lg text-ink/75">{tier.period}</span>}
                </div>
                {yearly && tier.yearlyPrice !== "$0" && (
                  <div className="mt-3 text-center">
                    <span className="inline-block rounded-full bg-gold/80 px-4 py-1 text-xs font-bold tracking-wide text-ink uppercase">Billed Annually</span>
                  </div>
                )}
                <ul className="mt-8 flex-1 space-y-3">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink/60">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/signup" className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all ${tier.highlighted ? "bg-pink text-white shadow-lg shadow-pink/25 group-hover:bg-white group-hover:text-pink group-hover:border-2 group-hover:border-pink group-hover:shadow-xl group-hover:-translate-y-0.5" : "border-2 border-ink/15 bg-white/40 text-ink/70 group-hover:border-pink group-hover:bg-pink group-hover:text-white group-hover:shadow-lg group-hover:shadow-pink/25"}`}>
                    GET STARTED
                    <span className="relative h-4 w-4">
                      <svg className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                      <svg className="absolute inset-0 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </span>
                  </Link>
                </div>
              </div>
            </RevealDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
