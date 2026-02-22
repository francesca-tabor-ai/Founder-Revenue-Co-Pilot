"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const APPS: Record<string, { name: string; description: string; category: string; logo: string; features: string[] }> = {
  stripe: {
    name: "Stripe",
    description: "Sync revenue, subscriptions, and customers directly from Stripe. Real-time MRR and usage-based billing.",
    category: "Billing",
    logo: "💳",
    features: ["Real-time revenue sync", "Subscription mapping", "Customer attribution", "Webhook events"],
  },
  paddle: {
    name: "Paddle",
    description: "Connect Paddle for SaaS billing, tax handling, and revenue attribution across multiple currencies.",
    category: "Billing",
    logo: "🛒",
    features: ["Paddle checkout sync", "Multi-currency support", "Tax compliance data", "Customer records"],
  },
  slack: {
    name: "Slack Notifications",
    description: "Get alerts for new revenue events, churn risks, and MRR milestones in your Slack channels.",
    category: "Alerts",
    logo: "💬",
    features: ["Revenue event alerts", "MRR milestone notifications", "Churn risk warnings", "Custom channels"],
  },
  notion: {
    name: "Notion Sync",
    description: "Push revenue summaries and customer insights into Notion databases for team visibility.",
    category: "Reporting",
    logo: "📋",
    features: ["Automated database updates", "Revenue dashboards", "Customer sync", "Scheduled reports"],
  },
};

export default function AppDetailPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const app = APPS[slug];

  if (!app) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <h1 className="text-h2 mb-4 text-[var(--color-text-primary)]">App not found</h1>
            <p className="mb-8 text-[var(--color-text-secondary)]">
              This app is not yet available or the link may be incorrect.
            </p>
            <Link
              href="/marketplace"
              className="micro-btn inline-flex rounded-xl bg-[var(--color-text-primary)] px-5 py-2.5 text-body-sm font-medium text-white"
            >
              Browse marketplace
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <Link
            href="/marketplace"
            className="micro-link mb-8 inline-flex items-center gap-1 text-body-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            ← Marketplace
          </Link>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-4xl">
              {app.logo}
            </div>
            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-[var(--color-accent-mid)]">
                {app.category}
              </span>
              <h1 className="text-display mt-1 text-[var(--color-text-primary)] md:text-5xl">
                {app.name}
              </h1>
              <p className="mt-4 text-body-lg text-[var(--color-text-secondary)]">{app.description}</p>
              <button
                type="button"
                className="micro-btn mt-6 rounded-xl bg-[var(--color-text-primary)] px-6 py-3 text-body font-medium text-white shadow-sm hover:opacity-90"
              >
                Connect app
              </button>
            </div>
          </div>

          <section className="mt-16">
            <h2 className="text-h3 mb-6 text-[var(--color-text-primary)]">Features</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {app.features.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3"
                >
                  <span className="text-[var(--color-accent-mid)]">✓</span>
                  <span className="text-body-sm text-[var(--color-text-primary)]">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-8">
            <h3 className="text-h4 mb-2 text-[var(--color-text-primary)]">Build your own</h3>
            <p className="text-body-sm text-[var(--color-text-secondary)]">
              Want to create an integration? Apply to our developer program.
            </p>
            <Link
              href="/marketplace/build"
              className="micro-link mt-4 inline-block text-body-sm font-medium text-[var(--color-accent-mid)]"
            >
              Apply to build an app →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
