"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  Briefcase, Search, MapPin, Building2, Clock, Euro, Sparkles, 
  Filter, CheckCircle2, ArrowRight, ArrowLeft, FileText, Send, 
  ExternalLink, UserCheck, ShieldCheck, PlusCircle, X, ChevronRight,
  GraduationCap, Utensils, Wrench, Laptop, HeartPulse, Truck, Zap, User
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface JobItem {
  id: string;
  titleAr: string;
  titleEn: string;
  titleNl: string;
  company: string;
  city: string;
  province: string;
  category: "tech" | "health" | "hospitality" | "crafts" | "logistics" | "general";
  type: "full-time" | "part-time" | "stage" | "freelance";
  salary: string;
  salaryEn: string;
  salaryNl: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionNl: string;
  languages: string[];
  featured?: boolean;
  createdAt: string;
  contactEmail: string;
  contactPhone: string;
}

const SAMPLE_JOBS: JobItem[] = [
  {
    id: "job-1",
    titleAr: "مطور برمجيات واجهات أمامية (Frontend Developer)",
    titleEn: "Frontend Developer (React / Next.js)",
    titleNl: "Frontend Developer (React / Next.js)",
    company: "DutchTech Innovations B.V.",
    city: "Amsterdam",
    province: "Noord-Holland",
    category: "tech",
    type: "full-time",
    salary: "€ ٣,٥٠٠ - ٤,٢٠٠ شهرياً",
    salaryEn: "€ 3,500 - 4,200 / month",
    salaryNl: "€ 3.500 - 4.200 / maand",
    descriptionAr: "مطلوب مطور React/TypeScript للانضمام لفريق تقني في أمستردام. بيئة عمل هولندية مرنة مع إمكانية العمل الهجين (Hybrid).",
    descriptionEn: "Seeking a React/TypeScript developer to join a tech team in Amsterdam. Hybrid work model with competitive benefits.",
    descriptionNl: "Gezocht: React/TypeScript developer voor ons tech team in Amsterdam. Hybride werkvorm met uitstekende arbeidsvoorwaarden.",
    languages: ["English", "Nederlands"],
    featured: true,
    createdAt: "2026-09-01",
    contactEmail: "jobs@dutchtech.example.nl",
    contactPhone: "+31 20 555 1234",
  },
  {
    id: "job-2",
    titleAr: "شيف ومسؤول مشاوي شامية (Chefkik / Grillmaster)",
    titleEn: "Levantine Head Chef & Grillmaster",
    titleNl: "Chef-kok & Grillmeester Syrische Keuken",
    company: "مطعم دمشق الشام (Damascus Grill)",
    city: "Rotterdam",
    province: "Zuid-Holland",
    category: "hospitality",
    type: "full-time",
    salary: "€ ٢,٦٠٠ - ٣,١٠٠ شهرياً",
    salaryEn: "€ 2,600 - 3,100 / month",
    salaryNl: "€ 2.600 - 3.100 / maand",
    descriptionAr: "مطعم سوري معروف في روتردام يبحث عن شيف متمرس بالمشاوي والمقبلات الشامية الأصيلة. عقد عمل رسمي وتأمين صحي.",
    descriptionEn: "Authentic Syrian restaurant in Rotterdam seeks an experienced grill and mezze chef. Official contract and benefits.",
    descriptionNl: "Gerenommeerd Syrisch restaurant in Rotterdam zoekt ervaren grill- en mezzekok. Vast contract en pensioenopbouw.",
    languages: ["العربية", "Nederlands basis"],
    featured: true,
    createdAt: "2026-09-02",
    contactEmail: "info@damascus-rotterdam.example.com",
    contactPhone: "+31 10 789 4561",
  },
  {
    id: "job-3",
    titleAr: "فرصة تدريب مهني في المحاسبة والمالية (Stage / Leerwerkplek)",
    titleEn: "Accounting & Finance Internship (Stage)",
    titleNl: "Stage / Leerwerkplek Boekhouding & Financiën",
    company: "Al-Amal Financial Services",
    city: "Utrecht",
    province: "Utrecht",
    category: "general",
    type: "stage",
    salary: "€ ٦٠٠ مكافأة تدريب شهرياً",
    salaryEn: "€ 600 monthly stage allowance",
    salaryNl: "€ 600 stagevergoeding per maand",
    descriptionAr: "فرصة تدريب ممتازة لطلاب الـ MBO/HBO في المحاسبة للتدرب على الأنظمة الضريبية الهولندية والبرامج المحاسبية المعتمدة.",
    descriptionEn: "Excellent internship for MBO/HBO accounting students to master Dutch tax systems and professional software.",
    descriptionNl: "Uitstekende stageplek voor MBO/HBO studenten financieel/administratie om ervaring op te doen met Nederlandse belastingaangiftes.",
    languages: ["Nederlands", "العربية"],
    featured: false,
    createdAt: "2026-09-03",
    contactEmail: "stage@alamal-finance.example.nl",
    contactPhone: "+31 30 234 5678",
  },
  {
    id: "job-4",
    titleAr: "فني كهربائي وصيانة منشآت (Elektromonteur)",
    titleEn: "Certified Electrician & Facility Technician",
    titleNl: "Elektromonteur & Installatietechnicus",
    company: "ElectroService Randstad",
    city: "Den Haag",
    province: "Zuid-Holland",
    category: "crafts",
    type: "full-time",
    salary: "€ ٢,٩٠٠ - ٣,٦٠٠ شهرياً",
    salaryEn: "€ 2,900 - 3,600 / month",
    salaryNl: "€ 2.900 - 3.600 / maand",
    descriptionAr: "مطلوب فني كهرباء لتركيب وصيانة اللوحات الكهربائية وأنظمة الطاقة الشمسية. يشترط رخصة قيادة وسيارة عمل متوفرة.",
    descriptionEn: "Electrician needed for installations, maintenance, and solar panel setups. Driver license required, company van provided.",
    descriptionNl: "Elektromonteur gezocht voor installaties en zonnepanelen in de Randstad. Rijbewijs B vereist, bedrijfsauto inbegrepen.",
    languages: ["Nederlands", "English"],
    featured: true,
    createdAt: "2026-09-04",
    contactEmail: "werken@electro-randstad.example.nl",
    contactPhone: "+31 70 345 6789",
  },
  {
    id: "job-5",
    titleAr: "مترجم محلف واستشاري شؤون الهجرة (Beëdigd Tolk / Vertaler)",
    titleEn: "Sworn Arabic-Dutch Translator & Immigration Consultant",
    titleNl: "Beëdigd Tolk/Vertaler Arabisch-Nederlands",
    company: "EuroTex Bureau",
    city: "Eindhoven",
    province: "Noord-Brabant",
    category: "general",
    type: "part-time",
    salary: "€ ٣٥ - ٤٥ للساعة",
    salaryEn: "€ 35 - 45 / hour",
    salaryNl: "€ 35 - 45 / uur",
    descriptionAr: "مكتب استشارات قانونية يبحث عن مترجم محلف عربي/هولندي للعمل في ترجمة الجلسات والوثائق الرسمية.",
    descriptionEn: "Legal consultancy bureau seeking certified Arabic/Dutch translator for hearings and official documents.",
    descriptionNl: "Juridisch adviesbureau zoekt beëdigde tolk/vertaler Arabisch-Nederlands voor zittingen en officiële documentatie.",
    languages: ["العربية", "Nederlands"],
    featured: false,
    createdAt: "2026-09-04",
    contactEmail: "info@eurotex.example.nl",
    contactPhone: "+31 40 123 9876",
  },
  {
    id: "job-6",
    titleAr: "سائق توزيع طرود ولوجستيات (Koerier / Bezorger B)",
    titleEn: "Delivery Driver (Category B)",
    titleNl: "Pakketbezorger / Koerier (Rijbewijs B)",
    company: "Express NL Logistics",
    city: "Almere",
    province: "Flevoland",
    category: "logistics",
    type: "full-time",
    salary: "€ ٢,٤٠٠ - ٢,٨٠٠ شهرياً",
    salaryEn: "€ 2,400 - 2,800 / month",
    salaryNl: "€ 2.400 - 2.800 / maand",
    descriptionAr: "توزيع طرود في منطقة فليفولاند وشمال هولندا. أوقات عمل مرنة وحوافز إضافية لكل تسليم سريع.",
    descriptionEn: "Parcel delivery in Flevoland area. Flexible shifts with bonus structure for fast deliveries.",
    descriptionNl: "Pakketbezorging in Flevoland en omstreken. Flexibele werktijden en prestatiebonussen.",
    languages: ["Nederlands basis", "English"],
    featured: false,
    createdAt: "2026-09-05",
    contactEmail: "solliciteren@expressnl.example.nl",
    contactPhone: "+31 36 555 8899",
  },
];

const CITIES = [
  "All",
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Almere",
  "Groningen",
  "Tilburg",
];

export default function JobsHubPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Application Modal State
  const [activeJob, setActiveJob] = useState<JobItem | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [applicantNote, setApplicantNote] = useState("");
  const [hasCvReady, setHasCvReady] = useState(true);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCv, setSavedCv] = useState<any | null>(null);

  // Load saved CV from SGN CV Builder
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("sgn_cv_data");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedCv(parsed);
          if (parsed.fullName) setApplicantName(parsed.fullName);
          if (parsed.email) setApplicantEmail(parsed.email);
          if (parsed.phone) setApplicantPhone(parsed.phone);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Post Job Modal State
  const [showPostModal, setShowPostModal] = useState(false);

  const filteredJobs = useMemo(() => {
    return SAMPLE_JOBS.filter((job) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        job.titleAr.toLowerCase().includes(q) ||
        job.titleEn.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.city.toLowerCase().includes(q);

      const matchCity = selectedCity === "All" || job.city === selectedCity;
      const matchCategory = selectedCategory === "all" || job.category === selectedCategory;
      const matchType = selectedType === "all" || job.type === selectedType;

      return matchSearch && matchCity && matchCategory && matchType;
    });
  }, [searchQuery, selectedCity, selectedCategory, selectedType]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAppliedSuccess(true);
    }, 1000);
  };

  const handleQuickApplyWithCv = () => {
    if (!savedCv) return;
    setApplicantName(savedCv.fullName || "");
    setApplicantEmail(savedCv.email || "");
    setApplicantPhone(savedCv.phone || "");
    setApplicantNote(
      isAr
        ? `تقديم فوري بواسطة السيرة الذاتية ورسالة الدافع من منصة SGN (${savedCv.jobTitle} - ${savedCv.drivingLicense})`
        : `Directe sollicitatie via SGN CV & Motivatiebrief (${savedCv.jobTitle} - ${savedCv.drivingLicense})`
    );
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAppliedSuccess(true);
    }, 900);
  };

  const closeApplyModal = () => {
    setActiveJob(null);
    setAppliedSuccess(false);
  };

  const dir = isAr ? "rtl" : "ltr";

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
              <Briefcase className="w-4 h-4 text-[#c8a84e]" />
              <span>
                {isAr
                  ? "منصة التوظيف والتدريب المهني للجالية السورية"
                  : isNl
                  ? "Vacatures & Stages voor de Syrische Gemeenschap in NL"
                  : "Jobs & Internships Hub for Syrian Community in NL"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              {isAr ? "سوق العمل والفرص المهنية في هولندا" : isNl ? "Werk & Carrièremogelijkheden in Nederland" : "Work & Career Opportunities in the Netherlands"}
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl">
              {isAr
                ? "بوابة تربط الكفاءات وأصحاب المهن والشباب السوريين بأصحاب الشركات والمطاعم والمؤسسات الهولندية. قدم مباشرة، أو استخدم صانع السيرة الذاتية لإنشاء CV متوافق مع معايير هولندا."
                : isNl
                ? "Verbindt werkzoekenden en vakmensen met werkgevers in heel Nederland. Solliciteer direct of bouw een professioneel Nederlands CV."
                : "Connecting talent and professionals with leading employers across the Netherlands. Apply easily or craft your Dutch-standard CV."}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/${locale}/services/cv-builder`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c8a84e] hover:bg-[#b8973f] text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:scale-105 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{isAr ? "أنشئ سيرتك الذاتية (CV Maker)" : isNl ? "Maak Nederlands CV" : "Create Dutch CV"}</span>
              </Link>
              <button
                onClick={() => setShowPostModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-300" />
                <span>{isAr ? "أعلن عن شاغر وظيفي" : isNl ? "Vacature Plaatsen" : "Post a Vacancy"}</span>
              </button>
            </div>
          </div>

          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Saved CV Banner */}
        {savedCv && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {isAr ? `مرحباً ${savedCv.fullName}، ميزة التقديم الفوري بنقرة واحدة مفعلة!` : isNl ? `Welkom ${savedCv.fullName}, 1-klik solliciteren is actief!` : `Welcome ${savedCv.fullName}, 1-click apply is active!`}
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isAr 
                    ? `سيرتك الذاتية (${savedCv.jobTitle} - ${savedCv.drivingLicense}) جاهزة ومربوطة بحسابك.`
                    : `Uw CV (${savedCv.jobTitle}) is gekoppeld en klaar voor directe verzending.`}
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/services/cv-builder`}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
            >
              {isAr ? "تعديل السيرة الذاتية ←" : "CV bewerken →"}
            </Link>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isAr ? "right-3.5" : "left-3.5"}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن مسمى وظيفي، مهارة، شركة..." : isNl ? "Zoek op functietitel, vaardigheid..." : "Search by job title, skill..."}
                className={`w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isAr ? "pr-10 pl-3" : "pl-10 pr-3"
                }`}
              />
            </div>

            {/* City Dropdown (3 cols) */}
            <div className="md:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? (isAr ? "كل المدن الهولندية" : isNl ? "Alle Steden" : "All Cities") : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Dropdown (2 cols) */}
            <div className="md:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">{isAr ? "كل أنواع العقود" : isNl ? "Alle Contracten" : "All Contract Types"}</option>
                <option value="full-time">{isAr ? "دوام كامل (Full-time)" : "Full-time"}</option>
                <option value="part-time">{isAr ? "دوام جزئي (Part-time)" : "Part-time"}</option>
                <option value="stage">{isAr ? "تدريب مهني (Stage)" : "Stage / Internship"}</option>
                <option value="freelance">{isAr ? "عمل حر (ZZP)" : "Freelance (ZZP)"}</option>
              </select>
            </div>

            {/* Category Dropdown (2 cols) */}
            <div className="md:col-span-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="all">{isAr ? "كل التخصصات" : isNl ? "Alle Sectoren" : "All Sectors"}</option>
                <option value="tech">{isAr ? "تكنولوجيا وبرمجة" : isNl ? "IT & Tech" : "IT & Tech"}</option>
                <option value="hospitality">{isAr ? "مطاعم وضيافة" : isNl ? "Horeca" : "Hospitality"}</option>
                <option value="crafts">{isAr ? "حرف وصيانة" : isNl ? "Techniek & Bouw" : "Technical & Crafts"}</option>
                <option value="logistics">{isAr ? "نقل ولوجستيات" : isNl ? "Logistiek" : "Logistics"}</option>
                <option value="general">{isAr ? "إدارة وترجمة" : isNl ? "Administratie" : "Admin & Legal"}</option>
              </select>
            </div>
          </div>

          {/* Active Results Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>
              {isAr ? "عدد الوظائف المتاحة حالياً: " : isNl ? "Beschikbare vacatures: " : "Available vacancies: "}
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                {isAr ? formatLocalizedDigits(filteredJobs.length, "ar") : filteredJobs.length}
              </strong>
            </span>
            <span className="text-[11px] text-slate-400">
              {isAr ? "يتم تحديث الشواغر يومياً بالتعاون مع شبكة أصحاب العمل السوريين والهولنديين" : "Updated regularly with verified employers"}
            </span>
          </div>
        </div>

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const title = isAr ? job.titleAr : isNl ? job.titleNl : job.titleEn;
            const desc = isAr ? job.descriptionAr : isNl ? job.descriptionNl : job.descriptionEn;
            const salary = isAr ? job.salary : isNl ? job.salaryNl : job.salaryEn;

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                        {job.company}
                      </span>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {title}
                      </h2>
                    </div>

                    {job.featured && (
                      <span className="shrink-0 px-2 py-0.5 bg-[#c8a84e]/10 text-[#c8a84e] border border-[#c8a84e]/30 text-[10px] font-black rounded-md uppercase">
                        {isAr ? "مميزة" : "Featured"}
                      </span>
                    )}
                  </div>

                  {/* Location & Salary Badges */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{job.city}, {job.province}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <Euro className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{salary}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {desc}
                  </p>

                  {/* Languages required */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-400 font-bold">{isAr ? "اللغات المطلوبة:" : "Languages:"}</span>
                    {job.languages.map((l) => (
                      <span key={l} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                    {job.createdAt}
                  </span>

                  <button
                    onClick={() => setActiveJob(job)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white text-xs font-black shadow-sm transition-all hover:scale-105 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? "قدم الآن" : isNl ? "Solliciteer Nu" : "Apply Now"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Apply Modal */}
        {activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              dir={dir}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 relative"
            >
              <button
                onClick={closeApplyModal}
                className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              {!appliedSuccess ? (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {activeJob.company}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {isAr ? "التقديم على الشاغر:" : "Apply for:"} {isAr ? activeJob.titleAr : activeJob.titleEn}
                    </h3>
                  </div>

                  {/* 1-Click Apply with SGN CV */}
                  {savedCv && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {savedCv.photo ? (
                            <img src={savedCv.photo} alt={savedCv.fullName} className="w-9 h-9 rounded-xl object-cover border border-emerald-500 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 dark:text-white block truncate">
                              {savedCv.fullName}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block truncate">
                              {savedCv.jobTitle} • {savedCv.drivingLicense}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleQuickApplyWithCv}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md cursor-pointer transition-all shrink-0"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>{isAr ? "تقديم فوري بالـ CV" : isNl ? "Direct Solliciteren" : "1-Click Apply"}</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isAr 
                          ? "تم العثور على سيرتك الذاتية من SGN، اضغط على الزر أعلاه لإرسال التقديم بنقرة واحدة."
                          : isNl 
                          ? "Uw SGN CV is gereed. Klik hierboven om direct met 1 klik te solliciteren."
                          : "Your SGN CV is ready. Click above to apply instantly with 1 click."}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        {isAr ? "الاسم الكامل *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder={isAr ? "محمد السالم" : "Mohamed Al-Salem"}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                          {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                        </label>
                        <input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="example@domain.com"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                          {isAr ? "رقم الهاتف / واتساب *" : "Phone / WhatsApp *"}
                        </label>
                        <input
                          type="tel"
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+31 6 ..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                        {isAr ? "رسالة تعريفية قصيرة (اختياري)" : "Short introduction (optional)"}
                      </label>
                      <textarea
                        rows={3}
                        value={applicantNote}
                        onChange={(e) => setApplicantNote(e.target.value)}
                        placeholder={isAr ? "مرحبا، لدي خبرة سابقة وأرغب بالانضمام لفريقكم..." : "Hello, I am interested in this position..."}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* CV Builder Integration Notice */}
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-[11px] text-emerald-900 dark:text-emerald-200">
                          {isAr ? "يمكنك إرفاق الـ CV المنشأ من منصة SGN مباشرة" : "Use CV created with SGN CV Maker"}
                        </span>
                      </div>
                      <Link
                        href={`/${locale}/services/cv-builder`}
                        target="_blank"
                        className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 underline shrink-0"
                      >
                        {isAr ? "تحديث الـ CV" : "Edit CV"}
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeApplyModal}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isAr ? "إلغاء" : "Cancel"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? (isAr ? "جاري الإرسال..." : "Sending...") : (isAr ? "إرسال طلب التوظيف" : "Submit Application")}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isAr ? "تم إرسال طلب التوظيف بنجاح!" : "Application Submitted Successfully!"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAr
                        ? "تم إرسال بياناتك إلى جهة التوظيف مباشرة، وسيقوم مسؤول الموارد البشرية بالتواصل معك عبر البريد أو الهاتف."
                        : "Your application has been delivered to the employer. They will contact you shortly."}
                    </p>
                  </div>
                  <button
                    onClick={closeApplyModal}
                    className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                  >
                    {isAr ? "إغلاق" : "Close"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Post Job Community Modal */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              dir={dir}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#c8a84e]/10 text-[#c8a84e] flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {isAr ? "نشر فرصة عمل أو تدريب للجالية" : "Post a Job or Internship"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr
                  ? "هل لديك شركة، مطعم، أو مكتب في هولندا وتبحث عن كوادر متميزة؟ تواصل مع أمانة الجالية أو انشر شاغرك عبر لوحة التحكم للأعضاء والشركاء."
                  : "Are you an employer in the Netherlands looking to hire talented candidates from our community? Get in touch with SGN administration."}
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border text-xs text-slate-700 dark:text-slate-300 space-y-1 text-start">
                <p><strong>{isAr ? "البريد المعتمد:" : "Official Email:"}</strong> jobs@sy-nl.org</p>
                <p><strong>{isAr ? "واتساب الإدارة:" : "WhatsApp Admin:"}</strong> +31 6 84 60 34 06</p>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#1a5632] text-white font-bold text-xs"
              >
                {isAr ? "فهمت ذلك" : "Got it"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
