"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PLANS = [
  {
    id: "individual",
    name: "Individual",
    description: "For solo founders and side projects",
    price: 29,
    priceLabel: "/month",
    features: [
      "Up to $10K MRR tracked",
      "Single user",
      "Core revenue dashboard",
      "Basic billing & invoicing",
      "Email support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    id: "team",
    name: "Team",
    description: "For growing teams and product-focused startups",
    price: 99,
    priceLabel: "/month",
    features: [
      "Up to $100K MRR tracked",
      "Up to 10 team members",
      "Everything in Individual",
      "Usage-based billing",
      "API access",
      "Shared dashboards & reports",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For scaling companies with custom needs",
    price: null,
    priceLabel: "Custom",
    features: [
      "Unlimited MRR",
      "Unlimited team members",
      "Everything in Team",
      "Custom integrations",
      "Dedicated success manager",
      "SLA & compliance support",
      "On-premise option",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

function formatNumber(n: number) {
  if (n >= 1000) return `${n / 1000}K`;
  return n.toString();
}

export default function PricingPage() {
  const [mrr, setMrr] = useState(25000);
  const [teamSize, setTeamSize] = useState(3);

  const suggestedPlan =
    mrr > 100000 || teamSize > 10
      ? "enterprise"
      : mrr > 10000 || teamSize > 1
        ? "team"
        : "individual";

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="text-center">
            <p className="text-caption mb-2 font-semibold uppercase tracking-wider text-[var(--color-accent-mid)]">
              Pricing
            </p>
            <h1 className="text-display mb-4 text-[var(--color-text-primary)] md:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="text-body-lg mx-auto max-w-2xl text-[var(--color-text-secondary)]">
              Start free. Scale as you grow. No per-seat gotchas.
            </p>
          </div>
        </section>

        {/* Scaling calculator */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-h3 mb-8 text-center text-[var(--color-text-primary)]">
              Find your plan
            </h2>
            <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <label className="text-body-sm mb-2 block font-medium text-[var(--color-text-primary)]">
                  Monthly recurring revenue (MRR)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1000}
                    max={500000}
                    step={1000}
                    value={mrr}
                    onChange={(e) => setMrr(Number(e.target.value))}
                    className="h-2 flex-1 rounded-full bg-[var(--color-border)] accent-[var(--color-accent-mid)]"
                  />
                  <span className="text-data min-w-[4rem] text-[var(--color-text-primary)]">
                    ${formatNumber(mrr)}
                  </span>
                </div>
              </div>
              <div className="flex-1 sm:border-l sm:border-[var(--color-border)] sm:pl-6">
                <label className="text-body-sm mb-2 block font-medium text-[var(--color-text-primary)]">
                  Team size
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={25}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="h-2 flex-1 rounded-full bg-[var(--color-border)] accent-[var(--color-accent-mid)]"
                  />
                  <span className="text-data min-w-[2rem] text-[var(--color-text-primary)]">
                    {teamSize}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-[var(--color-text-muted)]">
              We recommend{" "}
              <span className="font-medium capitalize text-[var(--color-text-primary)]">
                {suggestedPlan}
              </span>{" "}
              for your stage
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-[var(--color-accent-mid)] bg-[var(--color-accent-mid)]/5 shadow-[var(--shadow-lg)]"
                    : "border-[var(--color-border)] bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent-mid)] px-4 py-1 text-xs font-semibold text-white">
                    Most popular
                  </div>
                )}
                <h3 className="text-h3 text-[var(--color-text-primary)]">{plan.name}</h3>
                <p className="mt-1 text-body-sm text-[var(--color-text-secondary)]">
                  {plan.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  {plan.price !== null ? (
                    <>
                      <span className="text-display text-[var(--color-text-primary)]">
                        ${plan.price}
                      </span>
                      <span className="text-body text-[var(--color-text-muted)]">
                        {plan.priceLabel}
                      </span>
                    </>
                  ) : (
                    <span className="text-display text-[var(--color-text-primary)]">
                      {plan.priceLabel}
                    </span>
                  )}
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-body-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="text-[var(--color-accent-mid)]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.id === "enterprise" ? "/contact" : "/#cta"}
                  className={`mt-8 block w-full rounded-full py-3 text-center font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-[var(--color-accent-mid)] text-white hover:opacity-90"
                      : "border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ or trust note */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="text-body text-[var(--color-text-secondary)]">
              All plans include a 14-day free trial. No credit card required. 
              Scale up or down anytime.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
