"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Target, Eye, MessageCircle, Heart, Users, Shield } from "lucide-react";
import AboutUsBoard, { BoardMember } from "@/components/about-us-board";

export default function AboutPage() {
  const t = useTranslations("about");
  const tDev = useTranslations("dev");
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/board")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMembers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch board members:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t("title")}</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">{t("description")}</p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-[#f0f7f2] p-8 rounded-2xl">
              <Eye className="w-8 h-8 text-[#1a5632] mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("visionTitle")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("visionDesc")}</p>
            </div>
            <div className="bg-[#fdf8f0] p-8 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-[#c8a84e] mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("missionTitle")}</h2>
              <p className="text-gray-600 leading-relaxed">{t("missionDesc")}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("valuesTitle")}</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {[
              { icon: Heart, title: t("valueBelonging"), desc: t("valueBelongingDesc") },
              { icon: Users, title: t("valueTeamwork"), desc: t("valueTeamworkDesc") },
              { icon: Shield, title: t("valueNeutrality"), desc: t("valueNeutralityDesc") },
              { icon: Target, title: t("valueTransparency"), desc: t("valueTransparencyDesc") },
            ].map((v) => (
              <div key={v.title} className="bg-gray-50 p-6 rounded-xl border">
                <v.icon className="w-6 h-6 text-[#1a5632] mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#1a5632] text-white p-8 rounded-2xl text-center">
            <Target className="w-10 h-10 text-[#c8a84e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{t("goalsTitle")}</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-right">
              {[t("goal1"), t("goal2"), t("goal3"), t("goal4")].map((o, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/10 rounded-xl p-4">
                  <span className="w-6 h-6 bg-[#c8a84e] text-[#1a5632] rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{o}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">{t("boardLoading")}</div>
        ) : (
          <AboutUsBoard members={members} />
        )}
      </div>

      {/* Developer Promotion Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#f0f7f2] to-[#e4efe8] border border-[#1a5632]/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {tDev("promoTitle")}
            </h3>
            <p className="text-gray-600 text-sm max-w-xl">
              {tDev("promoDesc")}
            </p>
          </div>
          <Link
            href="/about/developer"
            className="inline-flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-6 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex-shrink-0"
          >
            <span>{tDev("promoBtn")}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
