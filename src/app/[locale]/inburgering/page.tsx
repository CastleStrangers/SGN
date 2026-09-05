"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  GraduationCap, BookOpen, CheckCircle2, Award, ArrowRight, ArrowLeft, 
  Sparkles, FileText, Globe, Building2, HelpCircle, ChevronRight, UserCheck
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

export default function InburgeringHubPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const dir = isAr ? "rtl" : "ltr";

  const modules = [
    {
      id: "knm",
      titleAr: "امتحان معرفة المجتمع الهولندي (KNM)",
      titleEn: "Knowledge of Dutch Society (KNM)",
      titleNl: "Kennis van de Nederlandse Maatschappij (KNM)",
      descAr: "تدريب عملي تفاعلي على أسئلة الامتحان الرسمي: الصحة، التعليم، السكن، القوانين، وتاريخ هولندا مع تفسير فوري لكل إجابة.",
      descEn: "Interactive practice for official exam topics: healthcare, education, housing, Dutch laws, and history.",
      descNl: "Oefen interactief voor het officiële KNM-examen: zorg, onderwijs, wonen, wetgeving en geschiedenis.",
      href: `/${locale}/courses/inburgering-quiz`,
      badgeAr: "اختبار تفاعلي حي",
      badgeEn: "Interactive Quiz",
      badgeNl: "Interactieve Toets",
      icon: BookOpen,
      iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200",
    },
    {
      id: "ona",
      titleAr: "التوجيه نحو سوق العمل (ONA & Sollicitatie)",
      titleEn: "Labor Market Orientation (ONA)",
      titleNl: "Oriëntatie op de Nederlandse Arbeidsmarkt (ONA)",
      descAr: "دليل إعداد البورتفوليو المهني، البحث عن فرص العمل والتدريب، وكتابة الـ CV ورسائل الدافع المتوافقة مع معايير هولندا.",
      descEn: "Comprehensive guidance for portfolio preparation, job search, and Dutch-standard CV crafting.",
      descNl: "Begeleiding voor het portfolio, sollicitatiegesprekken en het opstellen van een professioneel CV.",
      href: `/${locale}/services/cv-builder`,
      badgeAr: "مدمج مع صانع الـ CV",
      badgeEn: "With CV Maker",
      badgeNl: "Met CV Bouwer",
      icon: FileText,
      iconColor: "text-teal-600 bg-teal-50 dark:bg-teal-950/50 border-teal-200",
    },
    {
      id: "language",
      titleAr: "مهارات اللغة الهولندية (Nederlands A2 / B1)",
      titleEn: "Dutch Language Training (A2 & B1)",
      titleNl: "Nederlandse Taalvaardigheid (A2 / B1)",
      descAr: "نصائح لاجتياز امتحانات القراءة، الاستماع، المحادثة، والكتابة، مع روابط لأفضل المنصات التعليمية المجانية المعتمدة من DUO.",
      descEn: "Key strategies for reading, listening, speaking, and writing exams with curated DUO-approved resources.",
      descNl: "Strategieën voor lezen, luisteren, spreken en schrijven met DUO-goedgekeurde gratis bronnen.",
      href: `/${locale}/courses`,
      badgeAr: "موارد معتمدة",
      badgeEn: "Approved Resources",
      badgeNl: "Erkende Bronnen",
      icon: Globe,
      iconColor: "text-sky-600 bg-sky-50 dark:bg-sky-950/50 border-sky-200",
    },
    {
      id: "jobs",
      titleAr: "فرص العمل والتدريب المهني (Stages & Vacatures)",
      titleEn: "Jobs & Internships Hub",
      titleNl: "Vacatures & Stages",
      descAr: "استكشف الشواغر المتاحة للناطقين بالعربية والهولندية وتواصل مباشرة مع أصحاب الأعمال والشركات الشريكة.",
      descEn: "Explore vacancies for Arabic and Dutch speakers and connect directly with partner employers.",
      descNl: "Vind passende vacatures en stages bij aangesloten werkgevers in heel Nederland.",
      href: `/${locale}/jobs`,
      badgeAr: "فرص حية",
      badgeEn: "Live Vacancies",
      badgeNl: "Actuele Vacatures",
      icon: GraduationCap,
      iconColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200",
    },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Back Navigation */}
        <div>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الرئيسية" : isNl ? "Terug naar Home" : "Back to Home"}</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a5632] via-[#144226] to-[#0d2d1a] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 border border-white/10">
              <GraduationCap className="w-4 h-4 text-[#c8a84e]" />
              <span>
                {isAr
                  ? "بوابة الاندماج وامتحانات الجنسية الهولندية (Inburgering Hub)"
                  : isNl
                  ? "Inburgerings- en Naturalisatieportaal (Inburgering Hub)"
                  : "Dutch Inburgering & Naturalisation Hub"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {isAr ? "طريقك لاجتياز امتحانات الاندماج والجنسية بتفوق" : isNl ? "Uw Gids voor Geslaagde Inburgering & Naturalisatie" : "Your Fast-Track to Passing Dutch Inburgering"}
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
              {isAr
                ? "منصة تعليمية وتوجيهية متكاملة تقدمها الجالية السورية في هولندا لمساعدة المغتربين على اجتياز امتحانات KNM، ONA، واللغة الهولندية، والحصول على شهادات الإنجاز."
                : isNl
                ? "Een compleet platform ter voorbereiding op het inburgeringsexamen, arbeidsmarktoriëntatie en taalverwerving in Nederland."
                : "A comprehensive civic integration platform tailored to help newcomers pass KNM exams, prepare ONA portfolios, and master Dutch society."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-200">
              <Link
                href={`/${locale}/courses/inburgering-quiz`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a84e] hover:bg-[#b8973f] text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-105 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isAr ? "ابدأ امتحان KNM التجريبي الآن" : "Start KNM Practice Exam"}</span>
              </Link>
            </div>
          </div>

          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            const title = isAr ? m.titleAr : isNl ? m.titleNl : m.titleEn;
            const desc = isAr ? m.descAr : isNl ? m.descNl : m.descEn;
            const badge = isAr ? m.badgeAr : isNl ? m.badgeNl : m.badgeEn;

            return (
              <Link
                key={m.id}
                href={m.href}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${m.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/50 uppercase">
                      {badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{isAr ? "دخول القسم والتفاصيل" : "Explore Module"}</span>
                  <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {isAr ? "←" : "→"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
