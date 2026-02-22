import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const LOGOS = [
  { name: "Vercel", slug: "vercel" },
  { name: "Stripe", slug: "stripe" },
  { name: "Linear", slug: "linear" },
  { name: "Vercel", slug: "vercel" },
  { name: "Stripe", slug: "stripe" },
  { name: "Linear", slug: "linear" },
];

const CASE_STUDIES = [
  {
    company: "Nexus AI",
    tagline: "AI infrastructure for developers",
    quote: "We went from spreadsheets and manual reconciliation to a single source of truth in under a week. Founder Revenue Co-Pilot gave us back 12 hours a month.",
    author: "Sarah Chen",
    role: "Founder & CEO",
    results: [
      { label: "Time to first revenue", value: "5 days" },
      { label: "Hours saved monthly", value: "12 hrs" },
      { label: "Tooling cost reduction", value: "65%" },
    ],
  },
  {
    company: "Dataflow",
    tagline: "Real-time data pipelines",
    quote: "Our team is 4 people. We don't have RevOps. This platform is the closest thing to having a revenue co-pilot—calm, reliable, no drama.",
    author: "Marcus Webb",
    role: "Technical Founder",
    results: [
      { label: "MRR tracked", value: "$85K" },
      { label: "Setup time", value: "< 1 day" },
      { label: "Integrations", value: "3" },
    ],
  },
  {
    company: "Stackify",
    tagline: "Developer experience platform",
    quote: "We evaluated enterprise tools that wanted $50K/year. Founder Revenue Co-Pilot gave us everything we needed at 1/10th the cost. The API-first approach sealed the deal.",
    author: "Priya Patel",
    role: "CTO & Co-founder",
    results: [
      { label: "Cost vs enterprise", value: "~90% less" },
      { label: "API calls/month", value: "50K+" },
      { label: "Team size", value: "8" },
    ],
  },
];

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="flex h-12 min-w-[120px] items-center justify-center rounded-lg border border-[var(--color-border)] bg-white px-6 font-semibold text-[var(--color-text-muted)]"
      title={name}
    >
      {name}
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Scrolling logos */}
        <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-12">
          <p className="text-caption mb-8 text-center font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Trusted by founders at
          </p>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll gap-8">
              {LOGOS.map((logo, i) => (
                <LogoPlaceholder key={`${logo.slug}-${i}`} name={logo.name} />
              ))}
              {LOGOS.map((logo, i) => (
                <LogoPlaceholder key={`${logo.slug}-dup-${i}`} name={logo.name} />
              ))}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-16 text-center">
            <p className="text-caption mb-2 font-semibold uppercase tracking-wider text-[var(--color-accent-mid)]">
              Case Studies
            </p>
            <h1 className="text-display mb-4 text-[var(--color-text-primary)] md:text-5xl">
              How founders ship revenue faster
            </h1>
            <p className="text-body-lg mx-auto max-w-2xl text-[var(--color-text-secondary)]">
              Real stories from technical founders who switched from spreadsheets 
              and enterprise bloat to calm, developer-first infrastructure.
            </p>
          </div>

          <div className="space-y-20">
            {CASE_STUDIES.map((study, index) => (
              <article
                key={study.company}
                className={`grid gap-12 md:grid-cols-2 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] font-bold text-[var(--color-text-primary)]">
                    {study.company.charAt(0)}
                  </div>
                  <h2 className="text-h2 mt-4 text-[var(--color-text-primary)]">
                    {study.company}
                  </h2>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    {study.tagline}
                  </p>
                  <blockquote className="mt-6 border-l-4 border-[var(--color-accent-mid)] pl-6 text-body-lg italic text-[var(--color-text-secondary)]">
                    &ldquo;{study.quote}&rdquo;
                  </blockquote>
                  <p className="mt-4 text-body-sm font-medium text-[var(--color-text-primary)]">
                    {study.author}
                  </p>
                  <p className="text-caption">{study.role}</p>
                </div>
                <div
                  className={`flex flex-col justify-center gap-4 ${index % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {study.results.map((r) => (
                      <div
                        key={r.label}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-center"
                      >
                        <p className="text-data text-xl text-[var(--color-text-primary)]">
                          {r.value}
                        </p>
                        <p className="text-caption mt-1">{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-h2 mb-4 text-[var(--color-text-primary)]">
              Join founders who ship revenue, not spreadsheets
            </h2>
            <p className="text-body-lg mb-8 text-[var(--color-text-secondary)]">
              Start your free trial. No credit card required.
            </p>
            <Link
              href="/pricing"
              className="inline-block rounded-full bg-[var(--color-text-primary)] px-8 py-3 font-medium text-white transition-colors hover:bg-[var(--color-text-primary)]/90"
            >
              View pricing
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
