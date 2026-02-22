"use client";

import { useEffect, useState } from "react";

export default function AdminSubscriptionsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [orgs, setOrgs] = useState<Record<string, unknown>[]>([]);
  const [plans, setPlans] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);

  const fetchData = async () => {
    const [subRes, orgRes, planRes] = await Promise.all([
      fetch("/api/admin/subscriptions"),
      fetch("/api/admin/organizations"),
      fetch("/api/admin/plans"),
    ]);
    const [subData, orgData, planData] = await Promise.all([subRes.json(), orgRes.json(), planRes.json()]);
    setItems(Array.isArray(subData) ? subData : []);
    setOrgs(Array.isArray(orgData) ? orgData : []);
    setPlans(Array.isArray(planData) ? planData : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/subscriptions/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const start = new Date(data.get("currentPeriodStart") as string).toISOString();
    const end = new Date(data.get("currentPeriodEnd") as string).toISOString();
    const body = { organizationId: data.get("organizationId"), planId: data.get("planId"), status: data.get("status") || "active", currentPeriodStart: start, currentPeriodEnd: end };
    const url = modal === "create" ? "/api/admin/subscriptions" : `/api/admin/subscriptions/${(modal as { id: string }).id}`;
    await fetch(url, { method: modal === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setModal(null);
    fetchData();
  };

  const fmt = (d: unknown) => d ? new Date(d as string).toLocaleDateString() : "—";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
        <button onClick={() => setModal("create")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">Add</button>
      </div>
      {loading ? <p className="text-zinc-400">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Organization</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Plan</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Status</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Period</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={String(s.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{(s.organization as { name?: string })?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-white">{(s.plan as { name?: string })?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-white">{String(s.status)}</td>
                  <td className="px-4 py-3 text-white">{fmt(s.currentPeriodStart)} - {fmt(s.currentPeriodEnd)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(s)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(s.id))} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="text-lg font-semibold text-white mb-4">{modal === "create" ? "Create Subscription" : "Edit"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-1">Organization</label>
                <select name="organizationId" required defaultValue={modal !== "create" ? String((modal as { organizationId: string }).organizationId) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  {orgs.map((o) => <option key={String(o.id)} value={String(o.id)}>{String((o as { name: string }).name)}</option>)}
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Plan</label>
                <select name="planId" required defaultValue={modal !== "create" ? String((modal as { planId: string }).planId) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  {plans.map((p) => <option key={String(p.id)} value={String(p.id)}>{String((p as { name: string }).name)}</option>)}
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Status</label>
                <input name="status" defaultValue={modal !== "create" ? String((modal as { status: string }).status) : "active"}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Period Start</label>
                <input name="currentPeriodStart" type="datetime-local" required
                  defaultValue={modal !== "create" && (modal as { currentPeriodStart?: string }).currentPeriodStart
                    ? new Date((modal as { currentPeriodStart: string }).currentPeriodStart).toISOString().slice(0, 16) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Period End</label>
                <input name="currentPeriodEnd" type="datetime-local" required
                  defaultValue={modal !== "create" && (modal as { currentPeriodEnd?: string }).currentPeriodEnd
                    ? new Date((modal as { currentPeriodEnd: string }).currentPeriodEnd).toISOString().slice(0, 16) : ""}
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
