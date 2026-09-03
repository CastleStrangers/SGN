"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  FileText, Sparkles, Download, Printer, Wand2, Plus, Trash2, 
  Briefcase, GraduationCap, Globe, Mail, Phone, MapPin, 
  CheckCircle2, User, ChevronRight, ArrowLeft, ArrowRight
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  experience: { title: string; company: string; period: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: string;
  languages: string;
}

export default function CVBuilderPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [activeTab, setActiveTab] = useState<"form" | "letter">("form");
  const [targetJob, setTargetJob] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [generatingLetter, setGeneratingLetter] = useState(false);

  const [cv, setCv] = useState<CVData>(() => {
    if (locale === "en" || locale === "nl") {
      return {
        fullName: "Mohamed Ahmad",
        jobTitle: "Software & Web Developer",
        email: "m.ahmad@example.nl",
        phone: "+31 6 1234 5678",
        city: "Utrecht, Netherlands",
        summary: "Software engineer living in the Netherlands with 5+ years of experience in modern web applications.",
        experience: [
          {
            title: "Frontend Developer",
            company: "Tech Solutions B.V. (Amsterdam)",
            period: "2023 - Present",
            description: "Developing responsive UI applications using React, Next.js and TypeScript.",
          },
          {
            title: "Web Developer",
            company: "Digital Horizon (Damascus)",
            period: "2019 - 2022",
            description: "Building scalable company websites and RESTful APIs.",
          },
        ],
        education: [
          {
            degree: "B.Sc. Computer Engineering (Nuffic Evaluated)",
            school: "Damascus University",
            year: "2018",
          },
        ],
        skills: "React, Next.js, TypeScript, Tailwind CSS, Git, Node.js",
        languages: locale === "nl" ? "Nederlands (B1), Engels (Vloeiend), Arabisch (Moedertaal)" : "Dutch (B1), English (Fluent), Arabic (Native)",
      };
    }
    return {
      fullName: "محمد أحمد",
      jobTitle: "مطور برمجيات وواجهات أمامية",
      email: "m.ahmad@example.nl",
      phone: "+31 6 1234 5678",
      city: "أوتريخت، هولندا",
      summary: "مهندس برمجيات سوري مقيم في هولندا، أمتلك خبرة تتجاوز ٥ سنوات في تطوير تطبيقات الويب الحديثة، شغوف بالعمل ضمن بيئة عمل هولندية متعددة الثقافات.",
      experience: [
        {
          title: "Frontend Developer",
          company: "Tech Solutions B.V. (Amsterdam)",
          period: "2023 - Heden",
          description: "تطوير واجهات المستخدم باستخدام React و Next.js و TypeScript، والعمل وفق منهجية Agile/Scrum.",
        },
        {
          title: "Web Developer",
          company: "Digital Horizon (Damascus)",
          period: "2019 - 2022",
          description: "بناء مواقع الشركات وتكامل واجهات البرمجة RESTful APIs وقواعد البيانات.",
        },
      ],
      education: [
        {
          degree: "Bachelor of Computer Science (معادلة من Nuffic)",
          school: "جامعة دمشق",
          year: "2018",
        },
      ],
      skills: "React, Next.js, TypeScript, Tailwind CSS, Git, Node.js, Agile/Scrum",
      languages: "العربية (اللغة الأم)، الهولندية (B1 Inburgering)، الإنجليزية (ممتاز C1)",
    };
  });

  const fillSample = () => {
    if (isAr) {
      setCv({
        fullName: "محمد أحمد",
        jobTitle: "مطور برمجيات وواجهات أمامية",
        email: "m.ahmad@example.nl",
        phone: "+31 6 1234 5678",
        city: "Utrecht, Nederland",
        summary: "مهندس برمجيات سوري مقيم في هولندا، أمتلك خبرة تتجاوز ٥ سنوات في تطوير تطبيقات الويب الحديثة، شغوف بالعمل ضمن بيئة عمل هولندية متعددة الثقافات.",
        experience: [
          {
            title: "Frontend Developer",
            company: "Tech Solutions B.V. (Amsterdam)",
            period: "2023 - Heden",
            description: "تطوير واجهات المستخدم باستخدام React و Next.js و TypeScript.",
          },
        ],
        education: [
          {
            degree: "Bachelor of Computer Science (معادلة من Nuffic)",
            school: "جامعة دمشق",
            year: "2018",
          },
        ],
        skills: "React, Next.js, TypeScript, Tailwind CSS, Git, Node.js",
        languages: "العربية (اللغة الأم)، الهولندية (B1)، الإنجليزية (C1)",
      });
    } else {
      setCv({
        fullName: "Mohamed Ahmad",
        jobTitle: "Frontend Web Developer",
        email: "m.ahmad@example.nl",
        phone: "+31 6 1234 5678",
        city: "Utrecht, Nederland",
        summary: "Enthusiastic software engineer living in the Netherlands with 5+ years of experience in modern web development.",
        experience: [
          {
            title: "Frontend Developer",
            company: "Tech Solutions B.V. (Amsterdam)",
            period: "2023 - Present",
            description: "Developing responsive UI applications using React, Next.js and TypeScript.",
          },
        ],
        education: [
          {
            degree: "B.Sc. Computer Engineering (Nuffic Evaluated)",
            school: "Damascus University",
            year: "2018",
          },
        ],
        skills: "React, Next.js, TypeScript, Tailwind CSS, Git, Node.js",
        languages: "Dutch (B1), English (Fluent), Arabic (Native)",
      });
    }
  };

  const generateSollicitatiebrief = () => {
    setGeneratingLetter(true);
    setTimeout(() => {
      if (isAr) {
        setGeneratedLetter(`Geachte heer/mevrouw,

Naar aanleiding van uw openstaande vacature voor "${targetJob || cv.jobTitle}" schrijf ik u met grote belangstelling deze sollicitatiebrief.

Mijn naam is ${cv.fullName}, en ik woon in ${cv.city}. Met mijn achtergrond als ${cv.jobTitle} en meer dan 5 jaar ervaring in het ontwikkelen van betrouwbare oplossingen, ben ik ervan overtuigd dat ik een waardevolle bijdrage kan leveren aan uw team.

Gedurende mijn loopbaan heb ik gewerkt met technologieën zoals ${cv.skills}. Daarnaast ben ik proactief, leergierig en spreek ik Nederlands (B1) en vloeiend Engels.

Graag licht ik mijn motivatie en ervaring toe in een persoonlijk gesprek. In de bijlage vindt u mijn curriculum vitae.

Met vriendelijke groet,

${cv.fullName}
${cv.phone} | ${cv.email}`);
      } else {
        setGeneratedLetter(`Geachte heer/mevrouw,

Hierbij solliciteer ik met veel enthousiasme naar de functie van "${targetJob || cv.jobTitle}". 

Als ervaren ${cv.jobTitle} met diepgaande kennis van ${cv.skills}, wil ik mij graag inzetten voor uw organisatie in Nederland. Ik ben communicatief sterk, gewend om in teamverband te werken en beheers het Nederlands en Engels.

Graag licht ik mijn motivatie toe in een persoonlijk gesprek.

Met vriendelijke groet,

${cv.fullName}`);
      }
      setGeneratingLetter(false);
    }, 1200);
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Navigation */}
        <div className="no-print">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الخدمات" : isNl ? "Terug naar Diensten" : "Back to Services"}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 no-print">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAr ? "صانع السيرة الذاتية ورسائل الدافع للشركات الهولندية" : isNl ? "Nederlands CV & Sollicitatiebrief Maker" : "Dutch CV & Cover Letter Generator"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "اصنع سيرتك الذاتية الهولندية الاحترافية" : isNl ? "Maak een professioneel Nederlands CV" : "Create a Professional Dutch Standard CV"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm max-w-2xl mx-auto">
            {isAr
              ? "صمم سيرة ذاتية مطابقة لمعايير الشركات الهولندية وأرفق معها رسالة تقديم (Sollicitatiebrief) مصاغة بالهولندية الفصحى للتقديم على الوظائف بسهولة."
              : isNl
              ? "Maak direct een representatief CV volgens de Nederlandse standaard inclusief een krachtige sollicitatiebrief."
              : "Generate an ATS-friendly Dutch standard CV and a tailored cover letter (Sollicitatiebrief) ready for job applications."}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={fillSample}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {isAr ? "⚡ ملء نموذج تجريبي سريع" : isNl ? "⚡ Vul voorbeeld in" : "⚡ Fill Sample Data"}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 px-4 py-1.5 rounded-xl hover:bg-black transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAr ? "طباعة / حفظ PDF" : isNl ? "Print / Opslaan als PDF" : "Print / Save PDF"}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Col Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 no-print">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("form")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === "form" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {isAr ? "بيانات السيرة الذاتية (CV)" : isNl ? "CV Gegevens" : "CV Details"}
                </button>
                <button
                  onClick={() => setActiveTab("letter")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === "letter" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {isAr ? "رسالة التقديم (Brief)" : isNl ? "Sollicitatiebrief" : "Cover Letter"}
                </button>
              </div>
            </div>

            {activeTab === "form" ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "الاسم الكامل" : isNl ? "Volledige Naam" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    value={cv.fullName}
                    onChange={(e) => setCv({ ...cv, fullName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "المسمى الوظيفي / التخصص" : isNl ? "Functietitel" : "Job Title"}
                  </label>
                  <input
                    type="text"
                    value={cv.jobTitle}
                    onChange={(e) => setCv({ ...cv, jobTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      {isAr ? "البريد الإلكتروني" : isNl ? "E-mail" : "Email"}
                    </label>
                    <input
                      type="email"
                      value={cv.email}
                      onChange={(e) => setCv({ ...cv, email: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                      {isAr ? "رقم الهاتف" : isNl ? "Telefoon" : "Phone"}
                    </label>
                    <input
                      type="text"
                      value={cv.phone}
                      onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "المدينة والإقامة في هولندا" : isNl ? "Woonplaats" : "City in Netherlands"}
                  </label>
                  <input
                    type="text"
                    value={cv.city}
                    onChange={(e) => setCv({ ...cv, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "الملخص المهني (Profiel)" : isNl ? "Persoonlijk Profiel" : "Professional Summary"}
                  </label>
                  <textarea
                    rows={3}
                    value={cv.summary}
                    onChange={(e) => setCv({ ...cv, summary: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "المهارات التقنية والعملية" : isNl ? "Vaardigheden" : "Skills"}
                  </label>
                  <input
                    type="text"
                    value={cv.skills}
                    onChange={(e) => setCv({ ...cv, skills: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "اللغات ومستوى الاندماج" : isNl ? "Talen" : "Languages"}
                  </label>
                  <input
                    type="text"
                    value={cv.languages}
                    onChange={(e) => setCv({ ...cv, languages: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                    {isAr ? "اسم الوظيفة المراد التقديم عليها" : isNl ? "Gewenste functie" : "Target Job Title"}
                  </label>
                  <input
                    type="text"
                    placeholder="bijv. Junior Developer, Administratief Medewerker..."
                    value={targetJob}
                    onChange={(e) => setTargetJob(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={generateSollicitatiebrief}
                  disabled={generatingLetter}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>
                    {generatingLetter 
                      ? (isAr ? "جاري صياغة الرسالة بالهولندية..." : "Bezig met opstellen...") 
                      : (isAr ? "صياغة رسالة الدافع بالذكاء الاصطناعي" : "Genereer Sollicitatiebrief")}
                  </span>
                </button>

                {generatedLetter && (
                  <div className="mt-4 space-y-2">
                    <label className="font-bold text-slate-700 dark:text-slate-200 block">
                      {isAr ? "الرسالة الجاهزة (يمكنك نسخها وتعديلها):" : "Uw Sollicitatiebrief:"}
                    </label>
                    <textarea
                      rows={12}
                      value={generatedLetter}
                      onChange={(e) => setGeneratedLetter(e.target.value)}
                      className="w-full p-3 font-mono text-[11px] bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-800 dark:text-slate-200"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Preview / Printable CV (7 cols) */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-8 border border-slate-200 shadow-xl print-cv-document space-y-6">
            {/* Header of CV */}
            <div className="border-b-2 border-blue-600 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{cv.fullName}</h2>
                <p className="text-sm font-bold text-blue-600 mt-0.5">{cv.jobTitle}</p>
              </div>

              <div className="text-right text-[11px] text-slate-500 space-y-0.5" dir="ltr">
                <p className="flex items-center gap-1.5 justify-end"><Mail className="w-3 h-3 text-blue-600" /> {cv.email}</p>
                <p className="flex items-center gap-1.5 justify-end"><Phone className="w-3 h-3 text-blue-600" /> {cv.phone}</p>
                <p className="flex items-center gap-1.5 justify-end"><MapPin className="w-3 h-3 text-blue-600" /> {cv.city}</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b pb-1">
                {isAr ? "الملخص المهني | Persoonlijk Profiel" : "Persoonlijk Profiel"}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{cv.summary}</p>
            </div>

            {/* Work Experience */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b pb-1">
                {isAr ? "الخبرات العملية | Werkervaring" : "Werkervaring"}
              </h3>
              {cv.experience.map((exp, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span>{exp.title} – <span className="text-slate-600 font-medium">{exp.company}</span></span>
                    <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b pb-1">
                {isAr ? "التعليم والمؤهلات | Opleiding" : "Opleiding"}
              </h3>
              {cv.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>{edu.degree} – <span className="text-slate-600 font-medium">{edu.school}</span></span>
                  <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{edu.year}</span>
                </div>
              ))}
            </div>

            {/* Skills & Languages */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b pb-1">
                  {isAr ? "المهارات | Vaardigheden" : "Vaardigheden"}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{cv.skills}</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 border-b pb-1">
                  {isAr ? "اللغات | Talenkennis" : "Talenkennis"}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">{cv.languages}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          header, nav, footer, [class*="TopBar"], [class*="SiteHeader"] {
            display: none !important;
          }
          .print-cv-document {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
