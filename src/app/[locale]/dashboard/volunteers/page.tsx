"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";
import { Search, Loader2 } from "lucide-react";

export default function VolunteersPage() {
  const t = useTranslations('dashboard.volunteersPage');
  const locale = useLocale();
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", String(PAGE_SIZE));
    params.set("offset", String(page * PAGE_SIZE));
    if (search) params.set("search", search);

    fetch(`/api/volunteer?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.volunteers) { setVolunteers(data.volunteers); setTotal(data.total); }
        else if (Array.isArray(data)) { setVolunteers(data); setTotal(data.length); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')} ({total})</h1>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder={t('search') || "بحث..."} title={t('search')} aria-label={t('search')} className="w-full pr-10 p-3 border rounded-xl text-sm bg-white" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-800" /></div>
      ) : volunteers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t('noVolunteers')}</div>
      ) : (
        <div className="space-y-3">
          {volunteers.map(v => (
            <div key={v.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{v.name}</h3>
                  <p className="text-sm text-gray-500">{v.email}{v.phone ? ` - ${v.phone}` : ""}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDate(v.createdAt, locale)}</span>
              </div>
              {v.skills && <div className="mt-2"><span className="text-xs text-gray-500">{t('skills')}</span><span className="text-sm text-gray-700">{v.skills}</span></div>}
              {v.availability && <div><span className="text-xs text-gray-500">{t('duration')}</span><span className="text-sm text-gray-700">{v.availability}</span></div>}
              {v.message && <p className="text-sm text-gray-600 mt-2 border-t pt-2">{v.message}</p>}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-4 py-2 border rounded-xl text-sm bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
            ← السابق
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} className={`w-9 h-9 rounded-xl text-sm font-medium transition ${i === page ? "bg-emerald-800 text-white" : "bg-white border hover:bg-gray-50"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-4 py-2 border rounded-xl text-sm bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
            التالي →
          </button>
        </div>
      )}
    </div>
  );
}
