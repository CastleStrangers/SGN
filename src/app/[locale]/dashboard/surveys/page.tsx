"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { BarChart3, Plus, Pencil, Trash2, Eye, EyeOff, CheckSquare } from "lucide-react";

interface Survey {
  id: string; title: string; description: string | null;
  active: boolean; startDate: string | null; endDate: string | null;
  options: { id: string; text: string; votes: number }[];
  _count: { votes: number };
}

export default function SurveysAdminPage() {
  const t = useTranslations('dashboard.surveysPage');
  const { data: session } = useSession();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", options: ["", ""], startDate: "", endDate: "", active: true });

  useEffect(() => {
    fetch("/api/surveys").then(r => r.json()).then(data => {
      setSurveys(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!session || (session.user as any).role !== "admin") {
    return <div className="p-8 text-center text-gray-500">Unauthorized</div>;
  }

  async function save() {
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : { ...form, options: form.options.filter(o => o.trim()) };
    const res = await fetch("/api/surveys", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) {
      setShowForm(false); setEditId(null);
      setForm({ title: "", description: "", options: ["", ""], startDate: "", endDate: "", active: true });
      const data = await fetch("/api/surveys").then(r => r.json());
      setSurveys(Array.isArray(data) ? data : []);
    }
  }

  async function remove(id: string) {
    if (!confirm("Confirm delete?")) return;
    await fetch("/api/surveys", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setSurveys(surveys.filter(s => s.id !== id));
  }

  function edit(s: Survey) {
    setEditId(s.id);
    setForm({
      title: s.title, description: s.description || "",
      options: s.options.map(o => o.text).concat([""]),
      startDate: s.startDate?.split("T")[0] || "",
      endDate: s.endDate?.split("T")[0] || "", active: s.active,
    });
    setShowForm(true);
  }

  function toggleActive(s: Survey) {
    fetch("/api/surveys", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: s.id, active: !s.active }) })
      .then(() => setSurveys(surveys.map(x => x.id === s.id ? { ...x, active: !x.active } : x)));
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#1a5632] text-white rounded-lg text-sm hover:bg-[#0f3d23] transition-colors">
          <Plus className="w-4 h-4" /> {t('newSurvey')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
          <input placeholder={t('titlePlaceholder')} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" />
          <textarea placeholder={t('descPlaceholder')} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-xl px-4 py-2.5 text-sm" rows={2} />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{t('options')}</p>
            {form.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder={t('optionPlaceholder', { index: i + 1 })} value={opt} onChange={e => { const o = [...form.options]; o[i] = e.target.value; setForm({ ...form, options: o }); }} className="flex-1 border rounded-xl px-4 py-2 text-sm" />
                {form.options.length > 2 && (
                  <button onClick={() => setForm({ ...form, options: form.options.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 px-2 text-sm">✕</button>
                )}
              </div>
            ))}
            <button onClick={() => setForm({ ...form, options: [...form.options, ""] })} className="text-sm text-[#1a5632] hover:underline">{t('addOption')}</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> {t('activeLabel')}
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="px-6 py-2 bg-[#1a5632] text-white rounded-xl text-sm hover:bg-[#0f3d23] transition-colors">{editId ? t('update') : t('create')}</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors">{t('cancel')}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" /></div>
      ) : surveys.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">{t('noSurveys')}</p>
          <p className="text-sm">{t('noSurveysDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {surveys.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{s.title}</h3>
                  {s.active ? (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {t('activeLabel')}</span>
                  ) : (
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff className="w-3 h-3" /> {t('disabled')}</span>
                  )}
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s._count.votes} {t('votes')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(s)} className="p-2 hover:bg-gray-50 rounded-lg">{s.active ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-green-400" />}</button>
                  <button onClick={() => edit(s)} className="p-2 hover:bg-gray-50 rounded-lg"><Pencil className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => remove(s.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
              </div>
              {s.description && <p className="text-sm text-gray-500 mb-3">{s.description}</p>}
              <div className="space-y-2">
                {s.options.map(o => {
                  const pct = s._count.votes > 0 ? Math.round((o.votes / s._count.votes) * 100) : 0;
                  return (
                    <div key={o.id} className="flex items-center gap-3 text-sm">
                      <span className="w-1/2 truncate">{o.text}</span>
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a5632] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-12 text-left text-gray-500">{o.votes} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
