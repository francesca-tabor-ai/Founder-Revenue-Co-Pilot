"use client";

import { useEffect, useState } from "react";

export default function AdminRevenueEventsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [orgs, setOrgs] = useState<Record<string, unknown>[]>([]);
  const [customers, setCustomers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);

  const fetchData = async () => {
    const [revRes, orgRes, custRes] = await Promise.all([
      fetch("/api/admin/revenue-events"),
      fetch("/api/admin/organizations"),
      fetch("/api/admin/customers"),
    ]);
    const [revData, orgData, custData] = await Promise.all([revRes.json(), orgRes.json(), custRes.json()]);
    setItems(Array.isArray(revData) ? revData : []);
    setOrgs(Array.isArray(orgData) ? orgData : []);
    setCustomers(Array.isArray(custData) ? custData : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/revenue-events/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const effectiveDate = new Date(data.get("effectiveDate") as string).toISOString();
    const body = {
      organizationId: data.get("organizationId"),
      customerId: data.get("customerId") || undefined,
      amount: Number(data.get("amount")),
      currency: data.get("currency") || "USD",
      type: data.get("type"),
      description: data.get("description") || undefined,
      effectiveDate,
    };
    const url = modal === "create" ? "/api/admin/revenue-events" : `/api/admin/revenue-events/${(modal as { id: string }).id}`;
    await fetch(url, { method: modal === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setModal(null);
    fetchData();
  };

  const fmt = (d: unknown) => d ? new Date(d as string).toLocaleDateString() : "—";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Revenue Events</h1>
        <button onClick={() => setModal("create")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">Add</button>
      </div>
      {loading ? <p className="text-zinc-400">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Organization</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Amount</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Type</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Date</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={String(r.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{(r.organization as { name?: string })?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-white">{String(r.currency)} {Number(r.amount)}</td>
                  <td className="px-4 py-3 text-white">{String(r.type)}</td>
                  <td className="px-4 py-3 text-white">{fmt(r.effectiveDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(r)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(r.id))} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setModal(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4">{modal === "create" ? "Create Revenue Event" : "Edit"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-1">Organization</label>
                <select name="organizationId" required defaultValue={modal !== "create" ? String((modal as { organizationId: string }).organizationId) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  {orgs.map((o) => <option key={String(o.id)} value={String(o.id)}>{String((o as { name: string }).name)}</option>)}
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Customer (optional)</label>
                <select name="customerId" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  <option value="">—</option>
                  {customers.map((c) => <option key={String(c.id)} value={String(c.id)}>{String((c as { email: string }).email)}</option>)}
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Amount</label>
                <input name="amount" type="number" step="0.01" required defaultValue={modal !== "create" ? Number((modal as { amount: number }).amount) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Currency</label>
                <input name="currency" defaultValue={modal !== "create" ? String((modal as { currency: string }).currency) : "USD"}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Type</label>
                <input name="type" required defaultValue={modal !== "create" ? String((modal as { type: string }).type) : "subscription"}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Description</label>
                <input name="description" defaultValue={modal !== "create" ? String((modal as { description?: string }).description ?? "") : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Effective Date</label>
                <input name="effectiveDate" type="datetime-local" required
                  defaultValue={modal !== "create" && (modal as { effectiveDate?: string }).effectiveDate
                    ? new Date((modal as { effectiveDate: string }).effectiveDate).toISOString().slice(0, 16) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
