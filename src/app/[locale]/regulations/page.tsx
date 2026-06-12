"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileText, BookOpen, Shield, Scale, Users } from "lucide-react";

export default function RegulationsPage() {
  const t = useTranslations("regulations");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")}</h1>

        <div className="bg-[#f0f7f2] border border-emerald-200 rounded-2xl p-6 mb-10 flex items-start gap-4">
          <FileText className="w-6 h-6 text-[#1a5632] flex-shrink-0 mt-1" />
          <p className="text-gray-700 leading-relaxed">{t("description")}</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">{t("body")}</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: BookOpen, title: t("identity"), desc: t("identityDesc") },
              { icon: Shield, title: t("governance"), desc: t("governanceDesc") },
              { icon: Scale, title: t("rights"), desc: t("rightsDesc") },
              { icon: Users, title: t("membership"), desc: t("membershipDesc") },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <item.icon className="w-6 h-6 text-[#1a5632] mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#1a5632] text-white p-8 rounded-2xl text-center">
            <FileText className="w-10 h-10 text-[#c8a84e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{t("downloadTitle")}</h2>
            <p className="text-white/80 mb-6 leading-relaxed">{t("downloadDesc")}</p>
            <a
              href="https://assets.zyrosite.com/A85e9Gq10gtR1yj2/internal-regulations-of-the-syrian-community-in-the-netherlands-v01-AE0Pne463Mikzaxl.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c8a84e] text-[#1a5632] font-bold px-6 py-3 rounded-xl hover:bg-[#b8972e] transition-colors"
            >
              <FileText className="w-5 h-5" />
              {t("downloadBtn")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
