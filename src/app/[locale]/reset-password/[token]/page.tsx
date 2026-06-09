"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle, ArrowLeft, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage() {
  const t = useTranslations('resetPassword');
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 8) { setStatus("error"); setMessage(t('validationError')); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) { setStatus("success"); setMessage(data.message); }
      else { setStatus("error"); setMessage(data.error); }
    } catch { setStatus("error"); setMessage(t('connError')); }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('successTitle')}</h1>
          <p className="text-green-700 mb-6">{message}</p>
          <Link href="/login" className="inline-block bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold px-6 py-3 rounded-xl transition-colors">{t('login')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#1a5632] mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('backToLogin')}
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt={t('title')} width={56} height={56} className="w-14 h-14 mx-auto mb-4" priority />
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('passwordLabel')}</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632]" placeholder={t('passwordPlaceholder')} />
                <button type="button" onClick={() => setShow(!show)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {status === "error" && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm"><XCircle className="w-4 h-4 inline ml-1" />{message}</div>}
            <button type="submit" disabled={status === "loading"} className="w-full bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50">
              {status === "loading" ? t('saving') : t('submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
