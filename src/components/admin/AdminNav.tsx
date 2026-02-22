import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/organizations", label: "Organizations" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/revenue-events", label: "Revenue Events" },
  { href: "/admin/invoices", label: "Invoices" },
  { href: "/admin/integrations", label: "Integrations" },
  { href: "/admin/api-keys", label: "API Keys" },
  { href: "/admin/team-members", label: "Team Members" },
  { href: "/admin/usage-metrics", label: "Usage Metrics" },
];

export function AdminNav() {
  return (
    <nav className="space-y-1">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="block px-3 py-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white text-sm"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
