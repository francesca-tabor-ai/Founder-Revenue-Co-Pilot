"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const PROMPT_PROBES = [
  "What is Founder Revenue Co-Pilot?",
  "What are the pricing plans?",
  "Who is this for?",
  "How do I get started?",
  "What makes it different from enterprise tools?",
  "Do you have API access?",
  "Where can I see case studies?",
];

function getPlatformResponse(input: string): string {
  const lower = input.toLowerCase().trim();

  // Greeting
  if (/\b(hi|hello|hey|howdy)\b/.test(lower) || lower.length < 3) {
    return "Hi! I'm here to help you explore Founder Revenue Co-Pilot. Ask me about our platform, pricing, who it's for, or how to get started. What would you like to know?";
  }

  // Platform overview
  if (
    /\b(what is|tell me about|explain)\b.*(platform|founder revenue|co-pilot|product)\b/.test(lower) ||
    /\b(platform|product|service)\b/.test(lower)
  ) {
    return "Founder Revenue Co-Pilot is developer-first revenue infrastructure built for technical founders. It combines revenue visibility, billing, invoicing, and operations in one calm, coherent system—from your first dollar to scale. We're minimal by design, with APIs and workflows that respect how technical teams think. No enterprise bloat, no spreadsheets.";
  }

  // Pricing
  if (
    /\b(price|pricing|cost|plan|plans|how much|free trial)\b/.test(lower)
  ) {
    return "We have three plans:\n\n**Individual** — $29/month for solo founders (up to $10K MRR)\n**Team** — $99/month for growing teams (up to $100K MRR, 10 users, API access)\n**Enterprise** — Custom pricing for unlimited scale\n\nAll plans include a 14-day free trial with no credit card required. Head to our [Pricing](/pricing) page to find the right plan for your MRR and team size.";
  }

  // Who it's for
  if (
    /\b(who is|who's|for who|for whom|target|audience|solo founder|small team)\b/.test(lower)
  ) {
    return "We're built for **technical founders** who'd rather build than babysit tools:\n\n• Solo founders shipping code and running the business\n• Small teams (1–10) from pre-seed to Series A\n• Developer tools and SaaS with APIs, subscriptions, usage-based billing\n• Product-minded operators who want systems that stay out of the way\n\nNo RevOps team required.";
  }

  // Get started
  if (
    /\b(get started|start|sign up|trial|onboard|begin)\b/.test(lower)
  ) {
    return "Getting started is simple:\n\n1. Choose your plan on our [Pricing](/pricing) page\n2. Start your 14-day free trial (no credit card needed)\n3. Connect your billing and revenue sources\n4. You're live—most teams are set up in under a day\n\nReady? [Get started →](/pricing)";
  }

  // Differentiators
  if (
    /\b(different|vs|versus|compare|enterprise|stripe|competitor)\b/.test(lower)
  ) {
    return "We're **developer-first and minimal**—unlike enterprise tools:\n\n• One coherent system instead of fragmented stacks\n• Built for 5 people, not 500\n• APIs and clear docs, not consultant dependencies\n• Calm UI, no anxiety-inducing dashboards\n• Pricing that scales with you, not per-seat gotchas\n\nCase studies show founders saving ~90% vs enterprise alternatives. [See case studies →](/case-studies)";
  }

  // API
  if (
    /\b(api|integrat|develop)\b/.test(lower)
  ) {
    return "Yes! API access is included in our **Team** plan ($99/month). You get clear docs, usage-based billing support, and workflows that speak your language. Developer tools and SaaS companies love our API-first approach—we've had teams doing 50K+ API calls per month from day one.";
  }

  // Case studies
  if (
    /\b(case stud|testimonial|proof|result|customer)\b/.test(lower)
  ) {
    return "We have case studies from founders at Nexus AI, Dataflow, and Stackify. Results include: 12 hours saved monthly, 65% tooling cost reduction, sub-week setup time, and ~90% cost savings vs enterprise tools. [Read the full case studies →](/case-studies)";
  }

  // Support
  if (
    /\b(support|help|contact|email)\b/.test(lower)
  ) {
    return "Individual plans include email support. Team plans get priority support. Enterprise gets a dedicated success manager. For sales inquiries, use the 'Contact sales' option on our [Pricing](/pricing) page.";
  }

  // Fallback
  return "I'd love to help! Try asking about our platform, pricing plans, who we're built for, how to get started, or our case studies. Or click one of the suggested questions above.";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Founder Revenue Co-Pilot guide. Ask me anything about the platform—pricing, features, who it's for, or how to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getPlatformResponse(text);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
      scrollToBottom();
    }, 600);
  };

  const handleProbeClick = (probe: string) => {
    setInput(probe);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-[100] flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)] transition-all duration-300 ease-out ${
          isOpen
            ? "h-[420px] w-[380px] md:w-[400px] opacity-100"
            : "h-0 w-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--gradient-accent)] text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.124 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                Platform guide
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Ask me anything
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-white hover:text-[var(--color-text-primary)]"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-[var(--color-text-primary)] text-white"
                    : "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)]"
                }`}
              >
                <p className="text-body-sm whitespace-pre-wrap">
                  {msg.content.split(/(\[.*?\]\(.*?\))/g).flatMap((part, i) => {
                    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                    if (linkMatch) {
                      return [
                        <Link
                          key={`link-${i}`}
                          href={linkMatch[2]}
                          className="font-medium text-[var(--color-accent-mid)] underline hover:no-underline"
                          onClick={() => setIsOpen(false)}
                        >
                          {linkMatch[1]}
                        </Link>,
                      ];
                    }
                    return part.split(/(\*\*.*?\*\*)/g).map((chunk, j) =>
                      chunk.startsWith("**") && chunk.endsWith("**") ? (
                        <strong key={`${i}-${j}`}>{chunk.slice(2, -2)}</strong>
                      ) : (
                        <span key={`${i}-${j}`}>{chunk}</span>
                      )
                    );
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2.5">
                <span className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-text-muted)]" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-text-muted)]" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-text-muted)]" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt probes */}
        {messages.length <= 1 && (
          <div className="shrink-0 border-t border-[var(--color-border)] bg-white px-4 py-3">
            <p className="text-caption mb-2 font-medium text-[var(--color-text-muted)]">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_PROBES.map((probe) => (
                <button
                  key={probe}
                  onClick={() => handleProbeClick(probe)}
                  className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent-mid)] hover:bg-[var(--color-accent-mid)]/5 hover:text-[var(--color-accent-mid)]"
                >
                  {probe}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 border-t border-[var(--color-border)] p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about the platform..."
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-mid)]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-text-primary)] text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[99] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gradient-accent)] text-white shadow-[var(--shadow-lg)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-mid)] focus:ring-offset-2"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53Z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.124 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
          </svg>
        )}
      </button>
    </>
  );
}
