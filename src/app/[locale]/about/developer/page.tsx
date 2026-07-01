"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Code, Laptop, Cpu, MessageSquare, Mail } from "lucide-react";

export default function DeveloperPage() {
  const t = useTranslations("dev");

  const services = [
    {
      icon: Laptop,
      title: t("service2"),
      desc: t("service2") + " - Next.js, React, Tailwind CSS",
    },
    {
      icon: Code,
      title: t("service1"),
      desc: t("service1") + " - React Native, Expo, iOS & Android",
    },
    {
      icon: Cpu,
      title: t("service3"),
      desc: t("service3") + " - LLM integration, Chatbots, RAG",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8 font-medium transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>{t("backToAbout")}</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-12">
          <div className="md:flex">
            {/* Left side: Avatar & Basic Info */}
            <div className="md:w-1/3 bg-gradient-to-br from-[#1a5632] to-[#123d23] p-8 text-center flex flex-col items-center justify-center text-white">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 mb-4 shadow-lg">
                <img
                  src="/images/board/Mohammad_Salim_Aziza.png"
                  alt={t("name")}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = "/images/board/placeholder.svg";
                  }}
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{t("name")}</h2>
              <p className="text-xs text-white/80 font-medium mb-3">{t("role")}</p>
              <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold">
                {t("company")}
              </div>
            </div>

            {/* Right side: Detailed Bio & Statement */}
            <div className="md:w-2/3 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{t("title")}</h1>
                <p className="text-sm font-semibold text-[#1a5632] mb-6">{t("subtitle")}</p>
                <p className="text-slate-600 leading-relaxed mb-6 text-justify">{t("bio")}</p>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  {t("services")}
                </h3>
                <div className="space-y-3">
                  {services.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f0f7f2] flex items-center justify-center text-[#1a5632]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-slate-700 font-medium">{service.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8 text-center md:text-right md:flex md:items-center md:justify-between md:gap-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("contact")}</h2>
            <p className="text-slate-600 text-sm">
              {t("promoDesc")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end flex-shrink-0">
            {/* WhatsApp Link */}
            <a
              href="https://wa.me/31687039093?text=Hello%20Eng.%20Mohamad%20Salim%2C%20I%20would%20like%20to%20inquire%20about%20your%20software%20development%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t("whatsapp")}</span>
            </a>

            {/* Email Link */}
            <a
              href="mailto:info@castle-strangers.nl?subject=Software%20Development%20Inquiry"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Mail className="w-5 h-5" />
              <span>{t("email")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
