"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/uploads")
      .then(r => r.json())
      .then(data => { setImages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-l from-[#1a5632] to-[#0f3d23] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-[#c8a84e]" /> {t('title')}
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map(img => (
              <button key={img.url} onClick={() => setSelected(img.url)} className="group relative aspect-square rounded-xl overflow-hidden border bg-white hover:shadow-md transition-shadow">
                <img src={img.url} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <button onClick={() => setSelected(null)} className="absolute top-4 left-4 text-white hover:text-gray-300">
            <X className="w-8 h-8" />
          </button>
          <img src={selected} alt="" loading="lazy" decoding="async" className="max-w-full max-h-full rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
