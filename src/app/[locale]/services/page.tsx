"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, MapPin, Briefcase, Star, MessageCircle, Loader2, User, Map as MapIcon, LayoutGrid } from "lucide-react";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { Link } from "@/i18n/routing";
import { NLMap } from "@/components/home/nl-map";

interface ServiceMember {
  id: string;
  nameAr: string;
  nameNl: string;
  profession: string | null;
  nlCity: string;
  nlProvincie: string;
  serviceDescription: string | null;
  avatar: string | null;
  avgRating: number;
  reviewCount: number;
  isPremiumService: boolean;
}

export default function ServicesDirectoryPage() {
  const t = useTranslations("directory");
  const tm = useTranslations("memberProfilePage");
  const locale = useLocale();
  const [members, setMembers] = useState<ServiceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  useEffect(() => {
    fetchMembers();
  }, [q, city, province]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (city) params.set("city", city);
      if (province) params.set("province", province);
      const res = await fetch(`/api/members/services?${params}`);
      const data = await res.json();
      setMembers(data.members || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="auto" className="min-h-screen bg-slate-50">
      <TopBar />
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">دليل الخدمات المهنية</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            ابحث عن المهنيين والمبدعين السوريين في هولندا. من الحرف اليدوية إلى الاستشارات القانونية والتقنية.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                ${viewMode === "grid" ? "bg-slate-900 dark:bg-slate-800 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
            >
              <LayoutGrid className="w-4 h-4" />
              عرض الشبكة
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                ${viewMode === "map" ? "bg-emerald-700 text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}
            >
              <MapIcon className="w-4 h-4" />
              الخريطة التفاعلية
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Filters & Ad Card Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 p-4 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث عن: ميكانيكي، حلاق، محاسب..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="المدينة..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-slate-100 text-sm"
                />
              </div>

              {viewMode === "map" && (
                <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 mb-4 tracking-widest text-center">اختر المقاطعة من الخريطة أدناه</p>
                  <NLMap selectedProvince={province} onProvinceSelect={setProvince} />
                  {province && (
                    <button
                      onClick={() => setProvince("")}
                      className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                    >
                      إلغاء تحديد المقاطعة
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Advertise with us Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/10 dark:to-slate-950 rounded-3xl border border-amber-500/20 dark:border-amber-500/30 p-6 text-slate-900 dark:text-slate-100 shadow-xl flex flex-col gap-4 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Star className="w-5 h-5 fill-current animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">روّج لخدمتك معنا 🚀</h3>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">دليل الخدمات المهنية</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                ضاعف زبائنك واظهر في مقدمة نتائج البحث والخريطة التفاعلية للجالية السورية في هولندا.
              </p>

              <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3 text-[11px]">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>الباقة الفضية (صدارة البحث)</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">5€ / شهر</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>الباقة الذهبية (صدارة + تمييز الخريطة)</span>
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">10€ / شهر</span>
                </div>
              </div>

              <a
                href="https://wa.me/31684603406?text=مرحباً، أريد الإعلان في دليل الخدمات المهنية للجالية السورية"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-center text-xs transition-all duration-300 shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] border border-amber-500"
              >
                <span>💬</span> أعلن معنا الآن
              </a>
            </div>

            {viewMode === "map" && !loading && (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {members.map(m => (
                  <Link 
                    key={m.id} 
                    href={`/profile/${m.id}`} 
                    className={`block p-4 rounded-2xl border transition-all
                      ${m.isPremiumService 
                        ? "bg-amber-50/10 dark:bg-amber-950/10 border-amber-300 dark:border-amber-500/50 hover:border-amber-500 shadow-sm" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black shrink-0 overflow-hidden border border-emerald-100 dark:border-emerald-900/50">
                        {m.avatar ? <img src={m.avatar} alt="" className="w-full h-full object-cover" /> : m.nameAr.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{m.nameAr}</h4>
                          {m.isPremiumService && (
                            <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded text-[8px] font-black uppercase shrink-0 tracking-wider scale-95">تميز</span>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{m.profession}</p>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold">{m.avgRating > 0 ? m.avgRating.toFixed(1) : "—"}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            {viewMode === "map" ? (
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 p-8 h-full min-h-[600px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">توزع الخدمات في هولندا</h2>
                  {province && <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-black border border-emerald-100 dark:border-emerald-900/50">{province}</span>}
                </div>
                <div className="flex-1 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-slate-100/50 dark:border-slate-800/50">
                   <div className="w-full max-w-lg">
                      <NLMap selectedProvince={province} onProvinceSelect={setProvince} />
                   </div>
                </div>
              </div>
            ) : (
              loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-emerald-700" />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <User className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400 dark:text-slate-500 font-bold">لا يوجد مزودي خدمات مطابقين لبحثك حالياً</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div 
                      key={member.id} 
                      className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all group overflow-hidden relative
                        ${member.isPremiumService 
                          ? "border-amber-500 dark:border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20 bg-gradient-to-b from-amber-50/10 to-white dark:from-amber-950/5 dark:to-slate-900 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1" 
                          : "border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1"
                        }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 overflow-hidden border
                            ${member.isPremiumService
                              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50"
                              : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
                            }`}
                          >
                            {member.avatar ? <img src={member.avatar} alt="" className="w-full h-full object-cover" /> : member.nameAr.charAt(0)}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="flex items-center gap-1">
                              <Star className={`w-3.5 h-3.5 ${member.avgRating > 0 ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{member.avgRating > 0 ? member.avgRating.toFixed(1) : "—"}</span>
                              <span className="text-[10px] text-slate-400">({member.reviewCount})</span>
                            </div>
                            {member.isPremiumService ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black rounded-lg text-[9px] uppercase tracking-wider shadow-sm animate-pulse shrink-0">
                                إعلان مميز 🚀
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/50 shrink-0">
                                {tm("accepted")}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                          {member.nameAr}
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3" dir="ltr">{member.nameNl}</p>

                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-4">
                          <Briefcase className={`w-4 h-4 ${member.isPremiumService ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400"}`} />
                          <span className="font-bold">{member.profession}</span>
                        </div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed min-h-[4.5rem]">
                          {member.serviceDescription}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {member.nlCity}
                          </div>
                          <Link
                            href={`/profile/${member.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            تواصل
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
