import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [users, orgs, customers, invoices] = await Promise.all([
    prisma.user.count(),
    prisma.organization.count(),
    prisma.customer.count(),
    prisma.invoice.count(),
  ]);

  const stats = [
    { label: "Users", value: users, href: "/admin/users" },
    { label: "Organizations", value: orgs, href: "/admin/organizations" },
    { label: "Customers", value: customers, href: "/admin/customers" },
    { label: "Invoices", value: invoices, href: "/admin/invoices" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, href }) => (
          <a
            key={label}
            href={href}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500/50 transition"
          >
            <p className="text-zinc-400 text-sm">{label}</p>
            <p className="text-2xl font-semibold text-white mt-1">{value}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
