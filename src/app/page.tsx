import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        {/* Hero section — gradient accent used sparingly, lots of white space */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-body-sm font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Revenue infrastructure for founders
            </p>
            <h1 className="mb-6 text-display font-bold tracking-tight text-[var(--color-text-primary)]">
              Built for the builders.
            </h1>
            <p className="mb-10 max-w-xl text-body-lg leading-relaxed text-[var(--color-text-secondary)]">
              Developer-first tools that just work. Calm, confident, quietly
              powerful — invisible infrastructure rather than flashy marketing.
            </p>
            <div className="flex gap-4">
              <Link
                href="/pricing"
                className="micro-btn inline-flex items-center gap-2 rounded-xl bg-[var(--color-text-primary)] px-6 py-3 text-body font-medium text-white shadow-sm hover:opacity-90"
              >
                Start free trial
              </Link>
              <Link
                href="/case-studies"
                className="micro-btn inline-flex items-center rounded-xl border border-[var(--color-border)] px-6 py-3 text-body font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)]"
              >
                View demo
              </Link>
            </div>
          </div>
          {/* Gradient accent strip — guides attention */}
          <div
            className="mt-20 h-1 w-full max-w-md rounded-full opacity-90"
            style={{
              background:
                "linear-gradient(90deg, #7c3aed 0%, #3b82f6 35%, #ec4899 70%, #f97316 100%)",
            }}
          />
        </section>

        {/* Dashboard preview — rounded UI, cool greys (lazy reveal) */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
          <FadeIn className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="mb-3 text-h2 font-semibold text-[var(--color-text-primary)]">
              Your revenue at a glance
            </h2>
            <p className="mb-12 max-w-xl text-body text-[var(--color-text-secondary)]">
              Clear, neutral, optimized for data readability.
            </p>
            <div className="micro-card overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-md)]">
              <div className="border-b border-[var(--color-border)] px-6 py-5">
                <h3 className="text-h4 font-semibold text-[var(--color-text-primary)]">
                  Revenue overview
                </h3>
              </div>
              <div className="grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
                {[
                  { label: "MRR", value: "$42,500", change: "+12%" },
                  { label: "Churn", value: "2.1%", change: "-0.3%" },
                  { label: "LTV", value: "$1,240", change: "+8%" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-white px-6 py-5"
                  >
                    <p className="text-caption text-[var(--color-text-muted)]">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-text-primary)]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-body-sm font-medium text-emerald-600">
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* CTA section — /#cta target for nav and pricing links */}
        <section id="cta" className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-h2 mb-4 text-[var(--color-text-primary)]">
              Ready to ship revenue?
            </h2>
            <p className="text-body-lg mb-8 text-[var(--color-text-secondary)]">
              Start your 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="micro-btn inline-flex items-center rounded-xl bg-[var(--color-text-primary)] px-8 py-3 text-body font-medium text-white shadow-sm hover:opacity-90"
              >
                Get started free
              </Link>
              <Link
                href="/pricing"
                className="micro-btn inline-flex items-center rounded-xl border border-[var(--color-border-strong)] px-8 py-3 text-body font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
