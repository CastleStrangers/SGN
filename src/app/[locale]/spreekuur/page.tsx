"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  Calendar, Clock, ShieldCheck, Scale, FileText, User, 
  MapPin, Video, Phone, CheckCircle2, ChevronRight, ArrowLeft, 
  ArrowRight, Search, Filter, Sparkles, Building2, ExternalLink, X
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface Specialist {
  id: string;
  name: string;
  titleAr: string;
  titleNl: string;
  category: "legal" | "tax" | "housing" | "education" | "translation" | "health";
  city: string;
  languages: string[];
  inPersonAvailable: boolean;
  onlineAvailable: boolean;
  avatar: string;
  availableDays: string[];
}

const SPECIALISTS: Specialist[] = [
  {
    id: "sp-1",
    name: "الأستاذة رابعة الزريقات",
    titleAr: "مسؤولة الشؤون القانونية ولم الشمل والطعون لدى الـ IND",
    titleNl: "Juridisch Adviseur IND & Gezinshereniging",
    category: "legal",
    city: "Utrecht",
    languages: ["العربية", "Nederlands", "English"],
    inPersonAvailable: true,
    onlineAvailable: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    availableDays: ["الإثنين", "الأربعاء", "السبت"],
  },
  {
    id: "sp-2",
    name: "أحمد النجار",
    titleAr: "مستشار ضريبي ومحاسب معتمد للضرائب والمساعدات (Toeslagen)",
    titleNl: "Belastingconsulent & Toeslagen Specialist",
    category: "tax",
    city: "Amsterdam",
    languages: ["العربية", "Nederlands"],
    inPersonAvailable: true,
    onlineAvailable: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    availableDays: ["الثلاثاء", "الخميس"],
  },
  {
    id: "sp-3",
    name: "د. بلال الرفاعي",
    titleAr: "طبيب ومستشار الصحة والدعم النفسي والاندماج الصحي",
    titleNl: "Arts & Gezondheidsconsulent GGD",
    category: "health",
    city: "Rotterdam",
    languages: ["العربية", "Nederlands", "English"],
    inPersonAvailable: false,
    onlineAvailable: true,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
    availableDays: ["الجمعة", "السبت"],
  },
  {
    id: "sp-4",
    name: "سناء الخالد",
    titleAr: "مترجمة محلفة ومستشارة معادلة الشهادات لدى Nuffic و DUO",
    titleNl: "Beëdigd Vertaler & Diplomawaardering Nuffic",
    category: "translation",
    city: "Den Haag",
    languages: ["العربية", "Nederlands"],
    inPersonAvailable: true,
    onlineAvailable: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    availableDays: ["الإثنين", "الخميس"],
  },
  {
    id: "sp-5",
    name: "م. محمد أكرم الجنيدي",
    titleAr: "مسؤول شؤون التعليم الجامعي والتدريب المهني MBO/HBO",
    titleNl: "Adviseur Hoger Onderwijs & Stages",
    category: "education",
    city: "Eindhoven",
    languages: ["العربية", "Nederlands", "English"],
    inPersonAvailable: true,
    onlineAvailable: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    availableDays: ["الأربعاء", "الجمعة"],
  },
];

export default function SpreekuurPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";
  const dir = isAr ? "rtl" : "ltr";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [consultationMode, setConsultationMode] = useState<"online" | "in-person">("online");
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-10");
  const [selectedTime, setSelectedTime] = useState<string>("14:00");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientQuestion, setClientQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingTicketId, setBookingTicketId] = useState("");

  const filteredSpecialists = SPECIALISTS.filter((sp) => {
    if (selectedCategory === "all") return true;
    return sp.category === selectedCategory;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const code = `SPK-${Math.floor(100000 + Math.random() * 900000)}`;
      setBookingTicketId(code);
      setBookingSuccess(true);
    }, 900);
  };

  const closeBookingModal = () => {
    setSelectedSpecialist(null);
    setBookingSuccess(false);
    setClientName("");
    setClientPhone("");
    setClientQuestion("");
  };

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الخدمات" : isNl ? "Terug naar Diensten" : "Back to Services"}</span>
          </Link>
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/20">
            {isAr ? "استشارات تطوعية مجانية وموثوقة" : isNl ? "Gratis & Betrouwbaar Spreekuur" : "Free Community Consultations"}
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <Scale className="w-3.5 h-3.5" />
            <span>{isAr ? "عيادة الاستشارات وحجز المواعيد (SGN Spreekuur)" : isNl ? "SGN Inloopspreekuur & Advies" : "SGN Consultation Clinic"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "احجز استشارتك مع نخبة المختصين من الجالية" : isNl ? "Plan uw consult met onze specialisten" : "Book a Consultation with Community Experts"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {isAr 
              ? "جلسات استشارية متخصصة ومجانية في شؤون الهجرة و IND، الضرائب والمساعدات، السكن، وتعديل الشهادات، حضورياً في مكاتب الجالية أو أونلاين عبر اتصال مرئي."
              : isNl 
              ? "Persoonlijk advies over IND procedures, belastingen, toeslagen, huisvesting en diplomawaardering. Fysiek op locatie of online via videoverbinding."
              : "Free expert consultations on IND immigration, taxes & toeslagen, housing, and degree equivalence. In-person at SGN offices or online video."}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: "all", ar: "كافة التخصصات", nl: "Alle disciplines" },
            { id: "legal", ar: "الشؤون القانونية و IND", nl: "Juridisch & IND" },
            { id: "tax", ar: "الضرائب والمساعدات (Toeslagen)", nl: "Belasting & Toeslagen" },
            { id: "translation", ar: "الترجمة وتعديل الشهادات", nl: "Vertaling & Nuffic" },
            { id: "health", ar: "الصحة والدعم النفسي", nl: "Gezondheid & Zorg" },
            { id: "education", ar: "التعليم والتدريب المهني", nl: "Onderwijs & MBO" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#1a5632] text-white border-[#1a5632] shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {isAr ? cat.ar : cat.nl}
            </button>
          ))}
        </div>

        {/* Specialists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSpecialists.map((sp) => (
            <div
              key={sp.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={sp.avatar}
                    alt={sp.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/30 shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {sp.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 line-clamp-1">
                      {isAr ? sp.titleAr : sp.titleNl}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {sp.city}
                      </span>
                      <span>•</span>
                      <span>{sp.languages.join("، ")}</span>
                    </div>
                  </div>
                </div>

                {/* Consultation types badges */}
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  {sp.inPersonAvailable && (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-emerald-600" />
                      {isAr ? "حضوري بمكتب الجالية" : "Fysiek op kantoor"}
                    </span>
                  )}
                  {sp.onlineAvailable && (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <Video className="w-3 h-3 text-emerald-600" />
                      {isAr ? "أونلاين (فيديو / هاتف)" : "Online / Video"}
                    </span>
                  )}
                </div>

                {/* Available days */}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? "أيام الاستشارات المتاحة:" : "Beschikbare dagen:"}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {sp.availableDays.join("، ")}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSpecialist(sp)}
                className="w-full py-3 rounded-2xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isAr ? "حجز موعد استشارة مجانية" : isNl ? "Gratis consult inplannen" : "Book Free Consultation"}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedSpecialist && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              dir={dir}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {!bookingSuccess ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedSpecialist.avatar}
                        alt={selectedSpecialist.name}
                        className="w-12 h-12 rounded-2xl object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          {isAr ? `حجز موعد مع ${selectedSpecialist.name}` : `Afspraak met ${selectedSpecialist.name}`}
                        </h3>
                        <p className="text-[11px] text-emerald-600 font-bold">
                          {isAr ? selectedSpecialist.titleAr : selectedSpecialist.titleNl}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeBookingModal}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Consultation Mode */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isAr ? "طريقة الجلسة الاستشارية:" : "Type consult:"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setConsultationMode("online")}
                        className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          consultationMode === "online"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>{isAr ? "عبر الفيديو (Google Meet)" : "Online videoverbinding"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsultationMode("in-person")}
                        disabled={!selectedSpecialist.inPersonAvailable}
                        className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          consultationMode === "in-person"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>{isAr ? `حضوري بمكتب ${selectedSpecialist.city}` : `Op kantoor (${selectedSpecialist.city})`}</span>
                      </button>
                    </div>
                  </div>

                  {/* Date and Time Slot Picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "تاريخ الموعد:" : "Datum:"}
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "الوقت:" : "Tijdstip:"}
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((t) => (
                          <option key={t} value={t}>{t} {isAr ? "مساءً / صباحاً" : "uur"}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Client Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "الاسم الكامل:" : "Volledige naam:"}
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder={isAr ? "أحمد المحمد" : "Ahmad Al-Mohammad"}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "رقم الهاتف / واتساب:" : "Telefoonnummer / WhatsApp:"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+31 6 12345678"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "موضوع الاستشارة أو السؤال الأساسي:" : "Korte omschrijving van uw vraag:"}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={clientQuestion}
                        onChange={(e) => setClientQuestion(e.target.value)}
                        placeholder={isAr ? "أريد الاستفسار عن خطاب وصلني من الـ IND بخصوص لم الشمل..." : "Mijn vraag betreft een brief van de IND over gezinshereniging..."}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeBookingModal}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                    >
                      {isAr ? "إلغاء" : "Annuleren"}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      {isSubmitting ? (isAr ? "جاري الحجز..." : "Bezig met plannen...") : (isAr ? "تأكيد حجز الموعد مجاناً" : "Afspraak definitief bevestigen")}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {isAr ? "تم تأكيد موعدك بنجاح!" : "Afspraak Succesvol Bevestigd!"}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {isAr 
                        ? `تم تسجيل حجزك مع ${selectedSpecialist.name} بتاريخ ${selectedDate} الساعة ${selectedTime}.`
                        : `Uw consult met ${selectedSpecialist.name} op ${selectedDate} om ${selectedTime} is vastgelegd.`}
                    </p>
                  </div>

                  {/* Ticket Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-start">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isAr ? "رقم الموعد المرجعي:" : "Referentienummer:"}</span>
                      <span className="font-mono font-black text-emerald-600">{bookingTicketId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{isAr ? "طريقة الجلسة:" : "Vorm:"}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {consultationMode === "online" ? (isAr ? "اتصال مرئي أونلاين" : "Online Video") : (isAr ? `حضورياً (${selectedSpecialist.city})` : `Kantoor ${selectedSpecialist.city}`)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {isAr 
                      ? "تم إرسال رسالة تأكيد إلى هاتفك مع رابط الحضور ومعلومات التواصل."
                      : "U ontvangt een bevestiging per sms met de link en locatiegegevens."}
                  </p>

                  <button
                    onClick={closeBookingModal}
                    className="px-6 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black cursor-pointer"
                  >
                    {isAr ? "تم، حسناً" : "Sluiten"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
