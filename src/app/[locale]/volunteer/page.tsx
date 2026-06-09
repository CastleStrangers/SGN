"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Heart, Users, Calendar, Award, HandHeart, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function VolunteerPage() {
  const t = useTranslations('volunteer');
  const [form, setForm] = useState({ name: "", email: "", phone: "", skills: "", availability: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) { setStatus("error"); setMsg(t('validationError')); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/volunteer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setMsg(data.message); } else { setStatus("error"); setMsg(data.error); }
    } catch { setStatus("error"); setMsg(t('connError')); }
  };

  const benefits = [
    { icon: Heart, title: t('benefit1Title'), desc: t('benefit1Desc') },
    { icon: Users, title: t('benefit2Title'), desc: t('benefit2Desc') },
    { icon: Calendar, title: t('benefit3Title'), desc: t('benefit3Desc') },
    { icon: Award, title: t('benefit4Title'), desc: t('benefit4Desc') },
  ];

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('successTitle')}</h1>
          <p className="text-gray-600 mb-8">{msg}</p>
          <Link href="/" className="inline-block bg-[#1a5632] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0f3d23] transition-colors">{t('backHome')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a5632] hover:text-[#0f3d23] mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
        </Link>

        <div className="text-center mb-12">
          <HandHeart className="w-12 h-12 text-[#c8a84e] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('benefitsTitle')}</h2>
            {benefits.map(v => (
              <div key={v.title} className="bg-white p-4 rounded-xl border flex items-start gap-3">
                <div className="w-10 h-10 bg-[#1a5632]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-5 h-5 text-[#1a5632]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{t('formTitle')}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')}</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailLabel')}</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneLabel')}</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('skillsLabel')}</label>
                  <input name="skills" value={form.skills} onChange={handleChange} placeholder={t('skillsPlaceholder')} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('durationLabel')}</label>
                <select name="availability" value={form.availability} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632] bg-white">
                  <option value="">{t('durationPlaceholder')}</option>
                  <option value="يومياً">{t('durationDaily')}</option>
                  <option value="عدة أيام في الأسبوع">{t('durationWeekly')}</option>
                  <option value="في عطلة نهاية الأسبوع">{t('durationWeekend')}</option>
                  <option value="مرة واحدة">{t('durationOnce')}</option>
                  <option value="حسب الحاجة">{t('durationAsNeeded')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('messageLabel')}</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
              </div>
              {status === "error" && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{msg}</div>}
              <button type="submit" disabled={status === "loading"} className="w-full bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                {status === "loading" ? t('sending') : t('submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
