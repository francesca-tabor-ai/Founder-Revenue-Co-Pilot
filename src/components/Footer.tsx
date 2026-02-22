import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="micro-link text-h4 font-semibold tracking-tight text-[var(--color-text-primary)]"
            >
              Founder Revenue Co-Pilot
            </Link>
            <p className="mt-2 text-body-sm text-[var(--color-text-muted)]">
              Developer-first revenue infrastructure.
            </p>
          </div>
          <div className="flex gap-8">
            <Link
              href="/pricing"
              className="micro-link text-body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Pricing
            </Link>
            <Link
              href="/case-studies"
              className="micro-link text-body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Case Studies
            </Link>
            <Link
              href="/contact"
              className="micro-link text-body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Contact
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--color-border)] pt-8 text-caption text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} Founder Revenue Co-Pilot. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
