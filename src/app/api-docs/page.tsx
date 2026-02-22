"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ENTITIES = [
  {
    name: "Organization",
    description: "Multi-tenant organization. Root entity for customers, revenue, and integrations.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "name", type: "string", desc: "Display name" },
      { name: "slug", type: "string", desc: "URL-safe identifier (unique)" },
      { name: "ownerId", type: "string", desc: "Owner user ID" },
    ],
  },
  {
    name: "Customer",
    description: "Customer record within an organization. Tracks billing and revenue attribution.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Parent organization" },
      { name: "email", type: "string", desc: "Customer email" },
      { name: "name", type: "string?", desc: "Customer name" },
      { name: "externalId", type: "string?", desc: "External system ID" },
      { name: "metadata", type: "object?", desc: "Custom key-value data" },
    ],
  },
  {
    name: "RevenueEvent",
    description: "Revenue transaction. Tracks MRR, one-time charges, and revenue attribution.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Parent organization" },
      { name: "customerId", type: "string?", desc: "Optional customer link" },
      { name: "amount", type: "number", desc: "Amount" },
      { name: "currency", type: "string", desc: "ISO currency (e.g. USD)" },
      { name: "type", type: "string", desc: "Event type (mrr, one_time, etc.)" },
      { name: "description", type: "string?", desc: "Human-readable description" },
      { name: "metadata", type: "object?", desc: "Custom key-value data" },
      { name: "effectiveDate", type: "datetime", desc: "Effective date" },
    ],
  },
  {
    name: "Invoice",
    description: "Invoice document. Tracks billing and payment status.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Parent organization" },
      { name: "customerId", type: "string?", desc: "Optional customer" },
      { name: "number", type: "string", desc: "Invoice number (unique)" },
      { name: "amount", type: "number", desc: "Amount" },
      { name: "currency", type: "string", desc: "ISO currency" },
      { name: "status", type: "string", desc: "draft | sent | paid | overdue" },
      { name: "dueDate", type: "datetime?", desc: "Payment due date" },
      { name: "paidAt", type: "datetime?", desc: "When paid" },
      { name: "metadata", type: "object?", desc: "Custom data" },
    ],
  },
  {
    name: "Integration",
    description: "External integration (Stripe, billing tools, custom).",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Parent organization" },
      { name: "type", type: "enum", desc: "STRIPE | BILLING | CUSTOM" },
      { name: "name", type: "string", desc: "Integration name" },
      { name: "config", type: "object?", desc: "Configuration (sensitive)" },
      { name: "isActive", type: "boolean", desc: "Active status" },
    ],
  },
  {
    name: "ApiKey",
    description: "API key for programmatic access. Scoped to organization.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Parent organization" },
      { name: "name", type: "string", desc: "Key label" },
      { name: "keyPrefix", type: "string", desc: "Prefix for display (e.g. frcp_live_…)" },
      { name: "lastUsedAt", type: "datetime?", desc: "Last use" },
      { name: "expiresAt", type: "datetime?", desc: "Expiration" },
    ],
  },
  {
    name: "Plan",
    description: "Subscription plan (Individual, Team, Enterprise).",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "name", type: "string", desc: "Plan name" },
      { name: "type", type: "enum", desc: "INDIVIDUAL | TEAM | ENTERPRISE" },
      { name: "price", type: "number", desc: "Price" },
      { name: "currency", type: "string", desc: "ISO currency" },
      { name: "interval", type: "string", desc: "month | year" },
      { name: "features", type: "object?", desc: "Feature list" },
    ],
  },
  {
    name: "Subscription",
    description: "Active subscription for an organization.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Organization" },
      { name: "planId", type: "string", desc: "Plan reference" },
      { name: "status", type: "string", desc: "active | canceled | past_due" },
      { name: "currentPeriodStart", type: "datetime", desc: "Period start" },
      { name: "currentPeriodEnd", type: "datetime", desc: "Period end" },
    ],
  },
  {
    name: "UsageMetric",
    description: "Usage tracking for metering and limits.",
    fields: [
      { name: "id", type: "string", desc: "Unique identifier" },
      { name: "organizationId", type: "string", desc: "Organization" },
      { name: "metricType", type: "string", desc: "Metric type" },
      { name: "value", type: "number", desc: "Value" },
      { name: "period", type: "string", desc: "Period (e.g. 2025-02)" },
      { name: "metadata", type: "object?", desc: "Custom data" },
    ],
  },
];

const ENDPOINTS = [
  { method: "GET", path: "/v1/organizations", entity: "Organization", desc: "List organizations" },
  { method: "POST", path: "/v1/organizations", entity: "Organization", desc: "Create organization" },
  { method: "GET", path: "/v1/organizations/:id", entity: "Organization", desc: "Get organization" },
  { method: "PATCH", path: "/v1/organizations/:id", entity: "Organization", desc: "Update organization" },
  { method: "DELETE", path: "/v1/organizations/:id", entity: "Organization", desc: "Delete organization" },
  { method: "GET", path: "/v1/customers", entity: "Customer", desc: "List customers" },
  { method: "POST", path: "/v1/customers", entity: "Customer", desc: "Create customer" },
  { method: "GET", path: "/v1/customers/:id", entity: "Customer", desc: "Get customer" },
  { method: "PATCH", path: "/v1/customers/:id", entity: "Customer", desc: "Update customer" },
  { method: "DELETE", path: "/v1/customers/:id", entity: "Customer", desc: "Delete customer" },
  { method: "GET", path: "/v1/revenue-events", entity: "RevenueEvent", desc: "List revenue events" },
  { method: "POST", path: "/v1/revenue-events", entity: "RevenueEvent", desc: "Create revenue event" },
  { method: "GET", path: "/v1/revenue-events/:id", entity: "RevenueEvent", desc: "Get revenue event" },
  { method: "PATCH", path: "/v1/revenue-events/:id", entity: "RevenueEvent", desc: "Update revenue event" },
  { method: "DELETE", path: "/v1/revenue-events/:id", entity: "RevenueEvent", desc: "Delete revenue event" },
  { method: "GET", path: "/v1/invoices", entity: "Invoice", desc: "List invoices" },
  { method: "POST", path: "/v1/invoices", entity: "Invoice", desc: "Create invoice" },
  { method: "GET", path: "/v1/invoices/:id", entity: "Invoice", desc: "Get invoice" },
  { method: "PATCH", path: "/v1/invoices/:id", entity: "Invoice", desc: "Update invoice" },
  { method: "DELETE", path: "/v1/invoices/:id", entity: "Invoice", desc: "Delete invoice" },
  { method: "GET", path: "/v1/integrations", entity: "Integration", desc: "List integrations" },
  { method: "POST", path: "/v1/integrations", entity: "Integration", desc: "Create integration" },
  { method: "GET", path: "/v1/integrations/:id", entity: "Integration", desc: "Get integration" },
  { method: "PATCH", path: "/v1/integrations/:id", entity: "Integration", desc: "Update integration" },
  { method: "DELETE", path: "/v1/integrations/:id", entity: "Integration", desc: "Delete integration" },
  { method: "GET", path: "/v1/api-keys", entity: "ApiKey", desc: "List API keys" },
  { method: "POST", path: "/v1/api-keys", entity: "ApiKey", desc: "Create API key" },
  { method: "DELETE", path: "/v1/api-keys/:id", entity: "ApiKey", desc: "Revoke API key" },
  { method: "GET", path: "/v1/plans", entity: "Plan", desc: "List plans" },
  { method: "GET", path: "/v1/subscriptions", entity: "Subscription", desc: "List subscriptions" },
  { method: "GET", path: "/v1/subscriptions/:id", entity: "Subscription", desc: "Get subscription" },
  { method: "GET", path: "/v1/usage", entity: "UsageMetric", desc: "Get usage metrics" },
];

export default function ApiDocsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-caption mb-2 font-semibold uppercase tracking-wider text-[var(--color-accent-mid)]">
            Developer Reference
          </p>
          <h1 className="text-display mb-4 text-[var(--color-text-primary)] md:text-5xl">
            API Documentation
          </h1>
          <p className="text-body-lg mb-12 max-w-2xl text-[var(--color-text-secondary)]">
            RESTful API for Founder Revenue Co-Pilot. Authenticate with Bearer tokens, manage organizations, customers, revenue events, and more.
          </p>

          {/* Quick links */}
          <nav className="mb-16 flex flex-wrap gap-4">
            <a href="#base" className="micro-link rounded-lg border border-[var(--color-border)] px-4 py-2 text-body-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent-mid)] hover:text-[var(--color-text-primary)]">
              Base URL & Auth
            </a>
            <a href="#entities" className="micro-link rounded-lg border border-[var(--color-border)] px-4 py-2 text-body-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent-mid)] hover:text-[var(--color-text-primary)]">
              Entities
            </a>
            <a href="#endpoints" className="micro-link rounded-lg border border-[var(--color-border)] px-4 py-2 text-body-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent-mid)] hover:text-[var(--color-text-primary)]">
              Endpoints
            </a>
            <a href="#crud" className="micro-link rounded-lg border border-[var(--color-border)] px-4 py-2 text-body-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent-mid)] hover:text-[var(--color-text-primary)]">
              CRUD Overview
            </a>
          </nav>

          {/* Base URL & Auth */}
          <section id="base" className="mb-16 scroll-mt-24">
            <h2 className="text-h2 mb-6 text-[var(--color-text-primary)]">Base URL & Authentication</h2>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 font-mono text-body-sm">
              <div className="mb-4">
                <span className="text-[var(--color-text-muted)]">Base URL</span>
                <div className="mt-1 text-[var(--color-text-primary)]">https://api.founderrevenue.ai/v1</div>
              </div>
              <div>
                <span className="text-[var(--color-text-muted)]">Authentication</span>
                <div className="mt-1 text-[var(--color-text-primary)]">Bearer &lt;api_key&gt;</div>
                <p className="mt-2 text-caption text-[var(--color-text-muted)]">
                  Create API keys in the dashboard. Use the key prefix <code className="rounded bg-white px-1">frcp_live_…</code> or <code className="rounded bg-white px-1">frcp_test_…</code>.
                </p>
              </div>
            </div>
          </section>

          {/* Entities */}
          <section id="entities" className="mb-16 scroll-mt-24">
            <h2 className="text-h2 mb-6 text-[var(--color-text-primary)]">Entities</h2>
            <div className="space-y-8">
              {ENTITIES.map((entity) => (
                <div
                  key={entity.name}
                  className="rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
                >
                  <h3 className="text-h3 mb-2 text-[var(--color-text-primary)]">{entity.name}</h3>
                  <p className="text-body-sm mb-4 text-[var(--color-text-secondary)]">{entity.description}</p>
                  <table className="w-full border-collapse text-body-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="py-2 text-left font-medium text-[var(--color-text-muted)]">Field</th>
                        <th className="py-2 text-left font-medium text-[var(--color-text-muted)]">Type</th>
                        <th className="py-2 text-left font-medium text-[var(--color-text-muted)]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entity.fields.map((f) => (
                        <tr key={f.name} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="py-2 font-mono text-[var(--color-text-primary)]">{f.name}</td>
                          <td className="py-2 text-[var(--color-text-muted)]">{f.type}</td>
                          <td className="py-2 text-[var(--color-text-secondary)]">{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>

          {/* Endpoints */}
          <section id="endpoints" className="mb-16 scroll-mt-24">
            <h2 className="text-h2 mb-6 text-[var(--color-text-primary)]">API Endpoints</h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
              <table className="w-full min-w-[480px] text-body-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Method</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Path</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Entity</th>
                    <th className="px-4 py-3 text-left font-medium text-[var(--color-text-muted)]">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((ep, i) => (
                    <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded px-2 py-0.5 font-mono text-caption font-medium ${
                            ep.method === "GET"
                              ? "bg-blue-100 text-blue-800"
                              : ep.method === "POST"
                                ? "bg-green-100 text-green-800"
                                : ep.method === "PATCH"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="font-mono text-[var(--color-text-primary)]">{ep.path}</td>
                      <td className="text-[var(--color-text-secondary)]">{ep.entity}</td>
                      <td className="text-[var(--color-text-muted)]">{ep.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* CRUD Overview */}
          <section id="crud" className="mb-16 scroll-mt-24">
            <h2 className="text-h2 mb-6 text-[var(--color-text-primary)]">CRUD Operations</h2>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6">
              <p className="text-body-sm mb-6 text-[var(--color-text-secondary)]">
                All list endpoints support pagination (<code className="rounded bg-white px-1">?page=1&limit=20</code>) and filtering. Responses use JSON.
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Create (POST)</h4>
                  <p className="text-body-sm text-[var(--color-text-secondary)]">
                    Send JSON body with required fields. Returns 201 and the created resource.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Read (GET)</h4>
                  <p className="text-body-sm text-[var(--color-text-secondary)]">
                    Single resource by ID or list with optional filters. Returns 200.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Update (PATCH)</h4>
                  <p className="text-body-sm text-[var(--color-text-secondary)]">
                    Partial update. Send only fields to change. Returns 200 with updated resource.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-[var(--color-text-primary)]">Delete (DELETE)</h4>
                  <p className="text-body-sm text-[var(--color-text-secondary)]">
                    Permanently removes the resource. Returns 204 No Content.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-xl border border-[var(--color-accent-mid)] bg-[var(--color-accent-mid)]/5 p-8">
            <h3 className="text-h3 mb-2 text-[var(--color-text-primary)]">Build an app</h3>
            <p className="text-body-sm mb-6 text-[var(--color-text-secondary)]">
              Extend Founder Revenue Co-Pilot with custom integrations. List your app in our marketplace and reach more users.
            </p>
            <Link
              href="/marketplace/build"
              className="micro-btn inline-flex items-center gap-2 rounded-xl bg-[var(--color-text-primary)] px-5 py-2.5 text-body-sm font-medium text-white shadow-sm hover:opacity-90"
            >
              Apply to build an app
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
