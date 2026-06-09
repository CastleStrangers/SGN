"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Megaphone, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

interface Ad {
  id: string; title: string; image: string; link: string | null;
  position: string; active: boolean; clicks: number;
  startDate: string | null; endDate: string | null;
  createdAt: string;
}

const positions = ["sidebar", "banner", "inline", "footer"] as const;

export default function AdsAdminPage() {
  const { data: session } = useSession();
  const t = useTranslations("dashboard.adsPage");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", image: "", link: "", position: "sidebar",
    startDate: "", endDate: "", active: true,
  });

  useEffect(() => {
    fetch("/api/ads").then(r => r.json()).then(data => {
      setAds(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!session || (session.user as any).role !== "admin") {
    return <div className="p-8 text-center text-gray-500">Unauthorized</div>;
  }

  async function save() {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;

    const res = await fetch("/api/ads", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      setEditId(null);
      setForm({ title: "", image: "", link: "", position: "sidebar", startDate: "", endDate: "", active: true });
      const data = await fetch("/api/ads").then(r => r.json());
      setAds(Array.isArray(data) ? data : []);
    }
  }

  async function remove(id: string) {
    if (!confirm("Confirm delete?")) return;
    await fetch("/api/ads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAds(ads.filter(a => a.id !== id));
  }

  function edit(ad: Ad) {
    setEditId(ad.id);
    setForm({
      title: ad.title, image: ad.image, link: ad.link || "",
      position: ad.position, startDate: ad.startDate?.split("T")[0] || "",
      endDate: ad.endDate?.split("T")[0] || "", active: ad.active,
    });
    setShowForm(true);
  }

  function toggleActive(ad: Ad) {
    fetch("/api/ads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ad.id, active: !ad.active }),
    }).then(() => {
      setAds(ads.map(a => a.id === ad.id ? { ...a, active: !a.active } : a));
    });
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#1a5632] text-white rounded-lg text-sm hover:bg-[#0f3d23] transition-colors">
          <Plus className="w-4 h-4" /> {t("newAd")}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder={t("titlePlaceholder")} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder={t("imagePlaceholder")} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder={t("linkPlaceholder")} value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm">
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
            {t("activeLabel")}
          </label>
          {form.image && (
            <img src={form.image} alt="" className="h-24 rounded-xl object-cover" />
          )}
          <div className="flex gap-2">
            <button onClick={save} className="px-6 py-2 bg-[#1a5632] text-white rounded-xl text-sm hover:bg-[#0f3d23] transition-colors">
              {editId ? t("update") : t("create")}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors">{t("cancel")}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">{t("noAds")}</p>
          <p className="text-sm">{t("noAdsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map(ad => (
            <div key={ad.id} className="bg-white rounded-2xl border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <img src={ad.image} alt={ad.title} className="w-20 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{ad.title}</h3>
                  {ad.active ? (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {t("visible")}</span>
                  ) : (
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff className="w-3 h-3" /> {t("hidden")}</span>
                  )}
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{ad.position}</span>
                  <span className="text-xs text-gray-400">{ad.clicks} نقرة</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ad.startDate && `${t("from")}${ad.startDate.split("T")[0]}`}
                  {ad.endDate && `${t("to")}${ad.endDate.split("T")[0]}`}
                  {!ad.startDate && !ad.endDate && t("noDate")}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {ad.link && (
                  <a href={ad.link} target="_blank" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                <button onClick={() => toggleActive(ad)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  {ad.active ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-green-400" />}
                </button>
                <button onClick={() => edit(ad)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => remove(ad.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
