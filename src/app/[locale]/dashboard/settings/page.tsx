"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Save, User, Mail, MapPin, Globe, Phone } from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations('dashboard.settingsPage');
  const { data: session, update } = useSession();
  const [form, setForm] = useState({ name: "", bio: "", phone: "", location: "", website: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/profile")
        .then(r => r.json())
        .then(data => {
          if (data?.name !== undefined) {
            setForm({ name: data.name || "", bio: data.bio || "", phone: data.phone || "", location: data.location || "", website: data.website || "" });
          }
        })
        .catch(() => {});
    }
  }, [session]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMsg(t('savedSuccess'));
      update();
    } else {
      setMsg(t('saveError'));
    }
    setSaving(false);
  }

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-[#1a5632]" />
          <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        <div className="flex items-center gap-4 mb-8 pb-6 border-b">
          <div className="w-16 h-16 rounded-full bg-[#c8a84e] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {session.user?.image ? <img src={session.user.image} alt="" className="w-full h-full object-cover" /> : (session.user?.name || "?").charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{session.user?.name || t('user')}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><Mail className="w-3.5 h-3.5" />{session.user?.email}</p>
          </div>
        </div>

        <form onSubmit={save} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')}</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('bioLabel')}</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" rows={4} placeholder={t('bioPlaceholder')} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {t('phoneLabel')}</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {t('locationLabel')}</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" placeholder={t('locationPlaceholder')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {t('websiteLabel')}</label>
            <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" placeholder="https://" />
          </div>

          {msg && (
            <div className={`text-sm px-4 py-2 rounded-xl ${msg === t('saveError') ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {msg}
            </div>
          )}

          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[#1a5632] text-white rounded-xl text-sm hover:bg-[#0f3d23] transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? t('saving') : t('saveChanges')}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border p-6 mt-6">
        <h2 className="font-bold text-gray-900 mb-4">{t('accountInfo')}</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between"><span>{t('emailLabel')}</span><span className="text-gray-900">{session.user?.email}</span></div>
          <div className="flex justify-between"><span>{t('roleLabel')}</span><span className="text-gray-900">{(session.user as any)?.role === "admin" ? t('admin') : (session.user as any)?.role === "editor" ? t('editor') : t('member')}</span></div>
        </div>
      </div>
    </div>
  );
}
