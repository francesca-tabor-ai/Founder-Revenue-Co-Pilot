"use client";

import { useEffect, useState } from "react";

export default function AdminTeamMembersPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [orgs, setOrgs] = useState<Record<string, unknown>[]>([]);
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);

  const fetchData = async () => {
    const [tmRes, orgRes, userRes] = await Promise.all([
      fetch("/api/admin/team-members"),
      fetch("/api/admin/organizations"),
      fetch("/api/admin/users"),
    ]);
    const [tmData, orgData, userData] = await Promise.all([tmRes.json(), orgRes.json(), userRes.json()]);
    setItems(Array.isArray(tmData) ? tmData : []);
    setOrgs(Array.isArray(orgData) ? orgData : []);
    setUsers(Array.isArray(userData) ? userData : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await fetch(`/api/admin/team-members/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = { userId: data.get("userId"), organizationId: data.get("organizationId"), role: data.get("role") || "member" };
    const url = modal === "create" ? "/api/admin/team-members" : `/api/admin/team-members/${(modal as { id: string }).id}`;
    await fetch(url, { method: modal === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setModal(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Team Members</h1>
        <button onClick={() => setModal("create")} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm">Add</button>
      </div>
      {loading ? <p className="text-zinc-400">Loading...</p> : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">User</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Organization</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Role</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tm) => (
                <tr key={String(tm.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{(tm.user as { email?: string })?.email ?? "—"}</td>
                  <td className="px-4 py-3 text-white">{(tm.organization as { name?: string })?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-white">{String(tm.role)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(tm)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(tm.id))} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="text-lg font-semibold text-white mb-4">{modal === "create" ? "Add Team Member" : "Edit"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-zinc-400 text-sm mb-1">User</label>
                <select name="userId" required defaultValue={modal !== "create" ? String((modal as { userId: string }).userId) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  {users.map((u) => <option key={String(u.id)} value={String(u.id)}>{String((u as { email: string }).email)}</option>)}
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Organization</label>
                <select name="organizationId" required defaultValue={modal !== "create" ? String((modal as { organizationId: string }).organizationId) : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  {orgs.map((o) => <option key={String(o.id)} value={String(o.id)}>{String((o as { name: string }).name)}</option>)}
                </select></div>
              <div><label className="block text-zinc-400 text-sm mb-1">Role</label>
                <input name="role" defaultValue={modal !== "create" ? String((modal as { role: string }).role) : "member"}
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
