import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — accent gradient used sparingly */}
      <header className="border-b border-[#e5e5e5] bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-h4 font-semibold text-[#0a0a0a]">
            Founder Revenue Co-Pilot
          </span>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-body text-[#525252] transition-colors hover:text-[#0a0a0a]"
            >
              Product
            </Link>
            <Link
              href="#"
              className="text-body text-[#525252] transition-colors hover:text-[#0a0a0a]"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="rounded-xl bg-[#0a0a0a] px-5 py-2.5 text-body font-medium text-white transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero section — gradient accent, lots of white space */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-body-sm font-medium uppercase tracking-wide text-[#737373]">
              Revenue infrastructure for founders
            </p>
            <h1 className="mb-6 text-display font-bold tracking-tight text-[#0a0a0a]">
              Built for the builders.
            </h1>
            <p className="mb-10 max-w-xl text-body-lg leading-relaxed text-[#525252]">
              Developer-first tools that just work. Calm, confident, quietly
              powerful — invisible infrastructure rather than flashy marketing.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0a0a0a] px-6 py-3 text-body font-medium text-white shadow-sm transition-all hover:opacity-90"
              >
                Start free trial
              </Link>
              <Link
                href="#"
                className="inline-flex items-center rounded-xl border border-[#e5e5e5] px-6 py-3 text-body font-medium text-[#0a0a0a] transition-colors hover:border-[#d4d4d4] hover:bg-[#fafafa]"
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

        {/* Dashboard preview — rounded UI, cool greys */}
        <section className="border-t border-[#e5e5e5] bg-[#fafafa]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="mb-3 text-h2 font-semibold text-[#0a0a0a]">
              Your revenue at a glance
            </h2>
            <p className="mb-12 max-w-xl text-body text-[#525252]">
              Clear, neutral, optimized for data readability.
            </p>
            <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
              <div className="border-b border-[#e5e5e5] px-6 py-5">
                <h3 className="text-h4 font-semibold text-[#0a0a0a]">
                  Revenue overview
                </h3>
              </div>
              <div className="grid gap-px bg-[#e5e5e5] sm:grid-cols-3">
                {[
                  { label: "MRR", value: "$42,500", change: "+12%" },
                  { label: "Churn", value: "2.1%", change: "-0.3%" },
                  { label: "LTV", value: "$1,240", change: "+8%" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-white px-6 py-5"
                  >
                    <p className="text-caption text-[#737373]">{metric.label}</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-[#0a0a0a]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-body-sm font-medium text-emerald-600">
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer — minimal */}
        <footer className="border-t border-[#e5e5e5] py-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-caption text-[#737373]">
              © 2025 Founder Revenue Co-Pilot. Developer-first.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
