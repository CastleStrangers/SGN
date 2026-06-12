"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { CheckCircle, Camera, WandSparkles, Sparkles, Badge, Loader2, Check } from "lucide-react";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";

interface FormData {
  nameAr: string;
  nameNl: string;
  birthYear: string;
  gender: string;
  originCity: string;
  whatsapp: string;
  email: string;
  nlProvincie: string;
  nlCity: string;
  educationLevel: string;
  profession: string;
  skills: string;
  maritalStatus: string;
  expNl: string;
  expOutside: string;
  agreed: boolean;
}

const emptyForm: FormData = {
  nameAr: "", nameNl: "", birthYear: "", gender: "",
  originCity: "", whatsapp: "", email: "", nlProvincie: "", nlCity: "",
  educationLevel: "", profession: "", skills: "", maritalStatus: "",
  expNl: "", expOutside: "", agreed: false,
};

const SYRIAN_GOVERNORATES = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "إدلب", "دير الزور", "الرقة", "الحسكة", "درعا", "السويداء", "القنيطرة",
];

const NL_PROVINCES = [
  "Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant",
  "Overijssel", "Flevoland", "Groningen", "Friesland", "Drenthe", "Zeeland", "Limburg",
];

function Logo() {
  return (
    <div className="flex justify-center mb-4">
      <div className="w-32 h-32 rounded-full shadow-md overflow-hidden border-[3px] border-yellow-600 flex items-center justify-center bg-white">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default function MembershipForm() {
  const t = useTranslations("membership");
  const locale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [scanning, setScanning] = useState(false);
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [settings, setSettings] = useState<Record<string, boolean> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings/membership").then(r => r.json()).then(setSettings).catch(() => {});
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey || typeof window === "undefined") return;
    (window as any).recaptchaSiteKey = siteKey;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const isEnabled = (key: string) => settings === null || settings[key] !== false;

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1) {
      const required = [];
      if (isEnabled("nameAr") && !form.nameAr) required.push("nameAr");
      if (isEnabled("nameNl") && !form.nameNl) required.push("nameNl");
      if (isEnabled("birthYear") && !form.birthYear) required.push("birthYear");
      if (isEnabled("gender") && !form.gender) required.push("gender");
      if (required.length) { setStatus("error"); setMsg(t("required")); return; }
    }
    if (step === 2) {
      const required = [];
      if (isEnabled("originCity") && !form.originCity) required.push("originCity");
      if (isEnabled("whatsapp") && !form.whatsapp) required.push("whatsapp");
      if (isEnabled("nlProvincie") && !form.nlProvincie) required.push("nlProvincie");
      if (isEnabled("nlCity") && !form.nlCity) required.push("nlCity");
      if (required.length) { setStatus("error"); setMsg(t("required")); return; }
      sendOtp();
      return;
    }
    if (step === 3) {
      if (!otpVerified) { setStatus("error"); setMsg(t("otpRequired")); return; }
    }
    setStatus("idle"); setMsg("");
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendOtp = async () => {
    setOtpSending(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.whatsapp }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setStep(3);
      } else {
        setOtpError(data.error || "فشل الإرسال");
      }
    } catch {
      setOtpError("فشل الاتصال بالخادم");
    }
    setOtpSending(false);
  };

  const verifyOtp = async () => {
    setOtpSending(true);
    setOtpError("");
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.whatsapp, code: otpCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        setStatus("success");
        setMsg(t("otpVerified"));
      } else {
        setOtpError(data.error || t("otpError"));
      }
    } catch {
      setOtpError("فشل الاتصال بالخادم");
    }
    setOtpSending(false);
  };

  const prevStep = () => {
    setStatus("idle"); setMsg("");
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setMsg(""); setStatus("idle");
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const cleanBase64 = base64.split(",")[1];
      const res = await fetch("/api/gemini/extract-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: cleanBase64, mimeType: file.type }),
      });
      const data = await res.json();
      if (res.ok && data.name_ar) {
        if (data.name_ar) updateField("nameAr", data.name_ar);
        if (data.name_nl) updateField("nameNl", data.name_nl);
        if (data.birth_year) updateField("birthYear", data.birth_year);
        setStatus("success"); setMsg(t("aiScannerSuccess"));
      } else {
        setStatus("error"); setMsg(data.error || t("aiScannerError"));
      }
    } catch {
      setStatus("error"); setMsg(t("aiScannerError"));
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const transliterateName = async () => {
    if (!form.nameAr.trim()) {
      setStatus("error"); setMsg(t("transliterateError"));
      return;
    }
    setTranslating(true);
    try {
      const res = await fetch("/api/gemini/polish-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: form.nameAr, action: "transliterate" }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        updateField("nameNl", data.result.replace(/[*"]/g, ""));
        setStatus("success"); setMsg(t("transliterateSuccess"));
      } else {
        setStatus("error"); setMsg(data.error || t("transliterateError"));
      }
    } catch {
      setStatus("error"); setMsg(t("connectionError"));
    } finally {
      setTranslating(false);
    }
  };

  const polishText = async (field: "expNl" | "expOutside") => {
    if (!form[field].trim()) {
      setStatus("error"); setMsg(t("polishError"));
      return;
    }
    setPolishingId(field);
    try {
      const res = await fetch("/api/gemini/polish-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: form[field], action: "polish" }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        updateField(field, data.result);
        setStatus("success"); setMsg(t("polishSuccess"));
      } else {
        setStatus("error"); setMsg(data.error || t("polishError"));
      }
    } catch {
      setStatus("error"); setMsg(t("connectionError"));
    } finally {
      setPolishingId(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreed) {
      setStatus("error"); setMsg(t("agreementRequired"));
      return;
    }
    setStatus("loading");
    try {
      let recaptchaToken = "";
      if (typeof window !== "undefined" && (window as any).grecaptcha) {
        recaptchaToken = await (window as any).grecaptcha.execute(
          (window as any).recaptchaSiteKey,
          { action: "submit" }
        );
      }
      const res = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success"); setMsg(data.message);
      } else {
        setStatus("error"); setMsg(data.error);
      }
    } catch {
      setStatus("error"); setMsg(t("connectionError"));
    }
  };

  const isRtl = locale === "ar";

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50" dir={isRtl ? "rtl" : "ltr"}>
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="bg-white rounded-3xl shadow-sm p-12">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("successTitle")}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{msg}</p>
            <button onClick={() => router.push("/")} className="inline-block bg-emerald-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-colors cursor-pointer">{t("backHome")}</button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full p-4 text-sm bg-gray-50 border-2 border-transparent rounded-2xl transition-all focus:border-emerald-700 focus:bg-white focus:outline-none focus:shadow-lg focus:shadow-emerald-900/10";
  const selectClass = "w-full p-4 text-sm bg-gray-50 border-2 border-transparent rounded-2xl transition-all focus:border-emerald-700 focus:bg-white focus:outline-none appearance-none";

  return (
    <div className={`min-h-screen bg-gradient-to-br from-stone-50 to-gray-100 py-12 px-4 ${isRtl ? "font-[Noto_Kufi_Arabic,sans-serif]" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex">
          <button
            onClick={() => {
              if (typeof window !== "undefined" && document.referrer && document.referrer.includes(window.location.host)) {
                router.back();
              } else {
                router.push("/");
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 hover:text-emerald-800 transition-colors shadow-sm cursor-pointer"
          >
            {isRtl ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span>{t("back")}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span>{t("back")}</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-emerald-800 h-48 w-full rounded-[2rem] mb-20 relative flex flex-col items-center justify-center text-center px-6">
          <Logo />
          <div className="flex items-center gap-2 justify-center" dir="rtl">
            <FreeSyrianFlag className="w-6 h-4 rounded shadow-sm border border-white/20 flex-shrink-0 object-cover" />
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{t("title")}</h1>
            <DutchFlag className="w-6 h-4 rounded shadow-sm border border-white/20 flex-shrink-0 object-cover" />
          </div>
          <p className="text-emerald-100/60 text-xs mt-2 max-w-lg leading-relaxed">{t("subtitle")}</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-[2rem] shadow-2xl p-8 md:p-16 relative border border-white/50">
          {msg && (
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-2 transition-all ${
              status === "error" ? "bg-red-500 text-white" : "bg-emerald-600 text-white"
            }`}>
              {status === "loading" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              <span>{msg}</span>
            </div>
          )}

          <div className="flex justify-center gap-2 mb-12">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`h-2 rounded-full transition-all duration-500 ${s <= step ? "bg-emerald-800 w-20" : "bg-gray-200 w-10"}`} />
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-fade">
                {isEnabled("aiScanner") && (
                <div className="bg-violet-50/70 p-5 rounded-2xl border border-violet-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-200 rounded-full flex items-center justify-center text-violet-700">
                      <Badge className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{t("aiScannerTitle")}</h3>
                      <p className="text-xs text-slate-500 mt-1">{t("aiScannerDesc")}</p>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleIdUpload} title={t("aiScannerTitle")} aria-label={t("aiScannerTitle")} placeholder={t("aiScannerTitle")} />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={scanning}
                      className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-5 py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2">
                      {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                      <span>{scanning ? t("aiScannerLoading") : t("aiScannerBtn")}</span>
                    </button>
                  </div>
                </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("nameAr")}</label>
                    <input type="text" value={form.nameAr} onChange={e => updateField("nameAr", e.target.value)} required className={inputClass} placeholder={t("nameArPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("nameNl")}</label>
                    <div className="relative">
                      <input type="text" value={form.nameNl} onChange={e => updateField("nameNl", e.target.value)} required className={inputClass} placeholder={t("nameNlPlaceholder")} dir="ltr" />
                      {isEnabled("transliterate") && (
                      <button type="button" onClick={transliterateName} disabled={translating}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-violet-100 hover:bg-violet-200 text-violet-700 p-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                        title={t("transliterateBtn")}>
                        {translating ? <Loader2 className="w-4 h-4 animate-spin" /> : <WandSparkles className="w-4 h-4" />}
                      </button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("birthYear")}</label>
                    <input type="number" value={form.birthYear} onChange={e => updateField("birthYear", e.target.value)} required min={1940} max={2015} className={inputClass} placeholder={t("birthYearPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("gender")}</label>
                    <div className="flex gap-4">
                      {[t("male"), t("female")].map(g => (
                        <label key={g} className={`flex-1 flex items-center justify-center p-4 rounded-2xl cursor-pointer border-2 transition ${
                          form.gender === g ? "border-emerald-500 bg-emerald-50" : "border-transparent bg-gray-50 hover:border-emerald-200"
                        }`}>
                          <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={e => updateField("gender", e.target.value)} required className="ml-2 accent-emerald-700" />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <button type="button" onClick={nextStep} className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl shadow-emerald-900/20">
                  {t("next")}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("originCity")}</label>
                    <select value={form.originCity} onChange={e => updateField("originCity", e.target.value)} required className={selectClass} title={t("originCity")}>
                      <option value="">{t("originCityPlaceholder")}</option>
                      {SYRIAN_GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("whatsapp")}</label>
                    <input type="tel" value={form.whatsapp} onChange={e => updateField("whatsapp", e.target.value)} required dir="ltr" className={inputClass} placeholder={t("whatsappPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("email")}</label>
                    <input type="email" value={form.email} onChange={e => updateField("email", e.target.value)} dir="ltr" className={inputClass} placeholder={t("emailPlaceholder")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("nlProvincie")}</label>
                    <select value={form.nlProvincie} onChange={e => updateField("nlProvincie", e.target.value)} required className={selectClass} title={t("nlProvincie")}>
                      <option value="">{t("nlProvinciePlaceholder")}</option>
                      {NL_PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("nlCity")}</label>
                    <input type="text" value={form.nlCity} onChange={e => updateField("nlCity", e.target.value)} required className={inputClass} placeholder={t("nlCityPlaceholder")} />
                  </div>
                </div>
                {isEnabled("educationLevel") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("educationLevel")}</label>
                    <select value={form.educationLevel || ""} onChange={e => updateField("educationLevel", e.target.value)} className={selectClass} title={t("educationLevel")}>
                      <option value="">{t("educationLevelPlaceholder")}</option>
                      <option>أمي</option>
                      <option>ابتدائي</option>
                      <option>إعدادي</option>
                      <option>ثانوي</option>
                      <option>معهد متوسط</option>
                      <option>جامعي</option>
                      <option>دراسات عليا</option>
                    </select>
                  </div>
                  {isEnabled("maritalStatus") && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("maritalStatus")}</label>
                    <select value={form.maritalStatus || ""} onChange={e => updateField("maritalStatus", e.target.value)} className={selectClass} title={t("maritalStatus")}>
                      <option value="">{t("maritalStatusPlaceholder")}</option>
                      <option>أعزب</option>
                      <option>متزوج</option>
                      <option>مطلق</option>
                      <option>أرمل</option>
                    </select>
                  </div>
                  )}
                </div>
                )}
                {(isEnabled("profession") || isEnabled("skills")) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEnabled("profession") && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("profession")}</label>
                    <input type="text" value={form.profession || ""} onChange={e => updateField("profession", e.target.value)} className={inputClass} placeholder={t("professionPlaceholder")} />
                  </div>
                  )}
                  {isEnabled("skills") && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 mr-2">{t("skills")}</label>
                    <input type="text" value={form.skills || ""} onChange={e => updateField("skills", e.target.value)} className={inputClass} placeholder={t("skillsPlaceholder")} />
                  </div>
                  )}
                </div>
                )}
                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 font-bold py-5 rounded-2xl hover:bg-gray-200 transition">{t("prev")}</button>
                  <button type="button" onClick={nextStep} className="flex-[2] bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-5 rounded-2xl transition-all transform hover:scale-[1.02] shadow-xl shadow-emerald-900/20">
                    {t("next")}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-fade">
                <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-200 rounded-full flex items-center justify-center">
                    {otpVerified ? (
                      <CheckCircle className="w-8 h-8 text-emerald-700" />
                    ) : (
                      <svg className="w-8 h-8 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">🔐 {t("otpTitle")}</h3>
                  <p className="text-sm text-emerald-700 mb-4">{t("otpDesc")} <strong dir="ltr">{form.whatsapp}</strong></p>
                  {!otpVerified ? (
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="flex gap-3 justify-center">
                        <input type="text" value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6} placeholder="000000"
                          className="text-center text-2xl tracking-[8px] font-bold bg-white border-2 rounded-2xl p-3 w-48 transition-all focus:border-emerald-500 focus:outline-none" dir="ltr" />
                      </div>
                      {otpError && <div className="text-red-500 text-xs font-bold">{otpError}</div>}
                      <button type="button" onClick={verifyOtp} disabled={otpSending || otpCode.length !== 6}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold py-3 rounded-2xl transition flex items-center justify-center gap-2">
                        {otpSending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {t("otpVerifyBtn")}
                      </button>
                      <button type="button" onClick={sendOtp} disabled={otpSending}
                        className="text-emerald-700 text-xs font-bold hover:underline">
                        {t("otpResend")}
                      </button>
                    </div>
                  ) : (
                    <p className="text-emerald-800 font-bold text-sm">{t("otpSuccess")}</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 font-bold py-5 rounded-2xl hover:bg-gray-200 transition">{t("prev")}</button>
                  <button type="button" onClick={nextStep} disabled={!otpVerified}
                    className="flex-[2] bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none">
                    {t("next")}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-fade">
                <div className="space-y-6">
                  {(["expNl", "expOutside"] as const).filter(f => isEnabled(f)).map(field => (
                    <div key={field} className="space-y-2">
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-slate-700 mr-2">
                          {field === "expNl" ? t("expNl") : t("expOutside")}
                        </label>
                        {isEnabled("polish") && (
                        <button type="button" onClick={() => polishText(field)} disabled={polishingId === field}
                          className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md hover:shadow-lg hover:shadow-violet-400/30 transition disabled:opacity-50">
                          {polishingId === field ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {t("polishBtn")}
                        </button>
                        )}
                      </div>
                      <textarea value={form[field]} onChange={e => updateField(field, e.target.value)}
                        className="w-full p-4 text-sm bg-gray-50 border-2 border-transparent rounded-2xl h-24 resize-none transition-all focus:border-emerald-700 focus:bg-white focus:outline-none"
                        placeholder={field === "expNl" ? t("expNlPlaceholder") : t("expOutsidePlaceholder")} />
                    </div>
                  ))}

                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" checked={form.agreed} onChange={e => updateField("agreed", e.target.checked)} required className="mt-1 w-5 h-5 accent-emerald-700" />
                      <span className="text-xs text-emerald-900 leading-relaxed font-medium">
                        {t.rich("agreement", { strong: (chunks: React.ReactNode) => <strong>{chunks}</strong> })}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={prevStep} className="flex-1 bg-gray-100 text-gray-500 font-bold py-5 rounded-2xl hover:bg-gray-200 transition">{t("prev")}</button>
                  <button type="submit" disabled={status === "loading"}
                    className="flex-[2] bg-gradient-to-r from-emerald-800 to-emerald-900 text-white font-bold py-5 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2">
                    {status === "loading" ? <><Loader2 className="w-5 h-5 animate-spin" /> {t("submitting")}</> : t("submit")}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] uppercase tracking-widest gap-4">
          <span>{t("footerName")}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition">{t("privacy")}</a>
            <a href="#" className="hover:text-emerald-600 transition">{t("terms")}</a>
          </div>
          <span>KVK: 96718943</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.5s ease; }
      `}</style>
    </div>
  );
}
