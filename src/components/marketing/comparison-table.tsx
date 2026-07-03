"use client";

import { RevealDiv } from "./reveal-div";
import { useBillingToggle } from "@/stores/billing-toggle-store";

/* ── Shared features (identical across billing periods) ── */
const sharedFeatures = [
  { name: "Lessons delivered / month", starter: "2", essential: "4", proPlus: "6" },
  { name: "Lesson bundle", starter: "Core plans", essential: "Scope & sequence", proPlus: "Full curriculum" },
  { name: "Plan flexibility", starter: "Fixed", essential: "2-3 swap options", proPlus: "Full library access" },
];

const monthlyCreditsRow = { name: "Quarterly store credit", starter: "$5", essential: "$10", proPlus: "$20" };
const yearlyCreditsRow = { name: "Store credit (upfront on Day 1)", starter: "$20", essential: "$40", proPlus: "$80" };

const remainingFeatures = [
  { name: "Credits expire?", starter: "Never" as string | boolean, essential: "Never" as string | boolean, proPlus: "Never" as string | boolean },
  { name: "New plans added monthly", starter: true, essential: true, proPlus: true },
  { name: "Scope & sequence curriculum", starter: false, essential: true, proPlus: true },
  { name: "Custom lesson planning dashboard", starter: false, essential: false, proPlus: true },
  { name: "Office hours access", starter: false, essential: false, proPlus: true },
  { name: "Standards alignment tags", starter: true, essential: true, proPlus: true },
  { name: "Email support", starter: true, essential: true, proPlus: true },
  { name: "Priority support", starter: false, essential: true, proPlus: true },
];

/* ── Pricing per tier ── */
const pricing = {
  monthly: { starter: "$14.99", essential: "$19.99", proPlus: "$29.99" },
  yearly: { starter: "$9.99", essential: "$14.99", proPlus: "$24.99" },
};

function renderComparisonCell(value: boolean | string, accent?: boolean) {
  if (typeof value === "boolean") {
    return value ? (
      <svg className={`h-4 w-4 ${accent ? "text-pink" : "text-teal-dark"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
    ) : (
      <svg className="h-4 w-4 text-ink/20" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    );
  }
  return <span className={accent ? "font-medium text-ink" : ""}>{value}</span>;
}

export function ComparisonTable() {
  const { yearly, setYearly } = useBillingToggle();

  const creditsRow = yearly ? yearlyCreditsRow : monthlyCreditsRow;
  const features = [...sharedFeatures, creditsRow, ...remainingFeatures];
  const prices = yearly ? pricing.yearly : pricing.monthly;

  return (
    <section id="compare-plans" className="bg-base-dark/50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <RevealDiv>
          <h2 className="text-center font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Compare plans
          </h2>
        </RevealDiv>
        <RevealDiv delay="delay-100">
          <p className="mt-4 text-center text-ink/50">See exactly what you get with each plan.</p>

          {/* Monthly / Yearly toggle */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/30 p-1 backdrop-blur-sm">
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
        </RevealDiv>

        <RevealDiv delay="delay-200">
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/40 bg-white/30 shadow-xl shadow-ink/[0.06] backdrop-blur-sm">
            {/* Header with tier names + prices */}
            <div className="grid grid-cols-4 border-b border-white/40 bg-white/20 px-6 py-4">
              <div className="text-sm font-semibold text-ink">Feature</div>
              <div className="text-center">
                <div className="text-sm font-semibold text-ink/50">Starter</div>
                <div className="text-lg font-bold text-ink/70">{prices.starter}<span className="text-xs font-normal text-ink/40">/mo</span></div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-pink">Essential</div>
                <div className="text-lg font-bold text-pink">{prices.essential}<span className="text-xs font-normal text-pink/60">/mo</span></div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-ink/50">Pro Plus</div>
                <div className="text-lg font-bold text-ink/70">{prices.proPlus}<span className="text-xs font-normal text-ink/40">/mo</span></div>
              </div>
            </div>

            {/* Feature rows */}
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`grid grid-cols-4 items-center px-6 py-3.5 ${
                  index < features.length - 1 ? "border-b border-white/20" : ""
                } ${index % 2 === 0 ? "" : "bg-white/10"}`}
              >
                <div className="text-sm text-ink/70">{feature.name}</div>
                <div className="flex justify-center text-sm text-ink/50">
                  {renderComparisonCell(feature.starter)}
                </div>
                <div className="flex justify-center text-sm text-ink/50">
                  {renderComparisonCell(feature.essential, true)}
                </div>
                <div className="flex justify-center text-sm text-ink/50">
                  {renderComparisonCell(feature.proPlus)}
                </div>
              </div>
            ))}
          </div>
        </RevealDiv>
      </div>
    </section>
  );
}
