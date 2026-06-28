"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText, BookOpen, Shield, Scale, Users, Download, Eye } from "lucide-react";

interface Regulation {
  id: string;
  title: string;
  description: string;
  content: string;
  pdfPath: string | null;
  pdfSize: number | null;
  version: number;
}

export default function RegulationsPage() {
  const t = useTranslations("regulations");
  const [data, setData] = useState<Regulation | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    fetch("/api/regulations")
      .then((r) => r.json())
      .then((d) => { if (d.id) setData(d); })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")}</h1>

        {data?.description && (
          <div className="bg-[#f0f7f2] dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 mb-10 flex items-start gap-4">
            <FileText className="w-6 h-6 text-[#1a5632] dark:text-emerald-400 flex-shrink-0 mt-1" />
            <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">{data.description}</p>
          </div>
        )}

        <p className="text-gray-600 leading-relaxed mb-8">{t("body")}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: BookOpen, title: t("identity"), desc: t("identityDesc") },
            { icon: Shield, title: t("governance"), desc: t("governanceDesc") },
            { icon: Scale, title: t("rights"), desc: t("rightsDesc") },
            { icon: Users, title: t("membership"), desc: t("membershipDesc") },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 dark:bg-[#0c1524] p-6 rounded-xl border border-gray-100 dark:border-gray-800/30">
              <item.icon className="w-6 h-6 text-[#1a5632] dark:text-[#c8a84e] mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#1a5632] text-white p-8 rounded-2xl text-center">
          <FileText className="w-10 h-10 text-[#c8a84e] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{t("downloadTitle")}</h2>
          <p className="text-white/80 mb-6 leading-relaxed">{t("downloadDesc")}</p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={data?.pdfPath || "/pdfs/internal-regulations-syrian-community-netherlands.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c8a84e] text-[#1a5632] font-bold px-6 py-3 rounded-xl hover:bg-[#b8972e] transition-colors"
            >
              <Eye className="w-5 h-5" />
              عرض الملف
            </a>

            <a
              href={data?.pdfPath || "/pdfs/internal-regulations-syrian-community-netherlands.pdf"}
              download
              className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <Download className="w-5 h-5" />
              تحميل PDF {data?.pdfSize ? `(${Math.round(data.pdfSize / 1024)} ك.ب)` : ""}
            </a>
          </div>
        </div>

        {data?.pdfPath && (
          <div className="mt-8">
            <button
              onClick={() => setShowPdf(!showPdf)}
              className="flex items-center gap-2 text-[#1a5632] font-bold mb-4"
            >
              <FileText className="w-5 h-5" />
              {showPdf ? "إخفاء المعاينة" : "معاينة PDF"}
            </button>
            {showPdf && (
              <iframe
                src={data.pdfPath}
                className="w-full h-[600px] rounded-xl border border-gray-200"
                title="النظام الداخلي"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
