"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText, BookOpen, Shield, Scale, Users, Download, Eye, Loader2 } from "lucide-react";

interface Section {
  title: string;
  body: string;
}

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
  const [sections, setSections] = useState<Section[]>([]);
  const [showPdf, setShowPdf] = useState(false);

  useEffect(() => {
    fetch("/api/regulations")
      .then((r) => r.json())
      .then((d) => {
        if (d.id) {
          setData(d);
          setSections(JSON.parse(d.content || "[]"));
        }
      })
      .catch(console.error);
  }, []);

  const sectionIcons = [BookOpen, Shield, Scale, Users];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")}</h1>

        {data?.description && (
          <div className="bg-[#f0f7f2] border border-emerald-200 rounded-2xl p-6 mb-10 flex items-start gap-4">
            <FileText className="w-6 h-6 text-[#1a5632] flex-shrink-0 mt-1" />
            <p className="text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        )}

        {sections.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {sections.map((sec, i) => {
              const Icon = sectionIcons[i % sectionIcons.length];
              return (
                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <Icon className="w-6 h-6 text-[#1a5632] mb-3" />
                  <h3 className="font-bold text-gray-900 mb-1">{sec.title}</h3>
                  <p className="text-sm text-gray-600">{sec.body}</p>
                </div>
              );
            })}
          </div>
        )}

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
