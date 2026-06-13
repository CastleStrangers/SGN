"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";


interface CardData {
  id: string; memberNumber?: number | null;
  nameAr: string; nameNl: string;
  birthYear: number; gender: string;
  originCity: string; nlProvincie: string; nlCity: string;
  avatar?: string | null;
  createdAt: string;
}

export default function MembershipCardPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("membershipCard");
  const locale = useLocale();
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/member/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setData(d);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div dir="auto" className="min-h-screen bg-background text-foreground">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
        </main>
        
      </div>
    );
  }

  if (error || !data) {
    return (
      <div dir="auto" className="min-h-screen bg-background text-foreground">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-lg font-medium text-gray-500">{t('notFound')}</p>
        </main>
        
      </div>
    );
  }

  return (
    <div dir="auto" className="min-h-screen bg-background text-foreground">
      <TopBar />
      <SiteHeader />
      <main className="max-w-sm mx-auto px-4 py-8">
        <div className="text-center mb-6 no-print">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition">
            <Printer className="w-4 h-4" /> {t('printBtn')}
          </button>
        </div>

        <div ref={cardRef} className="card-print bg-white rounded-3xl border-2 border-emerald-800 overflow-hidden shadow-xl">
          <div className="bg-emerald-800 p-6 text-center text-white">
            <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-3 flex items-center justify-center overflow-hidden border-2 border-white/50">
              {data.avatar ? (
                <img src={data.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold">{data.nameAr.charAt(0)}</span>
              )}
            </div>
            <h2 className="text-xl font-bold">{data.nameAr}</h2>
            <p className="text-emerald-200 text-sm" dir="ltr">{data.nameNl}</p>
          </div>

          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">{t('memberNumber')}</span>
              <span className="font-bold">{data.memberNumber || "---"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">{t('birthYear')}</span>
              <span className="font-bold">{data.birthYear}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">{t('gender')}</span>
              <span className="font-bold">{data.gender}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">{t('originCity')}</span>
              <span className="font-bold">{data.originCity}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">{t('residence')}</span>
              <span className="font-bold">{data.nlCity} — {data.nlProvincie}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">{t('membershipDate')}</span>
              <span className="font-bold">{formatDate(data.createdAt, locale)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 py-3 bg-emerald-800">
            <p className="text-emerald-200 text-[10px]">{t('footer')}</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=${encodeURIComponent(`${window.location.origin}/member/${data.id}`)}`} alt="QR" className="w-10 h-10 rounded bg-[#ffffff]" />
          </div>
        </div>

        <style jsx global>{`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
            .no-print { display: none !important; }
            .card-print { box-shadow: none !important; border: 2px solid #065f46 !important; }
            @page { size: 350px 550px; margin: 0; }
          }
        `}</style>
      </main>
      
    </div>
  );
}
