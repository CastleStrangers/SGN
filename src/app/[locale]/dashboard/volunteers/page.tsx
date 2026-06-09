"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function VolunteersPage() {
  const t = useTranslations('dashboard.volunteersPage');
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/volunteer")
      .then(r => r.json())
      .then(data => { setVolunteers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h1>
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" /></div>
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
                <span className="text-xs text-gray-400">{new Date(v.createdAt).toLocaleDateString("ar")}</span>
              </div>
              {v.skills && <div className="mt-2"><span className="text-xs text-gray-500">{t('skills')}</span><span className="text-sm text-gray-700">{v.skills}</span></div>}
              {v.availability && <div><span className="text-xs text-gray-500">{t('duration')}</span><span className="text-sm text-gray-700">{v.availability}</span></div>}
              {v.message && <p className="text-sm text-gray-600 mt-2 border-t pt-2">{v.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
