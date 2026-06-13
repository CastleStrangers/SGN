"use client";

import { useEffect, useState, useRef } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight, ExternalLink, ZoomIn } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface GalleryImage {
  url: string;
  title: string;
  slug?: string;
  category?: string;
  createdAt?: string;
  source: "post" | "upload";
}

export default function GalleryPage() {
  const t = useTranslations('gallery');
  const tNews = useTranslations('newsPage');
  const locale = useLocale();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("الكل");

  useEffect(() => {
    fetch("/api/uploads")
      .then(r => r.json())
      .then(data => { 
        setImages(Array.isArray(data) ? data : []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter categories
  const categories = [
    "الكل",
    "أخبار الجالية",
    "أخبار هولندا",
    "أخبار أوروبا",
    "اقتصاد",
    "ثقافيات",
    "فعاليات",
    "مرفوعة"
  ];

  const getCategoryLabel = (cat: string) => {
    if (cat === "الكل") return tNews('all');
    if (cat === "أخبار الجالية") return tNews('communityNews');
    if (cat === "أخبار هولندا") return tNews('netherlandsNews');
    if (cat === "أخبار أوروبا") return tNews('europeNews');
    if (cat === "اقتصاد") return tNews('economy');
    if (cat === "ثقافيات") return tNews('culture');
    if (cat === "فعاليات") return tNews('events');
    if (cat === "مرفوعة") {
      if (locale === "nl") return "Geüpload";
      if (locale === "en") return "Uploaded";
      return "صور مرفوعة";
    }
    return cat;
  };

  const getReadMoreLabel = () => {
    if (locale === "nl") return "Lees artikel";
    if (locale === "en") return "Read article";
    return "قراءة المقال";
  };

  // Filtered images list
  const filteredImages = images.filter(img => {
    if (activeCategory === "الكل") return true;
    if (activeCategory === "مرفوعة") return img.source === "upload";
    return img.category === activeCategory;
  });

  // Lightbox keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowRight") {
        setSelectedIdx(prev => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setSelectedIdx(prev => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, filteredImages]);

  const activeImage = selectedIdx !== null ? filteredImages[selectedIdx] : null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#fafdfb] text-gray-800 pb-12">
      {/* CSS Masonry layout and transitions */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .masonry-grid {
          column-count: 1;
          column-gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .masonry-grid {
            column-count: 2;
          }
        }
        @media (min-width: 768px) {
          .masonry-grid {
            column-count: 3;
          }
        }
        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 4;
          }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.25rem;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a5632] via-[#113d22] to-[#0d2e1a] text-white py-12 md:py-16 shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-[#c8a84e]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#c8a84e]/90 hover:text-white mb-4 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToHome')}</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-extrabold flex items-center gap-3 tracking-tight">
            <ImageIcon className="w-9 h-9 md:w-12 md:h-12 text-[#c8a84e] filter drop-shadow" />
            <span>{t('title')}</span>
          </h1>
          <p className="text-white/80 mt-3 max-w-2xl text-sm md:text-base leading-relaxed font-light">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selector Tabs */}
        <div className="mb-8 overflow-x-auto scrollbar-none pb-2 border-b border-gray-100">
          <div className="flex gap-2.5 min-w-max pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSelectedIdx(null); }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#1a5632] to-[#113d22] text-white shadow-md shadow-[#1a5632]/25 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#1a5632]/40 hover:text-[#1a5632] shadow-sm"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80 gap-3">
            <div className="animate-spin w-10 h-10 border-4 border-[#1a5632] border-t-transparent rounded-full" />
            <p className="text-sm text-gray-400">جاري تحميل الصور...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">{t('empty')}</p>
            <p className="text-sm text-gray-400 mt-1">يرجى تجربة فلتر آخر لعرض الصور.</p>
          </div>
        ) : (
          /* Pinterest Masonry Grid */
          <div className="masonry-grid">
            {filteredImages.map((img, index) => (
              <div 
                key={img.url + "-" + index} 
                className="masonry-item group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedIdx(index)}
              >
                {/* Image */}
                <img 
                  src={img.url} 
                  alt={img.title} 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                />
                
                {/* Hover Glassmorphic Overlay Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  {img.category && (
                    <span className="backdrop-blur-md bg-white/20 text-white border border-white/10 text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit mb-1.5">
                      {getCategoryLabel(img.category)}
                    </span>
                  )}
                  <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug mb-3">
                    {img.title}
                  </h3>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                    <span className="text-white/80 hover:text-white flex items-center gap-1 text-xs font-medium">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>تكبير</span>
                    </span>
                    
                    {img.slug && (
                      <Link 
                        href={`/news/${img.slug}`}
                        onClick={e => e.stopPropagation()}
                        className="text-[#c8a84e] hover:text-white flex items-center gap-1 text-xs font-semibold"
                      >
                        <span>{getReadMoreLabel()}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Slider Overlay Modal */}
      {selectedIdx !== null && activeImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-between p-4 md:p-6 animate-fade-in"
          onClick={() => setSelectedIdx(null)}
        >
          {/* Topbar */}
          <div className="flex items-center justify-between w-full text-white z-10 px-2 py-2">
            <span className="text-xs md:text-sm text-gray-400 font-medium">
              {selectedIdx + 1} / {filteredImages.length}
            </span>
            <button 
              onClick={() => setSelectedIdx(null)} 
              className="p-2 rounded-full bg-white/5 text-white hover:bg-white/10 hover:text-yellow-400 hover:scale-105 transition-all"
              aria-label="إغلاق"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image Viewer with Navigation */}
          <div className="relative flex-grow flex items-center justify-center my-4">
            {/* Previous Arrow Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(prev => (prev !== null && prev > 0 ? prev - 1 : filteredImages.length - 1));
              }}
              className="absolute right-2 md:right-6 p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 hover:text-[#c8a84e] transition-all z-10 active:scale-95"
              title="الصورة السابقة"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Main Lightbox Image */}
            <div className="max-w-[90vw] max-h-[75vh] flex items-center justify-center animate-scale-in">
              <img 
                src={activeImage.url} 
                alt={activeImage.title} 
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-[75vh] rounded-2xl object-contain shadow-2xl border border-white/5" 
                onClick={e => e.stopPropagation()} 
              />
            </div>

            {/* Next Arrow Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(prev => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : 0));
              }}
              className="absolute left-2 md:left-6 p-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 hover:text-[#c8a84e] transition-all z-10 active:scale-95"
              title="الصورة التالية"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Bottom Caption and Article Link */}
          <div 
            className="w-full max-w-3xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/10 text-center text-white z-10 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {activeImage.category && (
              <span className="inline-block bg-[#1a5632] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 border border-white/10">
                {getCategoryLabel(activeImage.category)}
              </span>
            )}
            <h2 className="font-bold text-sm md:text-base leading-snug max-w-xl mx-auto mb-3">
              {activeImage.title}
            </h2>
            
            {activeImage.slug && (
              <Link 
                href={`/news/${activeImage.slug}`}
                onClick={() => setSelectedIdx(null)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c8a84e] text-[#1a1a2e] text-xs font-bold hover:bg-[#b8973f] hover:scale-102 transition-all shadow-md"
              >
                <span>{getReadMoreLabel()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
