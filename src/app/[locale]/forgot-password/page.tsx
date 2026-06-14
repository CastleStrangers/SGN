"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { SgnLogo } from "@/components/sgn-logo";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword');
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setMessage(data.message); }
      else { setStatus("error"); setMessage(data.error); }
    } catch { setStatus("error"); setMessage(t('connError')); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a5632] mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('backToLogin')}
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <SgnLogo size={56} className="mx-auto mb-4" priority />
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
          </div>
          {status === "success" ? (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-700">{message}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailLabel')}</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-10 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" placeholder="example@email.com" />
                </div>
              </div>
              {status === "error" && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{message}</div>}
              <button type="submit" disabled={status === "loading"} className="w-full bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
                {status === "loading" ? t('sending') : t('submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
