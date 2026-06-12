"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Target, Eye, MessageCircle, Heart, Users, Shield } from "lucide-react";
import AboutUsBoard, { BoardMember } from "@/components/about-us-board";

const boardMembers: BoardMember[] = [
  {
    id: "chairman",
    nameAr: "د. أحمد السعيد",
    nameEn: "Dr. Ahmad Al-Said",
    titleAr: "رئيس مجلس الإدارة",
    image: "/images/board/chairman.png",
    bioPoints: [
      "دكتوراه في العلاقات الدولية والتنمية البشرية.",
      "خبرة تزيد عن 15 عاماً في إدارة المنظمات غير الربحية وتفعيل دور الجاليات السورية.",
      "عضو مؤسس للجالية السورية في هولندا ومساهم رئيسي في بناء جسور التواصل مع البلديات الهولندية."
    ],
    kvkNumber: "96718943"
  },
  {
    id: "secretary",
    nameAr: "أ. سارة المرعشلي",
    nameEn: "Sarah Al-Marashli",
    titleAr: "أمين السر",
    image: "/images/board/secretary.png",
    bioPoints: [
      "ماجستير في إدارة الأعمال والاتصال المؤسسي.",
      "خبرة طويلة في تنظيم الفعاليات المجتمعية وتوثيق وتنسيق المشاريع التنموية.",
      "مسؤولة عن التنسيق الداخلي والتوثيق الإداري لقرارات مجلس الإدارة."
    ],
    kvkNumber: "96718943"
  },
  {
    id: "treasurer",
    nameAr: "أ. خالد اليوسف",
    nameEn: "Khaled Al-Youssef",
    titleAr: "أمين الصندوق",
    image: "/images/board/treasurer.png",
    bioPoints: [
      "بكالوريوس في العلوم المالية والمحاسبية من جامعة دمشق.",
      "خبرة تفوق 10 سنوات في التدقيق المالي وإدارة الميزانيات للمؤسسات الأهلية.",
      "مشرف على إدارة الموارد المالية والتدقيق لضمان أقصى درجات الشفافية والمسؤولية المالية."
    ],
    kvkNumber: "96718943"
  },
  {
    id: "director",
    nameAr: "م. طارق العلي",
    nameEn: "Eng. Tariq Al-Ali",
    titleAr: "مدير المشاريع والتعاون الدولي",
    image: "/images/board/director.png",
    bioPoints: [
      "مهندس أنظمة وحاصل على شهادة إدارة المشاريع الـ PMP.",
      "مسؤول عن تطوير وتنفيذ البرامج التعليمية والتمكين الأكاديمي والمهني للشباب.",
      "منسق الشراكات مع البلديات الهولندية والمنظمات الشريكة لدعم الاندماج والتعليم."
    ],
    kvkNumber: "96718943"
  }
];

export default function AboutPage() {
  const t = useTranslations("about");
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AboutUsBoard members={boardMembers} />
      </div>
    </div>
  );
}
