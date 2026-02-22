"use client";

import { useEffect, useState } from "react";

export default function AdminUsageMetricsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/usage-metrics");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/usage-metrics/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      organizationId: data.get("organizationId"),
      metricType: data.get("metricType"),
      value: Number(data.get("value")),
      period: data.get("period"),
    };
    const url = modal === "create" ? "/api/admin/usage-metrics" : `/api/admin/usage-metrics/${(modal as { id: string }).id}`;
    await fetch(url, { method: modal === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setModal(null);
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Usage Metrics</h1>
        <button onClick={() => setModal("create")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">Add</button>
      </div>
      {loading ? <p className="text-zinc-400">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Organization ID</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Metric Type</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Value</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Period</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={String(m.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white font-mono text-sm">{String(m.organizationId).slice(0, 12)}...</td>
                  <td className="px-4 py-3 text-white">{String(m.metricType)}</td>
                  <td className="px-4 py-3 text-white">{Number(m.value)}</td>
                  <td className="px-4 py-3 text-white">{String(m.period)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(m)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(m.id))} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="text-lg font-semibold text-white mb-4">{modal === "create" ? "Create Usage Metric" : "Edit"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-1">Organization ID</label>
                <input name="organizationId" required defaultValue={modal !== "create" ? String((modal as { organizationId: string }).organizationId) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Metric Type</label>
                <input name="metricType" required defaultValue={modal !== "create" ? String((modal as { metricType: string }).metricType) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Value</label>
                <input name="value" type="number" step="0.01" required defaultValue={modal !== "create" ? Number((modal as { value: number }).value) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Period</label>
                <input name="period" required defaultValue={modal !== "create" ? String((modal as { period: string }).period) : ""}
                  placeholder="e.g. 2025-02"
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
