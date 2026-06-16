"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2, Printer, Share2, CheckCircle2 } from "lucide-react";
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

function QRCode({ value, size = 80 }: { value: string; size?: number }) {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(value)}&bgcolor=1a5632&color=ffffff&margin=4`}
      alt="QR"
      width={size}
      height={size}
      className="rounded-lg"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function SyrianFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 900 600" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#000000"/>
      <rect y="200" width="900" height="200" fill="#ffffff"/>
      <rect y="400" width="900" height="200" fill="#007a3d"/>
      <g fill="#ce1126" transform="translate(450,300)">
        <polygon points="0,-60 14.1,-43.5 -22.8,-14.1 22.8,-14.1 -14.1,-43.5"/>
        <polygon points="57,-18.5 51.1,-35.2 21.8,-3.6 47.6,12.8 34.9,-7.7"/>
        <polygon points="-57,-18.5 -51.1,-35.2 -21.8,-3.6 -47.6,12.8 -34.9,-7.7"/>
        <polygon points="35.2,47.6 22.5,28 -4.2,57.8 18.4,30.5 41.9,44"/>
        <polygon points="-35.2,47.6 -22.5,28 4.2,57.8 -18.4,30.5 -41.9,44"/>
      </g>
    </svg>
  );
}

function DutchFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 6" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="9" height="2" fill="#AE1C28"/>
      <rect y="2" width="9" height="2" fill="#fff"/>
      <rect y="4" width="9" height="2" fill="#21468B"/>
    </svg>
  );
}

export default function MembershipCardPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("membershipCard");
  const locale = useLocale();
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleDownload = async () => {
    if (!cardRef.current || !data) return;
    setDownloading(true);
    try {
      // Use html2canvas-like approach via print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `${data?.nameAr} - ${t('cardTitle')}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-foreground">
        <TopBar /><SiteHeader />
        <main className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-400 mx-auto mb-4" />
            <p className="text-emerald-300 text-sm">{t('loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-foreground">
        <TopBar /><SiteHeader />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-lg font-medium text-gray-400">{t('notFound')}</p>
        </main>
      </div>
    );
  }

  const memberNum = data.memberNumber ? String(data.memberNumber).padStart(6, '0') : '------';

  return (
    <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white">
      <TopBar />
      <SiteHeader />

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Page Title */}
        <div className="text-center mb-8 no-print">
          <h1 className="text-2xl font-bold text-white mb-1">{t('pageTitle')}</h1>
          <p className="text-emerald-400 text-sm">{t('pageSubtitle')}</p>
        </div>

        {/* THE CARD */}
        <div
          ref={cardRef}
          className="card-print relative w-full max-w-[440px] mx-auto rounded-3xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: '1.586/1', minHeight: '277px' }}
        >
          {/* Background gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900" />

          {/* Holographic shimmer overlay */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                135deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.08) 2px,
                rgba(255,255,255,0.08) 4px
              )`,
            }}
          />

          {/* Decorative circle top-right */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-500/10 blur-xl" />

          {/* Chip decoration */}
          <div className="absolute top-8 left-8 w-10 h-8 rounded-md border border-yellow-400/50 bg-gradient-to-br from-yellow-300/20 to-yellow-600/10"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(200,168,78,0.3) 3px, rgba(200,168,78,0.3) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(200,168,78,0.3) 3px, rgba(200,168,78,0.3) 4px)`,
            }}
          />

          {/* Flags top-right */}
          <div className="absolute top-7 right-7 flex items-center gap-1.5 no-print-hide">
            <SyrianFlag className="w-7 h-[18px] rounded-sm shadow-md border border-white/10" />
            <DutchFlag className="w-7 h-[18px] rounded-sm shadow-md border border-white/10" />
          </div>

          {/* Card content */}
          <div className="relative z-10 p-7 h-full flex flex-col justify-between">

            {/* Top: org name */}
            <div>
              <div className="text-center mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300/70 mb-0.5">
                  Syrische Gemeenschap in Nederland
                </p>
                <p className="text-[9px] text-emerald-400/60 tracking-widest uppercase">
                  الجالية السورية في هولندا
                </p>
              </div>

              {/* Main info row */}
              <div className="flex items-center gap-5">

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden shadow-inner">
                    {data.avatar ? (
                      <img src={data.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-white/80">{data.nameAr.charAt(0)}</span>
                    )}
                  </div>
                </div>

                {/* Name & details */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-black text-white leading-tight truncate">{data.nameAr}</h2>
                  <p className="text-emerald-300 text-xs mt-0.5 truncate" dir="ltr">{data.nameNl}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] text-emerald-300 font-bold">
                      {t('memberBadge')}
                    </span>
                    {data.memberNumber && (
                      <span className="text-yellow-400/80 text-[10px] font-mono font-bold">
                        #{memberNum}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Middle: info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">{t('birthYear')}</p>
                <p className="text-sm font-bold text-white">{data.birthYear}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">{t('gender')}</p>
                <p className="text-sm font-bold text-white">{data.gender}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">{t('originCity')}</p>
                <p className="text-sm font-bold text-white">{data.originCity}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">{t('residence')}</p>
                <p className="text-xs font-bold text-white truncate">{data.nlCity}</p>
              </div>
            </div>

            {/* Bottom: QR + date + member number strip */}
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">{t('membershipDate')}</p>
                <p className="text-xs font-bold text-white">{formatDate(data.createdAt, locale)}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">{t('activeStatus')}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-1">
                {typeof window !== "undefined" && (
                  <QRCode value={`${window.location.origin}/member/${data.id}`} size={60} />
                )}
                <p className="text-[8px] text-white/30 text-center">Scan to verify</p>
              </div>
            </div>

          </div>

          {/* Bottom edge strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500/60 via-emerald-400/80 to-yellow-500/60" />

          {/* KVK watermark */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] text-white/15 font-mono tracking-widest whitespace-nowrap">
            KVK: 96718943 · sy-nl.org
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-bold transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            {t('printBtn')}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-900/50"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
            {copied ? t('copied') : t('shareBtn')}
          </button>
        </div>

        {/* Verification note */}
        <p className="text-center text-white/30 text-xs mt-6 no-print">
          {t('verifyNote')}
        </p>

      </main>

      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .no-print { display: none !important; }
          header, nav, footer, [class*="TopBar"], [class*="SiteHeader"] { display: none !important; }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .card-print {
            width: 85.6mm !important;
            height: 53.98mm !important;
            margin: 5mm auto !important;
            box-shadow: none !important;
            border-radius: 3mm !important;
            page-break-inside: avoid;
          }
          @page {
            size: 100mm 70mm;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
