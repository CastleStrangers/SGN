"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Shield, Plus, Save, Trash2, X, Loader2, UserCheck, Sparkles } from "lucide-react";
import { PERMISSION_GROUPS, type Permission } from "@/lib/permissions";

type Role = {
  id: string;
  name: string;
  description: string | null;
  permissions: string;
  isSystem: boolean;
};

export default function RolesPage() {
  const t = useTranslations('dashboard.rolesPage');
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [editDesc, setEditDesc] = useState("");
  const [newRole, setNewRole] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPerms, setNewPerms] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReason, setAiReason] = useState("");

  useEffect(() => { loadRoles(); }, []);

  async function suggestPermissionsWithAI() {
    if (!newName.trim()) {
      alert(t("fillRoleName"));
      return;
    }
    setAiLoading(true);
    setAiReason("");
    try {
      const res = await fetch("/api/ai/suggest-permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      if (res.ok) {
        const data = await res.json();
        setNewPerms(data.permissions || []);
        if (data.reasonAr) setAiReason(data.reasonAr);
      } else {
        alert(t("aiError"));
      }
    } catch {
      alert(t("connError"));
    }
    setAiLoading(false);
  }

  async function loadRoles() {
    try {
      const res = await fetch("/api/roles");
      if (res.ok) setRoles(await res.json());
    } catch {}
    setLoading(false);
  }

  function startEdit(role: Role) {
    setEditing(role.id);
    setEditPerms(JSON.parse(role.permissions || "[]"));
    setEditDesc(role.description || "");
  }

  async function saveEdit(role: Role) {
    await fetch("/api/roles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: role.id, description: editDesc, permissions: editPerms }),
    });
    setEditing(null);
    loadRoles();
  }

  async function createRole() {
    if (!newName.trim()) return;
    await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, permissions: newPerms }),
    });
    setNewRole(false);
    setNewName(""); setNewDesc(""); setNewPerms([]);
    loadRoles();
  }

  async function deleteRole(id: string) {
    if (!confirm(t('confirmDelete'))) return;
    await fetch("/api/roles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadRoles();
  }

  function togglePerm(perms: string[], perm: string): string[] {
    return perms.includes(perm) ? perms.filter(p => p !== perm) : [...perms, perm];
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1a5632]" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={() => setNewRole(true)} className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" /> {t('newRole')}
        </button>
      </div>

      {newRole && (
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{t('newRole')}</h3>
            <button onClick={() => setNewRole(false)} title="إغلاق" aria-label="إغلاق"><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('roleNamePlaceholder')} className="px-4 py-2 border rounded-xl text-sm" />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder={t('roleDescPlaceholder')} className="px-4 py-2 border rounded-xl text-sm" />
          </div>
          
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={suggestPermissionsWithAI}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-[#c8a84e]/15 hover:bg-[#c8a84e]/25 text-[#a88220] border border-[#c8a84e]/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {aiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#c8a84e]" />
              )}
              اقتراح الصلاحيات ذكياً (AI)
            </button>
          </div>

          {aiReason && (
            <div className="mb-4 bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 text-xs text-[#a88220] leading-relaxed">
              <strong>تحليل الذكاء الاصطناعي:</strong> {aiReason}
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm font-bold text-gray-700 mb-2">{t('permissions')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {PERMISSION_GROUPS.flatMap(g => g.permissions).map(p => (
                <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={newPerms.includes(p)} onChange={() => setNewPerms(togglePerm(newPerms, p))} className="rounded border-gray-300" />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <button onClick={createRole} className="bg-[#1a5632] text-white px-4 py-2 rounded-xl text-sm">{t('create')}</button>
        </div>
      )}

      <div className="space-y-4">
        {roles.map(role => (
          <div key={role.id} className="bg-white rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#1a5632]" />
                <div>
                  <h3 className="font-bold text-gray-900">{role.name}</h3>
                  {role.description && <p className="text-sm text-gray-500">{role.description}</p>}
                </div>
                {role.isSystem && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{t('system')}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(role)} className="text-gray-400 hover:text-[#1a5632]" title={t("editPermissions")} aria-label={t("editPermissions")}><UserCheck className="w-5 h-5" /></button>
                {!role.isSystem && (
                  <button onClick={() => deleteRole(role.id)} className="text-gray-400 hover:text-red-500" title={t("deleteRole")} aria-label={t("deleteRole")}><Trash2 className="w-5 h-5" /></button>
                )}
              </div>
            </div>

            {editing === role.id ? (
              <div>
                <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder={t('roleDescPlaceholder')} className="w-full px-4 py-2 border rounded-xl text-sm mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4 max-h-80 overflow-y-auto">
                  {PERMISSION_GROUPS.map(group => (
                    <div key={group.module} className="col-span-full">
                      <p className="text-xs font-bold text-gray-600 mb-1 mt-2">{t("permissions." + group.module)}</p>
                      <div className="grid grid-cols-2 gap-1">
                        {group.permissions.map(p => (
                          <label key={p} className="flex items-center gap-2 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editPerms.includes(p)}
                              onChange={() => setEditPerms(togglePerm(editPerms, p))}
                              className="rounded border-gray-300"
                            />
                            {p}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(role)} className="flex items-center gap-2 bg-[#1a5632] text-white px-4 py-2 rounded-xl text-sm"><Save className="w-4 h-4" /> {t('save')}</button>
                  <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-xl text-sm text-gray-600">{t('cancel')}</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(JSON.parse(role.permissions || "[]") as string[]).map(p => (
                  <span key={p} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">{p}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
