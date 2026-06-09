"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

interface Event { id: string; title: string; description: string | null; date: string; location: string | null; image: string | null; category: string; published: boolean; }

export default function EventsPage() {
  const { status } = useSession();
  const t = useTranslations("dashboard.eventsPage");
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("فعالية");

  const load = async () => {
    const res = await fetch("/api/events"); const data = await res.json();
    if (Array.isArray(data)) setEvents(data);
  };
  useEffect(() => { if (status === "authenticated") load(); }, [status]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); if (!title.trim() || !date) return;
    await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description: desc, date, location, category }) });
    setTitle(""); setDesc(""); setDate(""); setLocation(""); setCategory("فعالية"); load();
  };

  const remove = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <form onSubmit={create} className="bg-white rounded-2xl border p-4 mb-6 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("titlePlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
        </div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t("descPlaceholder")} rows={3} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
        <div className="grid md:grid-cols-2 gap-3">
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder={t("locationPlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm bg-white">
            <option value="فعالية">فعالية</option>
            <option value="اجتماع">اجتماع</option>
            <option value="ورشة عمل">ورشة عمل</option>
            <option value="محاضرة">محاضرة</option>
            <option value="احتفال">احتفال</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>
        <button type="submit" className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm"><Plus className="w-4 h-4" /> {t("add")}</button>
      </form>

      <div className="space-y-2">
        {events.map(e => (
          <div key={e.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1a5632]" />
                <p className="font-medium text-gray-900">{e.title}</p>
                <span className="text-xs text-gray-400">— {new Date(e.date).toLocaleDateString("ar")}</span>
              </div>
              {(e.description || e.location) && <p className="text-sm text-gray-500 mt-1">{e.location && `${e.location} — `}{e.description}</p>}
            </div>
            <button onClick={() => remove(e.id)} className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        {events.length === 0 && <p className="text-center text-gray-400 py-8">{t("noEvents")}</p>}
      </div>
    </div>
  );
}
