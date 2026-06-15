"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Smartphone, Send, Save, Palette, Bell, Globe, Plus, Trash2, Edit3, Check, Loader2 } from "lucide-react";

interface Banner {
  titleAr: string;
  visible: boolean;
  image: string;
}

interface Version {
  latest: string;
  required: boolean;
  alertMessage: string;
}

interface MobileSettings {
  banner: Banner;
  version: Version;
}

interface MobileTheme {
  primary: string;
  accent: string;
  background: string;
}

interface Translation {
  id: string;
  key: string;
  ar: string;
  en: string;
  nl: string;
}

const DUTCH_PROVINCES = [
  "Zuid-Holland",
  "Noord-Holland",
  "Utrecht",
  "Gelderland",
  "Noord-Brabant",
  "Overijssel",
  "Flevoland",
  "Friesland",
  "Groningen",
  "Drenthe",
  "Zeeland",
  "Limburg"
];

export default function MobileControlPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "push" | "translations">("settings");
  
  // Settings & Theme
  const [settings, setSettings] = useState<MobileSettings>({
    banner: { titleAr: "أهلاً بكم في تطبيق الجالية", visible: true, image: "" },
    version: { latest: "1.0.0", required: false, alertMessage: "هناك تحديث جديد متوفر!" }
  });
  const [theme, setTheme] = useState<MobileTheme>({
    primary: "#1a5632",
    accent: "#c8a84e",
    background: "#f8fafc"
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Push notifications
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushProvince, setPushProvince] = useState("");
  const [pushCity, setPushCity] = useState("");
  const [pushLoading, setPushLoading] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; count: number; message?: string } | null>(null);

  // Translations
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [transLoading, setTransLoading] = useState(false);
  const [editingTrans, setEditingTrans] = useState<Translation | null>(null);
  const [newTrans, setNewTrans] = useState({ key: "", ar: "", en: "", nl: "" });
  const [showAddTrans, setShowAddTrans] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchTranslations();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/dashboard/mobile");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.mobile_settings);
        setTheme(data.mobile_theme);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTranslations = async () => {
    setTransLoading(true);
    try {
      const res = await fetch("/api/mobile/translations");
      if (res.ok) {
        const data = await res.json();
        // Convert language maps back to array of items for easy UI table listing
        const list: Translation[] = [];
        const arKeys = Object.keys(data.ar || {});
        arKeys.forEach((key, idx) => {
          list.push({
            id: String(idx), // Temp unique id for list render
            key,
            ar: data.ar[key],
            en: data.en[key] || "",
            nl: data.nl[key] || ""
          });
        });
        setTranslations(list);
      }
    } catch (e) {
      console.error(e);
    }
    setTransLoading(false);
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch("/api/dashboard/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_settings",
          mobile_settings: settings,
          mobile_theme: theme
        })
      });
      if (res.ok) {
        alert("تم حفظ الإعدادات والمظهر بنجاح!");
      } else {
        alert("فشل في حفظ الإعدادات");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الاتصال بالخادم");
    }
    setSettingsLoading(false);
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) {
      alert("يرجى ملء عنوان ونص الإشعار");
      return;
    }
    setPushLoading(true);
    setPushResult(null);
    try {
      const res = await fetch("/api/dashboard/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_push",
          push: {
            title: pushTitle,
            body: pushBody,
            province: pushProvince || undefined,
            city: pushCity || undefined
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPushResult({ success: true, count: data.count, message: data.message });
        setPushTitle("");
        setPushBody("");
      } else {
        setPushResult({ success: false, count: 0 });
      }
    } catch (e) {
      setPushResult({ success: false, count: 0 });
    }
    setPushLoading(false);
  };

  const handleAddTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrans.key.trim() || !newTrans.ar.trim() || !newTrans.en.trim() || !newTrans.nl.trim()) {
      alert("يرجى ملء جميع الحقول للترجمة");
      return;
    }
    try {
      const res = await fetch("/api/mobile/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrans)
      });
      if (res.ok) {
        setNewTrans({ key: "", ar: "", en: "", nl: "" });
        setShowAddTrans(false);
        fetchTranslations();
      } else {
        const err = await res.json();
        alert(err.error || "فشل إدخال المفتاح");
      }
    } catch (e) {
      alert("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const handleUpdateTranslation = async () => {
    if (!editingTrans) return;
    try {
      const res = await fetch("/api/mobile/translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTrans.key, // Using key as custom identifier for update logic on flat DB
          key: editingTrans.key,
          ar: editingTrans.ar,
          en: editingTrans.en,
          nl: editingTrans.nl
        })
      });
      if (res.ok) {
        setEditingTrans(null);
        fetchTranslations();
      } else {
        alert("فشل تحديث المفتاح");
      }
    } catch (e) {
      alert("خطأ في الاتصال بالخادم");
    }
  };

  const handleDeleteTranslation = async (key: string) => {
    if (!confirm(`هل أنت متأكد من حذف مفتاح الترجمة "${key}"؟`)) return;
    try {
      const res = await fetch("/api/mobile/translations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key })
      });
      if (res.ok) {
        fetchTranslations();
      } else {
        alert("فشل في حذف المفتاح");
      }
    } catch (e) {
      alert("خطأ في الاتصال");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-7 h-7 text-[#1a5632]" />
          لوحة التحكم بتطبيق الجوال والآيباد
        </h1>
        <p className="text-gray-500 text-sm mt-1">إدارة الثيم، الإشعارات، وتراجم تطبيق الموبايل بشكل مركزي فوري.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "settings"
              ? "border-[#1a5632] text-[#1a5632]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Palette className="w-4 h-4" />
          مظهر وإصدار التطبيق
        </button>
        <button
          onClick={() => setActiveTab("push")}
          className={`px-4 py-2.5 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "push"
              ? "border-[#1a5632] text-[#1a5632]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Bell className="w-4 h-4" />
          إرسال الإشعارات الفورية
        </button>
        <button
          onClick={() => setActiveTab("translations")}
          className={`px-4 py-2.5 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === "translations"
              ? "border-[#1a5632] text-[#1a5632]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Globe className="w-4 h-4" />
          تراجم التطبيق الديناميكية
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Settings */}
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#c8a84e]" />
              الهوية البصرية للموبايل (الألوان الأساسية)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">اللون الرئيسي (Primary Color)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.primary}
                    onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title="اللون الرئيسي"
                    aria-label="اللون الرئيسي"
                  />
                  <input
                    type="text"
                    value={theme.primary}
                    onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-xs border rounded-lg"
                    placeholder="#1a5632"
                    title="رمز اللون الرئيسي"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">اللون المساعد (Accent Color)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title="اللون المساعد"
                    aria-label="اللون المساعد"
                  />
                  <input
                    type="text"
                    value={theme.accent}
                    onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-xs border rounded-lg"
                    placeholder="#c8a84e"
                    title="رمز اللون المساعد"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Settings */}
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#1a5632]" />
              البانر الترحيبي والإصدار
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">عنوان البانر بالعربية</label>
                <input
                  type="text"
                  value={settings.banner.titleAr}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      banner: { ...settings.banner, titleAr: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg text-sm"
                  placeholder="عنوان البانر بالعربية"
                  title="عنوان البانر بالعربية"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bannerVisible"
                  checked={settings.banner.visible}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      banner: { ...settings.banner, visible: e.target.checked }
                    })
                  }
                  className="rounded border-gray-300"
                />
                <label htmlFor="bannerVisible" className="text-sm text-gray-700 cursor-pointer">
                  عرض البانر الترحيبي في الصفحة الرئيسية للتطبيق
                </label>
              </div>

              <hr className="my-3" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">رقم أحدث إصدار (Latest Version)</label>
                  <input
                    type="text"
                    value={settings.version.latest}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        version: { ...settings.version, latest: e.target.value }
                      })
                    }
                    className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    placeholder="1.0.0"
                    title="رقم الإصدار"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.version.required}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          version: { ...settings.version, required: e.target.checked }
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    تحديث إجباري
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">رسالة التنبيه بالتحديث</label>
                <input
                  type="text"
                  value={settings.version.alertMessage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      version: { ...settings.version, alertMessage: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 border rounded-lg text-sm"
                  placeholder="رسالة التنبيه بالتحديث"
                  title="رسالة التنبيه بالتحديث"
                />
              </div>
            </div>
          </div>

          <div className="col-span-full flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={settingsLoading}
              className="bg-[#1a5632] hover:bg-[#0f3d23] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {settingsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              حفظ إعدادات المظهر والهوية البصرية
            </button>
          </div>
        </div>
      )}

      {activeTab === "push" && (
        <div className="bg-white rounded-2xl border p-6 max-w-2xl mx-auto">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#c8a84e]" />
            إرسال إشعار فوري لمستخدمي الجوال (Expo Push Notifications)
          </h2>
          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">عنوان الإشعار *</label>
              <input
                type="text"
                required
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                placeholder="عنوان الرسالة القصير الذي يظهر على القفل"
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">نص الرسالة *</label>
              <textarea
                required
                value={pushBody}
                onChange={(e) => setPushBody(e.target.value)}
                placeholder="نص الإشعار التفصيلي..."
                rows={4}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>

            {/* Target filters */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="col-span-full text-xs font-semibold text-gray-500">
                استهداف فئة معينة (اختياري، اتركه فارغاً للإرسال للجميع):
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">المقاطعة الهولندية</label>
                <select
                  value={pushProvince}
                  onChange={(e) => setPushProvince(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
                  title="المقاطعة المستهدفة"
                >
                  <option value="">كل المقاطعات</option>
                  {DUTCH_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">المدينة</label>
                <input
                  type="text"
                  value={pushCity}
                  onChange={(e) => setPushCity(e.target.value)}
                  placeholder="مثال: Amsterdam, Rotterdam"
                  className="w-full px-3 py-1.5 border rounded-xl text-xs"
                  title="المدينة المستهدفة"
                />
              </div>
            </div>

            {pushResult && (
              <div
                className={`p-3 rounded-xl text-xs border ${
                  pushResult.success
                    ? "bg-green-50 text-green-800 border-green-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                {pushResult.success
                  ? `تم إرسال الإشعار بنجاح إلى ${pushResult.count} جهاز.`
                  : "فشل إرسال الإشعار. يرجى التحقق من مفاتيح Expo والاتصال بالخادم."}
              </div>
            )}

            <button
              type="submit"
              disabled={pushLoading}
              className="w-full bg-[#1a5632] hover:bg-[#0f3d23] text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm"
            >
              {pushLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              بث الإشعار الفوري الآن
            </button>
          </form>
        </div>
      )}

      {activeTab === "translations" && (
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c8a84e]" />
              تراجم تطبيق الموبايل الديناميكية
            </h2>
            <button
              onClick={() => setShowAddTrans(!showAddTrans)}
              className="bg-[#1a5632] hover:bg-[#0f3d23] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              إضافة مفتاح ترجمة
            </button>
          </div>

          {showAddTrans && (
            <form onSubmit={handleAddTranslation} className="p-4 bg-gray-50 rounded-xl border space-y-3">
              <h3 className="text-xs font-bold text-gray-700">مفتاح ترجمة جديد</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newTrans.key}
                  onChange={(e) => setNewTrans({ ...newTrans, key: e.target.value })}
                  placeholder="المفتاح (e.g. settings_title)"
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  value={newTrans.ar}
                  onChange={(e) => setNewTrans({ ...newTrans, ar: e.target.value })}
                  placeholder="الترجمة العربية"
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  value={newTrans.en}
                  onChange={(e) => setNewTrans({ ...newTrans, en: e.target.value })}
                  placeholder="الترجمة الإنجليزية"
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  value={newTrans.nl}
                  onChange={(e) => setNewTrans({ ...newTrans, nl: e.target.value })}
                  placeholder="الترجمة الهولندية"
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-[#1a5632] text-white px-4 py-1.5 rounded-lg text-xs font-semibold">
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTrans(false)}
                  className="border px-4 py-1.5 rounded-lg text-xs text-gray-500"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-gray-500 font-bold">المفتاح</th>
                  <th className="px-4 py-2 text-gray-500 font-bold">العربية</th>
                  <th className="px-4 py-2 text-gray-500 font-bold">الإنجليزية</th>
                  <th className="px-4 py-2 text-gray-500 font-bold">الهولندية</th>
                  <th className="px-4 py-2 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : translations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      لا توجد تراجم ديناميكية بعد. أضف مفتاحاً للبدء!
                    </td>
                  </tr>
                ) : (
                  translations.map((t) => (
                    <tr key={t.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-700">{t.key}</td>
                      <td className="px-4 py-3">
                        {editingTrans?.key === t.key ? (
                          <input
                            type="text"
                            value={editingTrans.ar}
                            onChange={(e) => setEditingTrans({ ...editingTrans, ar: e.target.value })}
                            className="px-2 py-1 border rounded w-full"
                            placeholder="الترجمة بالعربية"
                            title="الترجمة بالعربية"
                          />
                        ) : (
                          t.ar
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingTrans?.key === t.key ? (
                          <input
                            type="text"
                            value={editingTrans.en}
                            onChange={(e) => setEditingTrans({ ...editingTrans, en: e.target.value })}
                            className="px-2 py-1 border rounded w-full"
                            placeholder="الترجمة بالإنجليزية"
                            title="الترجمة بالإنجليزية"
                          />
                        ) : (
                          t.en
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingTrans?.key === t.key ? (
                          <input
                            type="text"
                            value={editingTrans.nl}
                            onChange={(e) => setEditingTrans({ ...editingTrans, nl: e.target.value })}
                            className="px-2 py-1 border rounded w-full"
                            placeholder="الترجمة بالهولندية"
                            title="الترجمة بالهولندية"
                          />
                        ) : (
                          t.nl
                        )}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-1.5 justify-end">
                        {editingTrans?.key === t.key ? (
                          <>
                            <button
                              onClick={handleUpdateTranslation}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="حفظ"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTrans(null)}
                              className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                              title="إلغاء"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingTrans(t)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="تعديل"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTranslation(t.key)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
