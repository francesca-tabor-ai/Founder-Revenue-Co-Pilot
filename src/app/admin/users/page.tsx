"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | Record<string, unknown> | null>(null);

  const fetchItems = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const body = modal === "create"
      ? {
          email: data.get("email"),
          password: data.get("password"),
          name: data.get("name") || undefined,
          role: data.get("role") || "USER",
        }
      : {
          email: data.get("email"),
          name: data.get("name") || undefined,
          role: data.get("role") || "USER",
          ...(data.get("password") ? { password: data.get("password") } : {}),
        };
    const url = modal === "create" ? "/api/admin/users" : `/api/admin/users/${(modal as { id: string }).id}`;
    await fetch(url, {
      method: modal === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setModal(null);
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <button
          onClick={() => setModal("create")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm"
        >
          Add User
        </button>
      </div>
      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Email</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Name</th>
                <th className="text-left px-4 py-3 text-zinc-400 text-sm">Role</th>
                <th className="text-right px-4 py-3 text-zinc-400 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={String(u.id)} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-white">{String(u.email)}</td>
                  <td className="px-4 py-3 text-white">{String(u.name || "—")}</td>
                  <td className="px-4 py-3 text-white">{String(u.role)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal(u)} className="text-emerald-400 hover:underline mr-3">Edit</button>
                    <button onClick={() => handleDelete(String(u.id))} className="text-red-400 hover:underline">Delete</button>
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
            <h2 className="text-lg font-semibold text-white mb-4">{modal === "create" ? "Create User" : "Edit User"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Email</label>
                <input name="email" type="email" defaultValue={modal !== "create" ? String((modal as { email: string }).email) : ""} required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Name</label>
                <input name="name" type="text" defaultValue={modal !== "create" ? String((modal as { name?: string }).name ?? "") : ""}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
              </div>
              {modal === "create" && (
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">Password</label>
                  <input name="password" type="password" required minLength={8}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
                </div>
              )}
              {modal !== "create" && (
                <div>
                  <label className="block text-zinc-400 text-sm mb-1">New Password (leave blank to keep)</label>
                  <input name="password" type="password" minLength={8}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white" />
                </div>
              )}
              <div>
                <label className="block text-zinc-400 text-sm mb-1">Role</label>
                <select name="role" defaultValue={modal !== "create" ? String((modal as { role: string }).role) : "USER"}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
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
