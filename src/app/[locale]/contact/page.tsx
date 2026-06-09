"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Mail, MapPin, Send, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createFieldRules } from "@/lib/validations";

export default function ContactPage() {
  const locale = useLocale();
  const fieldRules = createFieldRules(locale);
  const t = useTranslations("contact");
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSent(true);
      else alert(t("sendError"));
    } catch { alert(t("connError")); }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600 mb-12">{t("subtitle")}</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#f0f7f2] rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#1a5632]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("emailLabel")}</p>
                  <p className="font-medium text-gray-900">{t("info.email")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#fdf8f0] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#c8a84e]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t("locationLabel")}</p>
                  <p className="font-medium text-gray-900">{t("info.location")}</p>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-3">{t("socialTitle")}</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61584301535331", label: "Facebook" },
                { icon: Instagram, href: "https://www.instagram.com/sgn_syria/", label: "Instagram" },
                { icon: Youtube, href: "https://www.youtube.com/@SY-NL", label: "Youtube" },
                { icon: Twitter, href: "https://x.com/SGN2098551", label: "X" },
                { icon: TikTok, href: "https://www.tiktok.com/@sgn_syria", label: "TikTok" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" className="w-12 h-12 bg-gray-100 hover:bg-[#1a5632] hover:text-white rounded-xl flex items-center justify-center transition-colors text-gray-600">
                  <s.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.name")}</label>
                <input type="text" {...register("name", fieldRules.name)} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.email")}</label>
                <input type="email" {...register("email", fieldRules.email)} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.subject")}</label>
                <input type="text" {...register("subject", fieldRules.subject)} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("form.message")}</label>
                <textarea rows={5} {...register("message", fieldRules.message)} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]"></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>}
              </div>
              {sent ? (
                <div className="bg-[#f0f7f2] text-[#1a5632] p-4 rounded-xl text-center font-medium">
                  {t("form.success")}
                </div>
              ) : (
                <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50">
                  <Send className="w-4 h-4" />
                  {isSubmitting ? t("sending") : t("form.submit")}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
