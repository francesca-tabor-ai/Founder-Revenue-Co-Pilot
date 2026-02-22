"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const FEATURED_APPS = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Sync revenue, subscriptions, and customers directly from Stripe. Real-time MRR and usage-based billing.",
    category: "Billing",
    logo: "💳",
  },
  {
    id: "paddle",
    name: "Paddle",
    description: "Connect Paddle for SaaS billing, tax handling, and revenue attribution across multiple currencies.",
    category: "Billing",
    logo: "🛒",
  },
  {
    id: "slack",
    name: "Slack Notifications",
    description: "Get alerts for new revenue events, churn risks, and MRR milestones in your Slack channels.",
    category: "Alerts",
    logo: "💬",
  },
  {
    id: "notion",
    name: "Notion Sync",
    description: "Push revenue summaries and customer insights into Notion databases for team visibility.",
    category: "Reporting",
    logo: "📋",
  },
];

const CATEGORIES = ["All", "Billing", "Alerts", "Reporting", "Analytics", "Automation"];

export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="text-caption mb-2 font-semibold uppercase tracking-wider text-[var(--color-accent-mid)]">
              App Marketplace
            </p>
            <h1 className="text-display mb-4 text-[var(--color-text-primary)] md:text-5xl">
              Extend your revenue stack
            </h1>
            <p className="text-body-lg mb-10 max-w-2xl text-[var(--color-text-secondary)]">
              Connect apps to automate workflows, sync billing data, and build advanced revenue operations.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/marketplace/build"
                className="micro-btn inline-flex items-center gap-2 rounded-xl border-2 border-[var(--color-text-primary)] bg-white px-5 py-2.5 text-body-sm font-medium text-[var(--color-text-primary)] shadow-sm hover:bg-[var(--color-bg-subtle)]"
              >
                Build an app
              </Link>
              <Link
                href="/api-docs"
                className="micro-link text-body-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                View API Docs →
              </Link>
            </div>
          </div>
        </section>

        {/* App grid */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-h2 text-[var(--color-text-primary)]">Featured apps</h2>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-body-sm font-medium transition-colors ${
                    cat === "All"
                      ? "bg-[var(--color-text-primary)] text-white"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {FEATURED_APPS.map((app) => (
              <Link
                key={app.id}
                href={`/marketplace/${app.id}`}
                className="micro-card group flex gap-4 rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-2xl">
                  {app.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-h4 text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-mid)]">
                      {app.name}
                    </h3>
                    <span className="rounded bg-[var(--color-bg-subtle)] px-2 py-0.5 text-caption font-medium text-[var(--color-text-muted)]">
                      {app.category}
                    </span>
                  </div>
                  <p className="text-body-sm text-[var(--color-text-secondary)]">{app.description}</p>
                  <span className="mt-2 inline-block text-body-sm font-medium text-[var(--color-accent-mid)]">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Build CTA */}
          <div className="mt-16 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-12 text-center">
            <h3 className="text-h3 mb-2 text-[var(--color-text-primary)]">Want to build your own app?</h3>
            <p className="mb-6 max-w-lg mx-auto text-body-sm text-[var(--color-text-secondary)]">
              Join our developer program. Build integrations that connect to Founder Revenue Co-Pilot, list them in the marketplace, and reach thousands of founders.
            </p>
            <Link
              href="/marketplace/build"
              className="micro-btn inline-flex items-center gap-2 rounded-xl bg-[var(--color-text-primary)] px-6 py-3 text-body font-medium text-white shadow-sm hover:opacity-90"
            >
              Apply to build an app
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
