"use client";

import { useEffect, useState } from "react";

export default function AdminApiKeysPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [orgs, setOrgs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  const fetchData = async () => {
    const [keyRes, orgRes] = await Promise.all([fetch("/api/admin/api-keys"), fetch("/api/admin/organizations")]);
    const [keyData, orgData] = await Promise.all([keyRes.json(), orgRes.json()]);
    setItems(Array.isArray(keyData) ? keyData : []);
    setOrgs(Array.isArray(orgData) ? orgData : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this API key?")) return;
    await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = { organizationId: data.get("organizationId"), name: data.get("name") };
    const res = await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    if (result.rawKey) setNewKey(result.rawKey);
    else setModal(null);
    fetchData();
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = { name: data.get("name") };
    await fetch(`/api/admin/api-keys/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setModal(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">API Keys</h1>
        <button onClick={() => { setModal("create"); setNewKey(null); }} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">Add</button>
      </div>
      {newKey && (
        <div className="mb-4 p-4 bg-amber-900/30 border border-amber-700 rounded-lg">
          <p className="text-amber-200 text-sm mb-2">Save this key now. You won&apos;t be able to see it again:</p>
          <code className="block text-amber-100 break-all text-sm">{newKey}</code>
          <button onClick={() => setNewKey(null)} className="mt-2 text-amber-400 text-sm hover:underline">Dismiss</button>
        </div>
      )}
      {loading ? <p className="text-zinc-400">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Name</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Key Prefix</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Organization</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((k) => (
                <tr key={String(k.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{String(k.name)}</td>
                  <td className="px-4 py-3 text-zinc-400 font-mono text-sm">{String(k.keyPrefix)}</td>
                  <td className="px-4 py-3 text-white">{(k.organization as { name?: string })?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(k)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(k.id))} className="text-red-400 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => { setModal(null); setNewKey(null); }}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {modal === "create" ? (
              <>
                <h2 className="text-lg font-semibold text-white mb-4">Create API Key</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><label className="block text-zinc-400 text-sm mb-1">Organization</label>
                    <select name="organizationId" required className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                      {orgs.map((o) => <option key={String(o.id)} value={String(o.id)}>{String((o as { name: string }).name)}</option>)}
                    </select></div>
                  <div><label className="block text-zinc-400 text-sm mb-1">Name</label>
                    <input name="name" required className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">Create</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-white mb-4">Edit API Key</h2>
                <form onSubmit={(e) => handleEdit(e, String((modal as { id: string }).id))} className="space-y-4">
                  <div><label className="block text-zinc-400 text-sm mb-1">Name</label>
                    <input name="name" required defaultValue={String((modal as { name: string }).name)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" /></div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg">Save</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
