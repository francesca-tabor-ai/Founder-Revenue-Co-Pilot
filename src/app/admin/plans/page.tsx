"use client";

import { useEffect, useState } from "react";

export default function AdminPlansPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = {
      name: data.get("name"),
      type: data.get("type"),
      price: Number(data.get("price")),
      currency: data.get("currency") || "USD",
      interval: data.get("interval") || "month",
    };
    const url = modal === "create" ? "/api/admin/plans" : `/api/admin/plans/${(modal as { id: string }).id}`;
    await fetch(url, { method: modal === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setModal(null);
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Plans</h1>
        <button onClick={() => setModal("create")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">Add</button>
      </div>
      {loading ? <p className="text-zinc-400">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Name</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Type</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Price</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={String(p.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{String(p.name)}</td>
                  <td className="px-4 py-3 text-white">{String(p.type)}</td>
                  <td className="px-4 py-3 text-white">{String(p.currency)} {Number(p.price)}/{String(p.interval)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(p)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(p.id))} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="text-lg font-semibold text-white mb-4">{modal === "create" ? "Create Plan" : "Edit"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-1">Name</label>
                <input name="name" required defaultValue={modal !== "create" ? String((modal as { name: string }).name) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Type</label>
                <select name="type" defaultValue={modal !== "create" ? String((modal as { type: string }).type) : "INDIVIDUAL"}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="TEAM">TEAM</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Price</label>
                <input name="price" type="number" step="0.01" required defaultValue={modal !== "create" ? Number((modal as { price: number }).price) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Currency</label>
                <input name="currency" defaultValue={modal !== "create" ? String((modal as { currency: string }).currency) : "USD"}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Interval</label>
                <input name="interval" defaultValue={modal !== "create" ? String((modal as { interval: string }).interval) : "month"}
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
