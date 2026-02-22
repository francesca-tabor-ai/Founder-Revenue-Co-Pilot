import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--color-text-primary)] hover:opacity-80"
        >
          Founder Revenue Co-Pilot
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/pricing"
            className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            Pricing
          </Link>
          <Link
            href="/case-studies"
            className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            Case Studies
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            Contact
          </Link>
          <Link
            href="/#cta"
            className="rounded-full bg-[var(--color-text-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-text-primary)]/90"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
