"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Shield, Trash2, ChevronDown, UserCheck, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";

interface User { id: string; name: string | null; email: string | null; role: string; roleId: string | null; createdAt: string; }
interface Role { id: string; name: string; description: string | null; isSystem: boolean; }

export default function UsersPage() {
  const t = useTranslations("dashboard.usersPage");
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const PAGE_SIZE = 50;

  const role = (session?.user as any)?.role;
  const currentId = (session?.user as any)?.id;

  useEffect(() => {
    if (role && role !== "admin") router.push("/dashboard");
  }, [role, router]);

  const fetchData = async () => {
    const params = new URLSearchParams();
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String(page * PAGE_SIZE));
    if (search) params.set("search", search);

    const [usersRes, rolesRes] = await Promise.all([
      fetch(`/api/users?${params}`),
      fetch("/api/roles").catch(() => null),
    ]);
    const usersData = await usersRes.json();
    if (usersData.users) { setUsers(usersData.users); setTotal(usersData.total); }
    else if (Array.isArray(usersData)) { setUsers(usersData); setTotal(usersData.length); }
    if (rolesRes && rolesRes.ok) setRoles(await rolesRes.json());
  };
  useEffect(() => { if (status === "authenticated" && role === "admin") fetchData(); }, [status, role, page, search]);

  const updateRole = async (id: string, newRole: string) => {
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    if (res.ok) fetchData();
  };

  const assignRole = async (id: string, roleId: string | null) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId }),
    });
    if (res.ok) fetchData();
  };

  const deleteUser = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    const res = await fetch("/api/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) fetchData();
    else { const d = await res.json(); alert(d.error || t("errorGeneric")); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")} ({total})</h1>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder={t("search") || "بحث..."} title={t("search")} aria-label={t("search")} className="w-full pr-10 p-3 border rounded-xl text-sm bg-white" />
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-4 py-3 text-gray-600">{t("name")}</th>
                <th className="text-right px-4 py-3 text-gray-600">{t("email")}</th>
                <th className="text-right px-4 py-3 text-gray-600">{t("role")}</th>
                <th className="text-right px-4 py-3 text-gray-600">{t("permissionsSystem")}</th>
                <th className="text-right px-4 py-3 text-gray-600">{t("registered")}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{u.name?.charAt(0) || "?"}</div>
                      {u.name || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={e => updateRole(u.id, e.target.value)}
                      title={t("changeRole")}
                      aria-label={t("changeRole")}
                      className="text-xs border rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="member">member</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                      <option value="moderator">moderator</option>
                      <option value="contributor">contributor</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.roleId || ""}
                      onChange={e => assignRole(u.id, e.target.value || null)}
                      title={t("assignRole")}
                      aria-label={t("assignRole")}
                      className="text-xs border rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="">—</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name} {r.isSystem ? t("systemSuffix") : ""}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(u.createdAt, locale)}</td>
                  <td className="px-4 py-3">
                    {u.id !== currentId && (
                      <button onClick={() => deleteUser(u.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500" title={t("deleteUser")} aria-label={t("deleteUser")}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <p className="text-center text-gray-400 py-8">{t("noUsers")}</p>}
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 border rounded-xl text-sm bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
            {t("previous") || "← السابق"}
          </button>
          <span className="text-sm text-gray-500">{t("pageInfo") || `صفحة ${page + 1} من ${Math.ceil(total / PAGE_SIZE)}`}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total} className="px-4 py-2 border rounded-xl text-sm bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
            {t("next") || "التالي →"}
          </button>
        </div>
      )}
    </div>
  );
}
