"use client";

import { useState } from "react";
import Link from "next/link";

const tiers = [
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

const comparisonFeatures = [
  { name: "Lesson plan library access", starter: "Core plans", professional: "Full library" },
  { name: "New plans added monthly", starter: false, professional: true },
  { name: "Basic customization", starter: true, professional: true },
  { name: "Advanced editor tools", starter: false, professional: true },
  { name: "PDF downloads", starter: "5 per month", professional: "Unlimited" },
  { name: "Watermark-free PDFs", starter: false, professional: true },
  { name: "Save customized plans", starter: "Up to 10", professional: "Unlimited" },
  { name: "Standards alignment tags", starter: true, professional: true },
  { name: "Collaboration tools", starter: false, professional: true },
  { name: "Email support", starter: true, professional: true },
  { name: "Priority support", starter: false, professional: true },
];

function CheckIcon({ className = "text-teal-dark" }: { className?: string }) {
  return (
    <svg className={`h-4 w-4 ${className}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4 text-ink/20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-base-dark py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-[15%] h-[300px] w-[300px] rounded-full bg-blush/[0.1] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[13px] font-semibold tracking-[0.2em] text-pink uppercase">Pricing</p>
            <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Choose your plan
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-ink/50">
              Start free and explore. Upgrade anytime to unlock the full library.
            </p>

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
          </div>

          {/* Cards */}
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`group relative flex h-full flex-col rounded-2xl border bg-white/30 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink/15 ${tier.highlighted ? "border-pink/30 ring-4 ring-pink/10 hover:border-pink hover:ring-pink/30" : "border-white/40 hover:border-pink hover:ring-4 hover:ring-pink/15"}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-pink to-blush px-6 py-1.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-pink/25">Most Popular</span>
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
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink/60">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-dark" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
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
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-base-dark/50 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Compare plans
          </h2>
          <p className="mt-4 text-center text-ink/50">See exactly what you get with each plan.</p>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/40 bg-white/30 backdrop-blur-sm shadow-xl shadow-ink/[0.06]">
            <div className="grid grid-cols-3 border-b border-white/40 bg-white/20 px-6 py-4">
              <div className="text-sm font-semibold text-ink">Feature</div>
              <div className="text-center text-sm font-semibold text-ink/50">Starter</div>
              <div className="text-center text-sm font-semibold text-pink">Professional</div>
            </div>
            {comparisonFeatures.map((feature, index) => (
              <div
                key={feature.name}
                className={`grid grid-cols-3 items-center px-6 py-3.5 ${
                  index < comparisonFeatures.length - 1 ? "border-b border-white/20" : ""
                } ${index % 2 === 0 ? "" : "bg-white/10"}`}
              >
                <div className="text-sm text-ink/70">{feature.name}</div>
                <div className="flex justify-center text-sm text-ink/50">
                  {typeof feature.starter === "boolean" ? (feature.starter ? <CheckIcon /> : <XIcon />) : <span>{feature.starter}</span>}
                </div>
                <div className="flex justify-center text-sm text-ink/50">
                  {typeof feature.professional === "boolean" ? (feature.professional ? <CheckIcon className="text-pink" /> : <XIcon />) : <span className="font-medium text-ink">{feature.professional}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-base-dark py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/[0.08] blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Ready to save hours on lesson planning?
          </h2>
          <p className="mt-4 text-base text-ink/50">
            Join educators who trust Curly Girl ELD. Start free today.
          </p>
          <div className="mt-10">
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-full bg-pink px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink/25 ring-2 ring-transparent transition-all duration-300 hover:bg-pink-dark hover:shadow-2xl hover:shadow-pink/40 hover:-translate-y-1 hover:scale-105 hover:ring-gold"
            >
              GET STARTED
              <span className="relative h-5 w-5">
                <svg className="absolute inset-0 h-5 w-5 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                <svg className="absolute inset-0 h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
