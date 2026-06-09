"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Save } from "lucide-react";

interface Settings {
  [key: string]: boolean;
}

const FIELDS = [
  { key: "nameAr", labelAr: "الاسم بالعربية", labelEn: "Name (Arabic)" },
  { key: "nameNl", labelAr: "الاسم بالهولندية", labelEn: "Name (Dutch)" },
  { key: "birthYear", labelAr: "سنة الميلاد", labelEn: "Birth Year" },
  { key: "gender", labelAr: "الجنس", labelEn: "Gender" },
  { key: "originCity", labelAr: "محافظة المنشأ", labelEn: "Home Governorate" },
  { key: "whatsapp", labelAr: "واتساب", labelEn: "WhatsApp" },
  { key: "email", labelAr: "الإيميل", labelEn: "Email" },
  { key: "nlProvincie", labelAr: "المقاطعة", labelEn: "Province" },
  { key: "nlCity", labelAr: "المدينة", labelEn: "City" },
  { key: "educationLevel", labelAr: "المستوى التعليمي", labelEn: "Education Level" },
  { key: "profession", labelAr: "المهنة", labelEn: "Profession" },
  { key: "skills", labelAr: "المهارات", labelEn: "Skills" },
  { key: "maritalStatus", labelAr: "الحالة الاجتماعية", labelEn: "Marital Status" },
  { key: "expNl", labelAr: "خبرات هولندا", labelEn: "Experience NL" },
  { key: "expOutside", labelAr: "خبرات خارج", labelEn: "Experience Abroad" },
  { key: "aiScanner", labelAr: "مسح الهوية (AI)", labelEn: "AI ID Scanner" },
  { key: "transliterate", labelAr: "ترجمة الاسم", labelEn: "Name Transliteration" },
  { key: "polish", labelAr: "صياغة النصوص (AI)", labelEn: "AI Text Polishing" },
];

export default function MembershipSettingsPage() {
  const t = useTranslations("membersDashboard");
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings/membership")
      .then(r => r.json())
      .then(data => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/membership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) { setMsg("تم الحفظ"); setTimeout(() => setMsg(""), 3000); }
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-800" /></div>;

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">إعدادات استمارة الانتساب</h1>
      <p className="text-sm text-gray-500">فعّل أو عطّل الحقول التي تظهر في الاستمارة</p>

      {msg && <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-bold">{msg}</div>}

      <div className="bg-white rounded-2xl border divide-y">
        {FIELDS.map(f => (
          <label key={f.key} className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition">
            <div>
              <p className="font-medium text-gray-900">{f.labelAr}</p>
              <p className="text-xs text-gray-400">{f.labelEn}</p>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors relative ${settings[f.key] ? "bg-emerald-600" : "bg-gray-300"}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow absolute top-1 transition-all ${settings[f.key] ? "right-1" : "right-6"}`} />
              <input type="checkbox" className="sr-only" checked={settings[f.key]} onChange={() => toggle(f.key)} />
            </div>
          </label>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold hover:bg-emerald-900 transition disabled:opacity-50 flex items-center gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        حفظ الإعدادات
      </button>
    </div>
  );
}
