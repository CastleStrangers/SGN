"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { SgnLogo } from "@/components/sgn-logo";
import { createFieldRules } from "@/lib/validations";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";

export default function SignupPage() {
  const locale = useLocale();
  const fieldRules = createFieldRules(locale);
  const t = useTranslations("auth");
  const tSite = useTranslations("site");
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [authError, setAuthError] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password", "");

  const onSubmit = async (data: any) => {
    setAuthError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
    });
    const result = await res.json();
    if (!res.ok) {
      setAuthError(result.error || t("signupError"));
    } else {
      // تسجيل الدخول تلقائياً بعد إنشاء الحساب
      await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      router.push("/dashboard");
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);
    await signIn(provider, { callbackUrl: `/${locale}/dashboard` });
  };

  // قوة كلمة المرور
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { level: 1, label: "ضعيفة", color: "bg-red-400" },
      { level: 2, label: "متوسطة", color: "bg-yellow-400" },
      { level: 3, label: "جيدة", color: "bg-blue-400" },
      { level: 4, label: "قوية", color: "bg-green-500" },
    ];
    return levels[score - 1] || { level: 0, label: "", color: "" };
  };
  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* الجانب الأيمن: الخلفية الزخرفية */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f3d23] via-[#1a5632] to-[#2d7a4a] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-[#c8a84e]/20 rounded-full" />

        <div className="relative z-10 text-center text-white">
            <SgnLogo size={128} className="mx-auto mb-8" />
          <div className="flex items-center gap-2 justify-center mb-4" dir="rtl">
            <FreeSyrianFlag className="w-7 h-5 rounded shadow-sm border border-white/20 flex-shrink-0 object-cover" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-none">انضم إلى جالية السوريين</h2>
            <DutchFlag className="w-7 h-5 rounded shadow-sm border border-white/20 flex-shrink-0 object-cover" />
          </div>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
            كن جزءاً من مجتمعنا المتنامي وشارك في بناء مستقبل أفضل
          </p>

          <div className="mt-10 space-y-4 text-right max-w-sm mx-auto">
            {[
              "الوصول إلى أخبار الجالية أولاً بأول",
              "المشاركة في الفعاليات والنشاطات",
              "التواصل مع أبناء الجالية في هولندا",
              "دعم المبادرات التطوعية والخيرية",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#c8a84e] flex-shrink-0" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* الجانب الأيسر: نموذج التسجيل */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden text-center mb-8">
            <SgnLogo size={56} className="mx-auto mb-3" />
            <div className="flex items-center gap-1.5 justify-center" dir="rtl">
              <FreeSyrianFlag className="w-6 h-4 rounded shadow-sm border border-gray-200 flex-shrink-0 object-cover" />
              <h1 className="text-lg sm:text-xl font-bold text-[#1a5632] leading-none">{tSite("shortTitle")}</h1>
              <DutchFlag className="w-6 h-4 rounded shadow-sm border border-gray-200 flex-shrink-0 object-cover" />
            </div>
          </div>

          <div className="flex justify-start mb-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1a5632] text-sm font-semibold transition-all group">
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>{t("backToHome")}</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{t("signup")}</h1>
              <p className="text-gray-500 text-sm mt-1">{t("signupDesc")}</p>
            </div>

            {/* أزرار التسجيل الاجتماعي */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("google");
                }}
                disabled={!!socialLoading}
                className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-gray-200 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-xs font-semibold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {socialLoading === "google" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("facebook");
                }}
                disabled={!!socialLoading}
                className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-gray-200 bg-white rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all text-xs font-semibold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === "facebook" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("azure-ad");
                }}
                disabled={!!socialLoading}
                className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-gray-200 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-xs font-semibold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === "azure-ad" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 21 21">
                    <rect x="0" y="0" width="9" height="9" fill="#f25022"/>
                    <rect x="10" y="0" width="9" height="9" fill="#7fba00"/>
                    <rect x="0" y="10" width="9" height="9" fill="#01a4ef"/>
                    <rect x="10" y="10" width="9" height="9" fill="#ffb900"/>
                  </svg>
                )}
                <span>Microsoft</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLogin("apple");
                }}
                disabled={!!socialLoading}
                className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-gray-200 bg-white rounded-xl hover:bg-black hover:border-black hover:text-white transition-all duration-300 text-xs font-semibold text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === "apple" ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.34-6.08-3.57-2.9-7.44-7.55-11.62-13.97-4.19-6.41-7.85-14.34-10.99-23.8-3.14-9.46-4.71-18.66-4.71-27.61 0-14.28 3.73-25.96 11.21-35.03 7.48-9.08 16.63-13.62 27.46-13.62 4.69 0 9.87 1.23 15.56 3.69 5.69 2.46 9.4 3.69 11.13 3.69 1.56 0 5.14-1.23 10.75-3.69 5.62-2.46 10.87-3.6 15.75-3.41 11.04.45 19.82 4.49 26.33 12.13-9.74 5.92-14.5 13.94-14.27 24.08.23 8.04 3.2 14.83 8.91 20.37 5.71 5.53 12.64 8.78 20.78 9.75-2.23 6.53-5.26 13.01-9.1 19.46zm-29.97-90.87c0-7.81 2.8-15.35 8.41-22.62 5.61-7.27 12.83-11.22 21.66-11.85.09 1 .14 1.93.14 2.8 0 7.55-2.92 14.93-8.77 22.15-5.85 7.22-12.92 11.23-21.2 12.02-.14-.84-.24-1.63-.24-2.5z"/>
                  </svg>
                )}
                <span>Apple</span>
              </button>
            </div>

            {/* فاصل */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400 uppercase tracking-wider">أو بالبريد الإلكتروني</span>
              </div>
            </div>

            {/* نموذج التسجيل */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("name")}</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    {...register("name", fieldRules.name)}
                    placeholder="الاسم الكامل"
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("email")}</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    {...register("email", fieldRules.email)}
                    placeholder="example@email.com"
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent transition-all text-sm"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("password")}</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={show ? "text" : "password"}
                    {...register("password", fieldRules.password)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}

                {/* مؤشر قوة كلمة المرور */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength.level ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className="text-xs text-gray-500">قوة كلمة المرور: <span className="font-medium">{strength.label}</span></p>
                    )}
                  </div>
                )}
              </div>

              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#1a5632]/20 hover:shadow-xl hover:shadow-[#1a5632]/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  <>
                    {t("signupButton")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-[#1a5632] font-bold hover:underline">
                {t("loginButton")}
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            بالتسجيل، أنت توافق على{" "}
            <Link href="/about" className="text-[#1a5632] hover:underline">سياسة الخصوصية</Link>
            {" "}و{" "}
            <Link href="/about" className="text-[#1a5632] hover:underline">شروط الاستخدام</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
