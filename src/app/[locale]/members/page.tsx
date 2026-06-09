"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Loader2, Search, MapPin, User, Calendar, X, Users } from "lucide-react";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { SiteFooter } from "@/components/home/site-footer";

const SYRIAN_GOVERNORATES = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "إدلب", "دير الزور", "الرقة", "الحسكة", "درعا", "السويداء", "القنيطرة",
];

const NL_PROVINCES = [
  "Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant",
  "Overijssel", "Flevoland", "Groningen", "Friesland", "Drenthe", "Zeeland", "Limburg",
];

interface MemberCard {
  id: string; nameAr: string; nameNl: string;
  birthYear: number; gender: string;
  originCity: string; nlProvincie: string; nlCity: string;
  createdAt: string;
}

interface DirectoryResponse {
  members: MemberCard[];
  total: number;
  page: number;
  totalPages: number;
}

export default function MembersDirectoryPage() {
  const t = useTranslations("directory");
  const locale = useLocale();
  const [data, setData] = useState<DirectoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [q, setQ] = useState("");
  const [gender, setGender] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [nlProvincie, setNlProvincie] = useState("");
  const [page, setPage] = useState(1);

  function fetchData() {
    setLoading(true);
    setError(false);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (gender) params.set("gender", gender);
    if (originCity) params.set("originCity", originCity);
    if (nlProvincie) params.set("nlProvincie", nlProvincie);
    params.set("page", String(page));

    fetch(`/api/members/directory?${params}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setData(d);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }

  useEffect(() => { fetchData(); }, [page]);
  useEffect(() => { setPage(1); }, [q, gender, originCity, nlProvincie]);

  useEffect(() => {
    if (!q && !gender && !originCity && !nlProvincie) {
      fetchData();
    }
  }, []);

  const hasFilters = q || gender || originCity || nlProvincie;

  return (
    <div dir="auto" className="min-h-screen bg-gray-50">
      <TopBar />
      <SiteHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl border p-4 mb-8 space-y-3">
          <div className="relative">
            <input type="text" value={q} onChange={e => setQ(e.target.value)}
              className="w-full p-3 pl-10 pr-4 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              placeholder={t("search")} />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={gender} onChange={e => setGender(e.target.value)}
              className="p-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600">
              <option value="">{t("gender")}</option>
              <option value="ذكر">{t("male")}</option>
              <option value="أنثى">{t("female")}</option>
            </select>
            <select value={originCity} onChange={e => setOriginCity(e.target.value)}
              className="p-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600">
              <option value="">{t("originCity")}</option>
              {SYRIAN_GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={nlProvincie} onChange={e => setNlProvincie(e.target.value)}
              className="p-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600">
              <option value="">{t("nlProvincie")}</option>
              {NL_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {hasFilters && (
              <button onClick={() => { setQ(""); setGender(""); setOriginCity(""); setNlProvincie(""); }}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition flex items-center gap-1">
                <X className="w-4 h-4" /> {t("clear")}
              </button>
            )}
          </div>
          {data && !loading && (
            <p className="text-xs text-gray-400">{t("totalMembers")}: {data.total}</p>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">{t("error")}</p>
            <button onClick={fetchData} className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold text-sm hover:bg-emerald-900 transition">
              {t("retry")}
            </button>
          </div>
        )}

        {!loading && !error && data && data.members.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">{t("noResults")}</p>
          </div>
        )}

        {!loading && !error && data && data.members.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.members.map(m => (
                <Link key={m.id} href={`/${locale}/member/${m.id}`}
                  className="bg-white rounded-2xl border p-5 hover:shadow-lg hover:border-emerald-200 transition-all group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-800 flex items-center justify-center text-white text-lg font-bold shrink-0">
                      {m.nameAr.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{m.nameAr}</p>
                      <p className="text-xs text-gray-400 truncate" dir="ltr">{m.nameNl}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{m.originCity} → {m.nlCity} ({m.nlProvincie})</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="w-3 h-3 shrink-0" />
                      <span>{m.gender} — {m.birthYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>{t("memberSince")} {new Date(m.createdAt).toLocaleDateString(locale === "ar" ? "ar" : locale === "nl" ? "nl" : "en")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="px-4 py-2 bg-white border rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                  ‹
                </button>
                <span className="text-sm text-gray-500">
                  {t("page")} {data.page} {t("of")} {data.totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}
                  className="px-4 py-2 bg-white border rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition">
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
