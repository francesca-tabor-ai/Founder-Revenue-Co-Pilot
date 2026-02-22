"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EntityCrudPageProps = {
  title: string;
  apiPath: string;
  columns: { key: string; label: string; render?: (val: unknown) => React.ReactNode }[];
  createForm?: React.ReactNode;
  editForm?: (item: Record<string, unknown>, onSave: (data: Record<string, unknown>) => Promise<void>) => React.ReactNode;
  getId: (item: Record<string, unknown>) => string;
};

export function EntityCrudPage({
  title,
  apiPath,
  columns,
  createForm,
  editForm,
  getId,
}: EntityCrudPageProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/admin/${apiPath}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [apiPath]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/${apiPath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((i) => getId(i) !== id));
    } catch {
      setError("Failed to delete");
    }
  };

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setCreating(false);
      fetchItems();
    } catch {
      setError("Failed to create");
    }
  };

  const handleUpdate = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch(`/api/admin/${apiPath}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setEditing(null);
      fetchItems();
    } catch {
      setError("Failed to update");
    }
  };

  const renderCell = (item: Record<string, unknown>, col: (typeof columns)[0]) => {
    const val = col.key.split(".").reduce((o: unknown, k) => (o as Record<string, unknown>)?.[k], item);
    if (col.render) return col.render(val);
    if (val === null || val === undefined) return "—";
    if (typeof val === "object" && val !== null && "email" in val)
      return (val as { email?: string }).email ?? JSON.stringify(val);
    if (val instanceof Object && "toISOString" in val) return (val as Date).toLocaleDateString();
    // Handle ISO date strings from API
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
      try {
        return new Date(val).toLocaleDateString();
      } catch {
        return val;
      }
    }
    return String(val);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {createForm && (
          <button
            onClick={() => setCreating(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm"
          >
            Add New
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {creating && createForm}
      {editing && editForm?.(editing, (d) => handleUpdate(getId(editing), d))}
      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  {columns.map((c) => (
                    <th key={c.key} className="text-left px-4 py-3 text-zinc-400 text-sm font-medium">
                      {c.label}
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 text-zinc-400 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={getId(item)} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-white text-sm">
                        {renderCell(item, c)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      {editForm && (
                        <button
                          onClick={() => setEditing(item)}
                          className="text-emerald-400 hover:underline mr-3 text-sm"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(getId(item))}
                        className="text-red-400 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
