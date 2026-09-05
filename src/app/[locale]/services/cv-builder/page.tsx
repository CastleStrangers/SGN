"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  FileText, Sparkles, Download, Printer, Wand2, Plus, Trash2, 
  Briefcase, GraduationCap, Globe, Mail, Phone, MapPin, 
  CheckCircle2, User, ChevronRight, ArrowLeft, ArrowRight,
  Camera, Upload, X, Palette, Car, Calendar, Linkedin, Copy, Check
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

type TemplateType = "modern" | "classic" | "minimal";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface CVData {
  photo: string | null;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  dateOfBirth: string;
  nationality: string;
  drivingLicense: string;
  linkedIn: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
  languages: string;
  template: TemplateType;
  accentColor: string;
}

const ACCENT_COLORS = [
  { id: "emerald", label: "SGN Emerald", hex: "#1a5632", light: "#ecfdf5" },
  { id: "royal", label: "Dutch Royal Blue", hex: "#004C97", light: "#eff6ff" },
  { id: "slate", label: "Executive Charcoal", hex: "#1e293b", light: "#f8fafc" },
  { id: "gold", label: "Damascus Gold", hex: "#b8973f", light: "#fefce8" },
];

export default function CVBuilderPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"form" | "letter">("form");
  const [targetJob, setTargetJob] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const [cv, setCv] = useState<CVData>(() => {
    if (locale === "en" || locale === "nl") {
      return {
        photo: null,
        fullName: "Mohamed Ahmad",
        jobTitle: "Software & Web Developer",
        email: "m.ahmad@example.nl",
        phone: "+31 6 1234 5678",
        city: "Rotterdam, Netherlands",
        dateOfBirth: "15-08-1993",
        nationality: "Syrische (Verblijfsvergunning onbepaalde tijd)",
        drivingLicense: "Rijbewijs B",
        linkedIn: "linkedin.com/in/mohamed-ahmad",
        summary: "Gemotiveerde en resultaatgerichte softwareontwikkelaar met meer dan 5 jaar ervaring in moderne webapplicaties. Sterk in teamverband binnen een Nederlandse agile/scrum werkomgeving.",
        experience: [
          {
            title: "Frontend Developer",
            company: "Tech Solutions B.V. (Rotterdam)",
            period: "2023 - Heden",
            description: "Ontwikkeling van gebruiksvriendelijke en schaalbare dashboards met React, Next.js en TypeScript. Nauwe samenwerking met product owners en UI/UX designers.",
          },
          {
            title: "Web Developer",
            company: "Digital Horizon (Damascus)",
            period: "2019 - 2022",
            description: "Bouwen van bedrijfswebsites, RESTful API-koppelingen en database-architectuur. Prestatie- en laadtijdoptimalisatie.",
          },
        ],
        education: [
          {
            degree: "B.Sc. Informatica (Nuffic gewaardeerd op HBO/WO niveau)",
            school: "Damascus University",
            year: "2018",
          },
          {
            degree: "Nederlands Staatsexamen NT2 & Inburgering",
            school: "Albeda College Rotterdam",
            year: "2023",
          },
        ],
        skills: "React, Next.js, TypeScript, JavaScript, Tailwind CSS, Node.js, Git, Agile/Scrum",
        languages: locale === "nl" ? "Nederlands (B1/B2 professioneel), Engels (Vloeiend C1), Arabisch (Moedertaal)" : "Dutch (B1/B2 Professional), English (Fluent C1), Arabic (Native)",
        template: "modern",
        accentColor: "#1a5632",
      };
    }
    return {
      photo: null,
      fullName: "محمد أحمد عزيزة",
      jobTitle: "مطور برمجيات وواجهات أمامية (Frontend Developer)",
      email: "m.ahmad@example.nl",
      phone: "+31 6 1234 5678",
      city: "روتردام، هولندا",
      dateOfBirth: "١٥-٠٨-١٩٩٣",
      nationality: "سوري (إقامة هولندية نظامية)",
      drivingLicense: "رخصة قيادة هولندية (Rijbewijs B)",
      linkedIn: "linkedin.com/in/mohamed-ahmad",
      summary: "مهندس برمجيات سوري مقيم في هولندا، أمتلك خبرة تتجاوز ٥ سنوات في تطوير تطبيقات الويب الحديثة وحلول الأعمال الرقمية. متمكن من بيئة العمل الهولندية ومتحمس للمساهمة في مشاريع نوعية.",
      experience: [
        {
          title: "Frontend Developer",
          company: "Tech Solutions B.V. (Rotterdam)",
          period: "2023 - حتى الآن",
          description: "تطوير لوحات التحكم والواجهات التفاعلية باستخدام React و Next.js و TypeScript، والعمل بروح الفريق وفق منهجية Agile/Scrum.",
        },
        {
          title: "Web Developer",
          company: "Digital Horizon (Damascus)",
          period: "2019 - 2022",
          description: "تصميم وبناء المواقع والبوابات الإلكترونية، وربط الخدمات البرمجية عبر RESTful APIs وإدارة قواعد البيانات.",
        },
      ],
      education: [
        {
          degree: "إجازة في الهندسة المعلوماتية (معادلة من منظمة Nuffic الهولندية)",
          school: "جامعة دمشق",
          year: "2018",
        },
        {
          degree: "دبلوم اللغة الهولندية والاندماج (NT2 Staatsexamen)",
          school: "Albeda College Rotterdam",
          year: "2023",
        },
      ],
      skills: "React, Next.js, TypeScript, JavaScript, Tailwind CSS, Node.js, Git, Agile/Scrum",
      languages: "العربية (اللغة الأم)، الهولندية (B1/B2 مستوى متقدم)، الإنجليزية (طلاقة كاملة C1)",
      template: "modern",
      accentColor: "#1a5632",
    };
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("sgn_cv_data", JSON.stringify(cv));
      }
    } catch (e) {
      // ignore
    }
  }, [cv]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isAr ? "حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت." : "Bestand is te groot. Kies een foto kleiner dan 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCv((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCv((prev) => ({ ...prev, photo: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addExperience = () => {
    setCv({
      ...cv,
      experience: [
        ...cv.experience,
        {
          title: isAr ? "المسمى الوظيفي الجديد" : "Nieuwe Functie",
          company: isAr ? "اسم الشركة / المؤسسة" : "Bedrijfsnaam",
          period: "2022 - 2023",
          description: isAr ? "شرح موجز للمهام والمسؤوليات والإنجازات..." : "Korte omschrijving van taken en resultaten...",
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    setCv({
      ...cv,
      experience: cv.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setCv({
      ...cv,
      education: [
        ...cv.education,
        {
          degree: isAr ? "الدرجة العلمية / الشهادة" : "Opleiding / Diploma",
          school: isAr ? "المعهد / الجامعة" : "Onderwijsinstelling",
          year: "2021",
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    setCv({
      ...cv,
      education: cv.education.filter((_, i) => i !== index),
    });
  };

  const generateSollicitatiebrief = () => {
    setGeneratingLetter(true);
    setTimeout(() => {
      const job = targetJob.trim() || cv.jobTitle;
      const company = targetCompany.trim() || "het bedrijf";
      const dateStr = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      let letter = "";
      if (locale === "nl") {
        letter = `${cv.fullName}
${cv.city}
${cv.phone} | ${cv.email}

Aan: ${company}
T.a.v. De Afdeling Personeelszaken / Recruitment
Datum: ${dateStr}

Betreft: Sollicitatie voor de functie van ${job}

Geachte heer, mevrouw,

Met grote belangstelling las ik uw vacature voor de functie van ${job} bij ${company}. Gezien mijn achtergrond en passie voor dit vakgebied, ben ik ervan overtuigd dat ik een waardevolle bijdrage kan leveren aan uw team.

Gedurende mijn loopbaan heb ik ruime ervaring opgedaan met ${cv.skills.split(",").slice(0, 3).join(", ")}. Ik ben gewend om zelfstandig en accuraat te werken, maar bloei ook op in een dynamisch en multicultureel team. Daarnaast beheers ik de Nederlandse taal goed en ben ik leergierig om mij voortdurend verder te ontwikkelen binnen de Nederlandse werkcultuur.

Wat mij bijzonder aanspreekt in ${company} is uw professionele reputatie en innovatieve werkwijze. Ik kijk ernaar uit om mijn opgedane kennis en enthousiasme bij u in de praktijk te brengen.

In de bijlage vindt u mijn curriculum vitae. Graag licht ik mijn motivatie en geschiktheid toe in een persoonlijk gesprek.

Met vriendelijke groet,

${cv.fullName}`;
      } else if (locale === "en") {
        letter = `${cv.fullName}
${cv.city}
${cv.phone} | ${cv.email}

To: ${company}
Attn: HR / Hiring Team
Date: ${dateStr}

Subject: Application for the position of ${job}

Dear Hiring Manager,

I am writing to express my strong enthusiasm for the ${job} position at ${company}. With my background in ${cv.jobTitle} and proven experience in ${cv.skills.split(",").slice(0, 3).join(", ")}, I believe I would be an asset to your organization in the Netherlands.

In my previous roles, I have consistently demonstrated a solid work ethic, adaptability, and an ability to deliver measurable results. Furthermore, I have integrated into the Dutch professional environment and value open collaboration and continuous improvement.

I welcome the opportunity to discuss my qualifications in an interview. Thank you for your time and consideration.

Sincerely,

${cv.fullName}`;
      } else {
        letter = `${cv.fullName}
${cv.city}
${cv.phone} | ${cv.email}

إلى: إدارة التوظيف والموارد البشرية في شركة ${company}
التاريخ: ${dateStr}

الموضوع: التقدم لشغل وظيفة (${job})

تحية طيبة وبعد،

يسرني أن أتقدم بطلبي هذا لشغل وظيفة ${job} المعلنة لدى شركتكم الموقرة. إن خبرتي المهنية في مجال ${cv.jobTitle} وشغفي بتطبيق أفضل المعايير المهنية يجعلني متحمساً لتقديم إضافة حقيقية لفريق عملكم في هولندا.

خلال مسيرتي المهنية، اكتسبت مهارات عملية متقدمة في ${cv.skills.split(",").slice(0, 3).join("، ")}. كما أحرص دائماً على الاندماج الفعال في بيئة العمل الهولندية والالتزام بروح المبادرة والعمل الجماعي.

أرفق لكم طيه سيرتي الذاتية المفصلة، وأتطلع بشغف لإتاحة الفرصة لإجراء مقابلة شخصية لمناقشة مؤهلاتي وكيفية توظيفها في خدمة أهداف مؤسستكم.

وتفضلوا بقبول فائق الاحترام والتقدير،

${cv.fullName}`;
      }

      setGeneratedLetter(letter);
      setGeneratingLetter(false);
    }, 800);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      {/* Print-specific style */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-cv-document, .print-cv-document * {
            visibility: visible;
          }
          .print-cv-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Navigation & Top Actions */}
        <div className="flex items-center justify-between no-print">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الرئيسية" : isNl ? "Terug naar Home" : "Back to Home"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? "طباعة / تصدير PDF" : isNl ? "Print / Opslaan als PDF" : "Print / Export PDF"}</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a5632] via-[#144226] to-[#0d2d1a] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-500/20 no-print">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 border border-white/10">
              <Sparkles className="w-4 h-4 text-[#c8a84e]" />
              <span>
                {isAr
                  ? "صانع السيرة الذاتية ورسائل الدافع المتوافق مع سوق العمل الهولندي"
                  : isNl
                  ? "Professionele Nederlandse CV & Sollicitatiebrief Bouwer"
                  : "Dutch Standard CV & Cover Letter Generator"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {isAr ? "سيرتك الذاتية الاحترافية بمعايير الشركات الهولندية" : isNl ? "Uw Professionele CV Volgens de Nederlandse Normen" : "Your Professional Dutch Resume in Minutes"}
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {isAr
                ? "أضف صورتك الشخصية، اختر من بين أفضل موديلات الـ CV الهولندية المعتمدة، واحصل على رسالة دافع (Motivatiebrief) احترافية تفتح لك أبواب المقابلات الوظيفية."
                : isNl
                ? "Upload uw profielfoto, kies uit de beste moderne sjablonen en genereer direct een overtuigende sollicitatiebrief."
                : "Attach your professional portrait, pick top-tier executive Dutch templates, and generate customized cover letters."}
            </p>
          </div>

          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Navigation Tabs: CV Builder vs Motivation Letter */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 no-print">
          <button
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === "form"
                ? "bg-[#1a5632] text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isAr ? "بيانات وتصميم السيرة الذاتية (CV)" : isNl ? "CV Bewerken & Modellen" : "CV Details & Templates"}</span>
          </button>

          <button
            onClick={() => setActiveTab("letter")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === "letter"
                ? "bg-[#1a5632] text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            }`}
          >
            <Wand2 className="w-4 h-4 text-[#c8a84e]" />
            <span>{isAr ? "صانع رسالة الدافع (Motivatiebrief)" : isNl ? "Sollicitatiebrief Bouwer" : "Cover Letter Generator"}</span>
          </button>
        </div>

        {/* Main Grid: Form / Editor (5 cols) + Real-time Preview (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Column (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6 no-print">
            {activeTab === "form" ? (
              <div className="space-y-5 text-xs">
                {/* 1. Template & Color Selector */}
                <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider text-[11px]">
                    {isAr ? "اختر موديل السيرة الذاتية المفضل:" : isNl ? "Kies CV Model:" : "Choose CV Template:"}
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "modern", nameAr: "عصري هولندي (Modern)", nameNl: "Modern Tweeluik", nameEn: "Modern Executive" },
                      { id: "classic", nameAr: "كلاسيكي رسمي (Classic)", nameNl: "Klassiek Zakelijk", nameEn: "Classic Corporate" },
                      { id: "minimal", nameAr: "إبداعي موجز (Minimal)", nameNl: "Minimalistisch", nameEn: "Nordic Minimal" },
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setCv({ ...cv, template: tpl.id as TemplateType })}
                        className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                          cv.template === tpl.id
                            ? "bg-[#1a5632] text-white border-[#1a5632] shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {isAr ? tpl.nameAr : isNl ? tpl.nameNl : tpl.nameEn}
                      </button>
                    ))}
                  </div>

                  {/* Accent Color Picker */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">{isAr ? "لون الهوية:" : "Accent Color:"}</span>
                    <div className="flex items-center gap-2">
                      {ACCENT_COLORS.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCv({ ...cv, accentColor: c.hex })}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            cv.accentColor === c.hex ? "scale-125 border-slate-900 dark:border-white shadow-sm" : "border-transparent"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Photo Upload Section */}
                <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-200 block uppercase tracking-wider text-[11px]">
                    {isAr ? "الصورة الشخصية للـ CV (Profielfoto):" : isNl ? "Profielfoto:" : "Profile Photo:"}
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                      {cv.photo ? (
                        <img src={cv.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer text-[11px]"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>{cv.photo ? (isAr ? "تغيير الصورة" : "Foto Wijzigen") : (isAr ? "رفع صورة شخصية" : "Upload Foto")}</span>
                        </button>

                        {cv.photo && (
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-[11px] font-bold cursor-pointer"
                          >
                            {isAr ? "حذف" : "Verwijderen"}
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isAr ? "يفضل صورة واضحة بنصف علوي وخلفية محايدة وفق التقاليد الهولندية." : "Duidelijke pasfoto met neutrale achtergrond."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Personal Information */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "الاسم الكامل *" : isNl ? "Volledige Naam *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        value={cv.fullName}
                        onChange={(e) => setCv({ ...cv, fullName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "المسمى الوظيفي المستهدف *" : isNl ? "Functietitel *" : "Job Title *"}
                      </label>
                      <input
                        type="text"
                        value={cv.jobTitle}
                        onChange={(e) => setCv({ ...cv, jobTitle: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "البريد الإلكتروني *" : isNl ? "E-mail *" : "Email *"}
                      </label>
                      <input
                        type="email"
                        value={cv.email}
                        onChange={(e) => setCv({ ...cv, email: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "رقم الهاتف *" : isNl ? "Telefoonnummer *" : "Phone *"}
                      </label>
                      <input
                        type="tel"
                        value={cv.phone}
                        onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "المدينة والإقامة في هولندا" : isNl ? "Woonplaats" : "City & Province"}
                      </label>
                      <input
                        type="text"
                        value={cv.city}
                        onChange={(e) => setCv({ ...cv, city: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "رخصة القيادة (مهمة بهولندا)" : isNl ? "Rijbewijs" : "Driver License"}
                      </label>
                      <input
                        type="text"
                        value={cv.drivingLicense}
                        onChange={(e) => setCv({ ...cv, drivingLicense: e.target.value })}
                        placeholder="Rijbewijs B"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "تاريخ الميلاد (Geboortedatum)" : isNl ? "Geboortedatum" : "Date of Birth"}
                      </label>
                      <input
                        type="text"
                        value={cv.dateOfBirth}
                        onChange={(e) => setCv({ ...cv, dateOfBirth: e.target.value })}
                        placeholder="15-08-1992"
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {isAr ? "حساب لينكد إن (LinkedIn)" : "LinkedIn URL"}
                      </label>
                      <input
                        type="text"
                        value={cv.linkedIn}
                        onChange={(e) => setCv({ ...cv, linkedIn: e.target.value })}
                        placeholder="linkedin.com/in/..."
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? "الملخص المهني (Persoonlijk Profiel) *" : isNl ? "Persoonlijk Profiel *" : "Professional Summary *"}
                    </label>
                    <textarea
                      rows={3}
                      value={cv.summary}
                      onChange={(e) => setCv({ ...cv, summary: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* 4. Experience Items */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      {isAr ? "الخبرات المهنية (Werkervaring):" : isNl ? "Werkervaring:" : "Work Experience:"}
                    </span>
                    <button
                      type="button"
                      onClick={addExperience}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? "إضافة خبرة" : "Ervaring toevoegen"}</span>
                    </button>
                  </div>

                  {cv.experience.map((exp, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border space-y-2 relative">
                      {cv.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(i)}
                          className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => {
                            const newExp = [...cv.experience];
                            newExp[i].title = e.target.value;
                            setCv({ ...cv, experience: newExp });
                          }}
                          placeholder={isAr ? "المسمى الوظيفي" : "Functie"}
                          className="p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...cv.experience];
                            newExp[i].company = e.target.value;
                            setCv({ ...cv, experience: newExp });
                          }}
                          placeholder={isAr ? "الشركة والمدينة" : "Bedrijf & Plaats"}
                          className="p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={exp.period}
                        onChange={(e) => {
                          const newExp = [...cv.experience];
                          newExp[i].period = e.target.value;
                          setCv({ ...cv, experience: newExp });
                        }}
                        placeholder="2022 - 2024"
                        className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white font-mono"
                      />
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...cv.experience];
                          newExp[i].description = e.target.value;
                          setCv({ ...cv, experience: newExp });
                        }}
                        placeholder={isAr ? "المهام والنتائج..." : "Werkzaamheden..."}
                        className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* 5. Education Items */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      {isAr ? "التعليم والشهادات (Opleidingen):" : isNl ? "Opleidingen:" : "Education:"}
                    </span>
                    <button
                      type="button"
                      onClick={addEducation}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? "إضافة مؤهل" : "Opleiding toevoegen"}</span>
                    </button>
                  </div>

                  {cv.education.map((edu, i) => (
                    <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border space-y-2 relative">
                      {cv.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(i)}
                          className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...cv.education];
                          newEdu[i].degree = e.target.value;
                          setCv({ ...cv, education: newEdu });
                        }}
                        placeholder={isAr ? "الشهادة والتخصص (معادلة Nuffic إن وجدت)" : "Diploma / Opleiding"}
                        className="w-full p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => {
                            const newEdu = [...cv.education];
                            newEdu[i].school = e.target.value;
                            setCv({ ...cv, education: newEdu });
                          }}
                          placeholder={isAr ? "الجامعة / الكلية" : "School / Universiteit"}
                          className="p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const newEdu = [...cv.education];
                            newEdu[i].year = e.target.value;
                            setCv({ ...cv, education: newEdu });
                          }}
                          placeholder="2018"
                          className="p-2 bg-white dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 6. Skills & Languages */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? "المهارات (Vaardigheden)" : isNl ? "Vaardigheden" : "Skills"}
                    </label>
                    <input
                      type="text"
                      value={cv.skills}
                      onChange={(e) => setCv({ ...cv, skills: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? "اللغات ومستوى الاندماج (Talen)" : isNl ? "Talenkennis" : "Languages"}
                    </label>
                    <input
                      type="text"
                      value={cv.languages}
                      onChange={(e) => setCv({ ...cv, languages: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Motivation Letter Generator Form */
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {isAr ? "توليد رسالة دافع احترافية (Motivatiebrief)" : isNl ? "Sollicitatiebrief Opstellen" : "Cover Letter Generator"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isAr
                      ? "صياغة تلقائية لرسالة رسمية بالهولندية موجهة لمسؤول التوظيف متوافقة مع متطلبات الوظيفة."
                      : "Genereert automatisch een overtuigende brief in correct zakelijk Nederlands."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? "المسمى الوظيفي المطلوب *" : "Target Position *"}
                    </label>
                    <input
                      type="text"
                      value={targetJob}
                      onChange={(e) => setTargetJob(e.target.value)}
                      placeholder={cv.jobTitle}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {isAr ? "اسم الشركة أو المؤسسة الهولندية *" : "Company Name *"}
                    </label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="bijv. ASML, Gemeente Amsterdam, KPN..."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={generateSollicitatiebrief}
                    disabled={generatingLetter}
                    className="w-full py-3 bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Wand2 className="w-4 h-4 text-[#c8a84e]" />
                    <span>{generatingLetter ? (isAr ? "جاري صياغة الرسالة..." : "Bezig met genereren...") : (isAr ? "توليد الرسالة بالذكاء الاصطناعي" : "Genereer Brief")}</span>
                  </button>
                </div>

                {generatedLetter && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {isAr ? "الرسالة الجاهزة:" : "Gegenereerde brief:"}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyLetter}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {copiedLetter ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLetter ? (isAr ? "تم النسخ!" : "Gekopieerd!") : (isAr ? "نسخ النص" : "Kopiëren")}</span>
                      </button>
                    </div>

                    <textarea
                      rows={14}
                      value={generatedLetter}
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                      className="w-full p-3 font-mono text-[11px] bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-slate-200 leading-relaxed"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Rendered CV Document (7 cols) */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xl print-cv-document space-y-6">
            {/* TEMPLATE 1: Modern Executive (Two Column Layout) */}
            {cv.template === "modern" && (
              <div className="grid grid-cols-12 gap-6 min-h-[750px]">
                {/* Left Column Sidebar (4 cols) */}
                <div 
                  className="col-span-4 p-5 rounded-2xl text-white flex flex-col justify-between space-y-6"
                  style={{ backgroundColor: cv.accentColor }}
                >
                  <div className="space-y-5">
                    {/* Portrait Photo */}
                    {cv.photo && (
                      <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
                        <img src={cv.photo} alt={cv.fullName} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Contact Details */}
                    <div className="space-y-2 text-[10px] text-white/90" dir="ltr">
                      <p className="flex items-center gap-2 truncate"><Mail className="w-3 h-3 text-[#c8a84e] shrink-0" /> {cv.email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#c8a84e] shrink-0" /> {cv.phone}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#c8a84e] shrink-0" /> {cv.city}</p>
                      {cv.dateOfBirth && <p className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#c8a84e] shrink-0" /> {cv.dateOfBirth}</p>}
                      {cv.drivingLicense && <p className="flex items-center gap-2"><Car className="w-3 h-3 text-[#c8a84e] shrink-0" /> {cv.drivingLicense}</p>}
                    </div>

                    {/* Languages */}
                    <div className="space-y-1.5 pt-3 border-t border-white/20">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[#c8a84e]">
                        {isAr ? "اللغات | Talen" : "Talen"}
                      </h4>
                      <p className="text-[10px] leading-relaxed text-white/90">{cv.languages}</p>
                    </div>

                    {/* Skills */}
                    <div className="space-y-1.5 pt-3 border-t border-white/20">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-[#c8a84e]">
                        {isAr ? "المهارات | Vaardigheden" : "Vaardigheden"}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {cv.skills.split(",").map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] font-semibold text-white">
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-[9px] text-white/60 pt-4 border-t border-white/10 font-mono">
                    SGN Verified CV Pass
                  </div>
                </div>

                {/* Right Column Main Body (8 cols) */}
                <div className="col-span-8 space-y-6">
                  {/* Name & Title Header */}
                  <div className="pb-4 border-b-2" style={{ borderColor: cv.accentColor }}>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{cv.fullName}</h2>
                    <p className="text-sm font-bold mt-1" style={{ color: cv.accentColor }}>{cv.jobTitle}</p>
                  </div>

                  {/* Profile Summary */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cv.accentColor }} />
                      <span>{isAr ? "الملخص المهني (Persoonlijk Profiel)" : "Persoonlijk Profiel"}</span>
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">{cv.summary}</p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cv.accentColor }} />
                      <span>{isAr ? "الخبرات العملية (Werkervaring)" : "Werkervaring"}</span>
                    </h3>
                    <div className="space-y-3">
                      {cv.experience.map((exp, i) => (
                        <div key={i} className="space-y-1 relative pl-3 rtl:pl-0 rtl:pr-3 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-200">
                          <div className="flex justify-between items-start text-xs font-bold text-slate-900">
                            <span>{exp.title} – <strong className="font-semibold text-slate-600">{exp.company}</strong></span>
                            <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{exp.period}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cv.accentColor }} />
                      <span>{isAr ? "التعليم والمؤهلات (Opleidingen)" : "Opleidingen"}</span>
                    </h3>
                    <div className="space-y-2.5">
                      {cv.education.map((edu, i) => (
                        <div key={i} className="text-xs">
                          <div className="flex justify-between items-center font-bold text-slate-900">
                            <span>{edu.degree}</span>
                            <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{edu.year}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{edu.school}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 2: Classic Corporate (Traditional Dutch Corporate Style) */}
            {cv.template === "classic" && (
              <div className="space-y-6 min-h-[750px]">
                {/* Header with Photo & Details */}
                <div className="flex items-start justify-between gap-6 pb-5 border-b-2" style={{ borderColor: cv.accentColor }}>
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{cv.fullName}</h2>
                    <p className="text-sm font-bold text-slate-600">{cv.jobTitle}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1" dir="ltr">
                      <span>✉ {cv.email}</span>
                      <span>☎ {cv.phone}</span>
                      <span>📍 {cv.city}</span>
                      {cv.drivingLicense && <span>🚗 {cv.drivingLicense}</span>}
                    </div>
                  </div>

                  {cv.photo && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-300 shadow-sm shrink-0">
                      <img src={cv.photo} alt={cv.fullName} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-1 border-b" style={{ color: cv.accentColor }}>
                    {isAr ? "الملخص المهني | Persoonlijk Profiel" : "Persoonlijk Profiel"}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{cv.summary}</p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-1 border-b" style={{ color: cv.accentColor }}>
                    {isAr ? "الخبرات العملية | Werkervaring" : "Werkervaring"}
                  </h3>
                  {cv.experience.map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                        <span>{exp.title} – {exp.company}</span>
                        <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{exp.period}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-1 border-b" style={{ color: cv.accentColor }}>
                    {isAr ? "التعليم والمؤهلات | Opleidingen" : "Opleidingen"}
                  </h3>
                  {cv.education.map((edu, i) => (
                    <div key={i} className="flex justify-between text-xs font-bold text-slate-900">
                      <div>
                        <span>{edu.degree}</span>
                        <p className="text-[11px] text-slate-500 font-medium">{edu.school}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{edu.year}</span>
                    </div>
                  ))}
                </div>

                {/* Skills & Languages */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: cv.accentColor }}>
                      {isAr ? "المهارات | Vaardigheden" : "Vaardigheden"}
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{cv.skills}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: cv.accentColor }}>
                      {isAr ? "اللغات | Talen" : "Talen"}
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{cv.languages}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATE 3: Minimal Nordic (Clean Modern Startup Look) */}
            {cv.template === "minimal" && (
              <div className="space-y-6 min-h-[750px]">
                {/* Minimal Header */}
                <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
                  {cv.photo && (
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                      <img src={cv.photo} alt={cv.fullName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{cv.fullName}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{cv.jobTitle}</p>
                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 pt-1" dir="ltr">
                      <span>{cv.email}</span>
                      <span>•</span>
                      <span>{cv.phone}</span>
                      <span>•</span>
                      <span>{cv.city}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1">
                  <p className="text-xs text-slate-700 leading-relaxed font-serif italic">{cv.summary}</p>
                </div>

                {/* Experience */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {isAr ? "الخبرات العملية" : "Werkervaring"}
                  </h3>
                  <div className="space-y-4">
                    {cv.experience.map((exp, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                          <span>{exp.title} <span className="text-slate-400 font-normal">at</span> {exp.company}</span>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{exp.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-3">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {isAr ? "التعليم والتأهيل" : "Opleidingen"}
                  </h3>
                  <div className="space-y-2">
                    {cv.education.map((edu, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{edu.degree}</span>
                          <p className="text-[11px] text-slate-400">{edu.school}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                    {isAr ? "المهارات واللغات" : "Vaardigheden & Talen"}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cv.skills.split(",").map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-700">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">{cv.languages}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
