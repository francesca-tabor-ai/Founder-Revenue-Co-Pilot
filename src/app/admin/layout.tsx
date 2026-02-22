import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  if (session.user?.role !== "ADMIN") redirect("/auth/login?error=admin");

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-56 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col">
        <Link href="/admin" className="text-lg font-semibold text-white mb-6">
          Admin
        </Link>
        <AdminNav />
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <Link
            href="/api/auth/signout"
            className="text-zinc-400 hover:text-white text-sm"
          >
            Sign out
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
