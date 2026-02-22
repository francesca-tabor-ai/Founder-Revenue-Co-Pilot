"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const REQUEST_TYPES = [
  { id: "support", label: "Customer support request", value: "Customer Support Request" },
  { id: "bug", label: "Bug report", value: "Bug Report" },
  { id: "general", label: "General inquiry", value: "General Inquiry" },
] as const;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState<string>("support");
  const [message, setMessage] = useState("");

  const buildMailto = () => {
    const subject = encodeURIComponent(
      `[Founder Revenue Co-Pilot] ${REQUEST_TYPES.find((r) => r.id === requestType)?.value ?? "Contact"} ${name ? `from ${name}` : ""}`.trim()
    );
    const body = encodeURIComponent(
      [
        message && `Message:\n${message}`,
        name && `\n---\nName: ${name}`,
        email && `Email: ${email}`,
        `Request type: ${REQUEST_TYPES.find((r) => r.id === requestType)?.value ?? requestType}`,
      ]
        .filter(Boolean)
        .join("\n")
    );
    return `mailto:info@francescatabor.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = buildMailto();
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <section className="mx-auto max-w-xl px-6 py-16">
          <div className="mb-10">
            <p className="text-caption mb-2 font-semibold uppercase tracking-wider text-[var(--color-accent-mid)]">
              Contact us
            </p>
            <h1 className="text-display mb-4 text-[var(--color-text-primary)] md:text-5xl">
              Get in touch
            </h1>
            <p className="text-body text-[var(--color-text-secondary)]">
              Customer support, bug reports, or general questions—we&apos;ll get back to you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-body-sm mb-2 block font-medium text-[var(--color-text-primary)]"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="micro-input w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-mid)] focus:ring-offset-2"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-body-sm mb-2 block font-medium text-[var(--color-text-primary)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="micro-input w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-mid)] focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="text-body-sm mb-2 block font-medium text-[var(--color-text-primary)]">
                Request type
              </label>
              <div className="space-y-2">
                {REQUEST_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="micro-input flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 transition-colors has-[:checked]:border-[var(--color-accent-mid)] has-[:checked]:bg-[var(--color-accent-mid)]/5"
                  >
                    <input
                      type="radio"
                      name="requestType"
                      value={type.id}
                      checked={requestType === type.id}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="h-4 w-4 accent-[var(--color-accent-mid)]"
                    />
                    <span className="text-body-sm text-[var(--color-text-primary)]">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-body-sm mb-2 block font-medium text-[var(--color-text-primary)]"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help..."
                rows={5}
                required
                className="micro-input w-full resize-y rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-mid)] focus:ring-offset-2"
              />
            </div>

            <p className="text-caption text-[var(--color-text-muted)]">
              Submissions open your email client with a pre-filled message to{" "}
              <span className="font-medium text-[var(--color-text-primary)]">info@francescatabor.com</span>. You can review and send from there.
            </p>

            <button
              type="submit"
              className="micro-btn w-full rounded-xl bg-[var(--color-text-primary)] py-4 text-body font-medium text-white shadow-sm hover:opacity-90"
            >
              Open email to send
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
