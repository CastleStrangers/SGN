"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Shield, Trash2, ChevronDown, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface User { id: string; name: string | null; email: string | null; role: string; roleId: string | null; createdAt: string; }
interface Role { id: string; name: string; description: string | null; isSystem: boolean; }

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const role = (session?.user as any)?.role;
  const currentId = (session?.user as any)?.id;

  useEffect(() => {
    if (role && role !== "admin") router.push("/dashboard");
  }, [role, router]);

  const fetchData = async () => {
    const [usersRes, rolesRes] = await Promise.all([
      fetch("/api/users"),
      fetch("/api/roles").catch(() => null),
    ]);
    const usersData = await usersRes.json();
    if (Array.isArray(usersData)) setUsers(usersData);
    if (rolesRes && rolesRes.ok) setRoles(await rolesRes.json());
  };
  useEffect(() => { if (status === "authenticated" && role === "admin") fetchData(); }, [status, role]);

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
    if (!confirm("تأكيد حذف هذا المستخدم؟")) return;
    const res = await fetch("/api/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) fetchData();
    else { const d = await res.json(); alert(d.error || "خطأ"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">المستخدمين</h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right px-4 py-3 text-gray-600">الاسم</th>
                <th className="text-right px-4 py-3 text-gray-600">البريد</th>
                <th className="text-right px-4 py-3 text-gray-600">الدور الأساسي</th>
                <th className="text-right px-4 py-3 text-gray-600">نظام الصلاحيات</th>
                <th className="text-right px-4 py-3 text-gray-600">التسجيل</th>
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
                      className="text-xs border rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="">—</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name} {r.isSystem ? "(نظام)" : ""}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.id !== currentId && (
                      <button onClick={() => deleteUser(u.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <p className="text-center text-gray-400 py-8">لا يوجد مستخدمين</p>}
      </div>
    </div>
  );
}
