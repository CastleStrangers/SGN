"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Smartphone, Send, Save, Palette, Bell, Globe, Plus, Trash2, Edit3, Check, Loader2, X } from "lucide-react";

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
  const t = useTranslations("mobileControl");
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
        const list: Translation[] = [];
        const arKeys = Object.keys(data.ar || {});
        arKeys.forEach((key, idx) => {
          list.push({
            id: String(idx),
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
        alert(t("successSettings"));
      } else {
        alert(t("failSettings"));
      }
    } catch (e) {
      alert(t("serverError"));
    }
    setSettingsLoading(false);
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushBody.trim()) {
      alert(t("fillPushFields"));
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
      alert(t("fillTransFields"));
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
        alert(err.error || t("failAddKey"));
      }
    } catch (e) {
      alert(t("serverError"));
    }
  };

  const handleUpdateTranslation = async () => {
    if (!editingTrans) return;
    try {
      const res = await fetch("/api/mobile/translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingTrans.key,
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
        alert(t("failUpdateKey"));
      }
    } catch (e) {
      alert(t("serverError"));
    }
  };

  const handleDeleteTranslation = async (key: string) => {
    if (!confirm(t("deleteConfirm", { key }))) return;
    try {
      const res = await fetch("/api/mobile/translations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: key })
      });
      if (res.ok) {
        fetchTranslations();
      } else {
        alert(t("failDeleteKey"));
      }
    } catch (e) {
      alert(t("connectionError"));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Smartphone className="w-7 h-7 text-[#1a5632]" />
          {t("pageTitle")}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{t("pageDesc")}</p>
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
          {t("tabAppearance")}
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
          {t("tabPush")}
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
          {t("tabTranslations")}
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Settings */}
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#c8a84e]" />
              {t("visualIdentity")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("primaryColor")}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.primary}
                    onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title={t("primaryColorLabel")}
                    aria-label={t("primaryColorLabel")}
                  />
                  <input
                    type="text"
                    value={theme.primary}
                    onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-xs border rounded-lg"
                    placeholder="#1a5632"
                    title={t("primaryColorCode")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("accentColor")}</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.accent}
                    onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
                    className="w-8 h-8 rounded border cursor-pointer"
                    title={t("accentColorLabel")}
                    aria-label={t("accentColorLabel")}
                  />
                  <input
                    type="text"
                    value={theme.accent}
                    onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
                    className="flex-1 px-2.5 py-1 text-xs border rounded-lg"
                    placeholder="#c8a84e"
                    title={t("accentColorCode")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Settings */}
          <div className="bg-white rounded-2xl border p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#1a5632]" />
              {t("bannerSection")}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("bannerTitle")}</label>
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
                  placeholder={t("bannerTitlePlaceholder")}
                  title={t("bannerTitle")}
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
                  {t("showBanner")}
                </label>
              </div>

              <hr className="my-3" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{t("latestVersion")}</label>
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
                    title={t("versionLabel")}
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
                    {t("forceUpdate")}
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("alertMessage")}</label>
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
                  placeholder={t("alertMessagePlaceholder")}
                  title={t("alertMessage")}
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
              {t("saveSettings")}
            </button>
          </div>
        </div>
      )}

      {activeTab === "push" && (
        <div className="bg-white rounded-2xl border p-6 max-w-2xl mx-auto">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#c8a84e]" />
            {t("pushTitle")}
          </h2>
          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t("pushLabel")}</label>
              <input
                type="text"
                required
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                placeholder={t("pushPlaceholder")}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">{t("messageLabel")}</label>
              <textarea
                required
                value={pushBody}
                onChange={(e) => setPushBody(e.target.value)}
                placeholder={t("messagePlaceholder")}
                rows={4}
                className="w-full px-4 py-2 border rounded-xl text-sm"
              />
            </div>

            {/* Target filters */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="col-span-full text-xs font-semibold text-gray-500">
                {t("targetLabel")}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("provinceLabel")}</label>
                <select
                  value={pushProvince}
                  onChange={(e) => setPushProvince(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
                  title={t("provinceTitle")}
                >
                  <option value="">{t("allProvinces")}</option>
                  {DUTCH_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t("cityLabel")}</label>
                <input
                  type="text"
                  value={pushCity}
                  onChange={(e) => setPushCity(e.target.value)}
                  placeholder={t("cityPlaceholder")}
                  className="w-full px-3 py-1.5 border rounded-xl text-xs"
                  title={t("cityTitle")}
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
                  ? t("pushSuccess", { count: pushResult.count })
                  : t("pushFail")}
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
              {t("sendPush")}
            </button>
          </form>
        </div>
      )}

      {activeTab === "translations" && (
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c8a84e]" />
              {t("transTitle")}
            </h2>
            <button
              onClick={() => setShowAddTrans(!showAddTrans)}
              className="bg-[#1a5632] hover:bg-[#0f3d23] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("addKey")}
            </button>
          </div>

          {showAddTrans && (
            <form onSubmit={handleAddTranslation} className="p-4 bg-gray-50 rounded-xl border space-y-3">
              <h3 className="text-xs font-bold text-gray-700">{t("newKey")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  value={newTrans.key}
                  onChange={(e) => setNewTrans({ ...newTrans, key: e.target.value })}
                  placeholder={t("keyPlaceholder")}
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  value={newTrans.ar}
                  onChange={(e) => setNewTrans({ ...newTrans, ar: e.target.value })}
                  placeholder={t("arPlaceholder")}
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  value={newTrans.en}
                  onChange={(e) => setNewTrans({ ...newTrans, en: e.target.value })}
                  placeholder={t("enPlaceholder")}
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
                <input
                  type="text"
                  required
                  value={newTrans.nl}
                  onChange={(e) => setNewTrans({ ...newTrans, nl: e.target.value })}
                  placeholder={t("nlPlaceholder")}
                  className="px-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-[#1a5632] text-white px-4 py-1.5 rounded-lg text-xs font-semibold">
                  {t("addBtn")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTrans(false)}
                  className="border px-4 py-1.5 rounded-lg text-xs text-gray-500"
                >
                  {t("cancelBtn")}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-gray-500 font-bold">{t("keyHeader")}</th>
                  <th className="px-4 py-2 text-gray-500 font-bold">{t("arHeader")}</th>
                  <th className="px-4 py-2 text-gray-500 font-bold">{t("enHeader")}</th>
                  <th className="px-4 py-2 text-gray-500 font-bold">{t("nlHeader")}</th>
                  <th className="px-4 py-2 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      {t("loading")}
                    </td>
                  </tr>
                ) : translations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      {t("noTranslations")}
                    </td>
                  </tr>
                ) : (
                  translations.map((tx) => (
                    <tr key={tx.key} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-700">{tx.key}</td>
                      <td className="px-4 py-3">
                        {editingTrans?.key === tx.key ? (
                          <input
                            type="text"
                            value={editingTrans.ar}
                            onChange={(e) => setEditingTrans({ ...editingTrans, ar: e.target.value })}
                            className="px-2 py-1 border rounded w-full"
                            placeholder={t("arPlaceholder")}
                            title={t("arPlaceholder")}
                          />
                        ) : (
                          tx.ar
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingTrans?.key === tx.key ? (
                          <input
                            type="text"
                            value={editingTrans.en}
                            onChange={(e) => setEditingTrans({ ...editingTrans, en: e.target.value })}
                            className="px-2 py-1 border rounded w-full"
                            placeholder={t("enPlaceholder")}
                            title={t("enPlaceholder")}
                          />
                        ) : (
                          tx.en
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingTrans?.key === tx.key ? (
                          <input
                            type="text"
                            value={editingTrans.nl}
                            onChange={(e) => setEditingTrans({ ...editingTrans, nl: e.target.value })}
                            className="px-2 py-1 border rounded w-full"
                            placeholder={t("nlPlaceholder")}
                            title={t("nlPlaceholder")}
                          />
                        ) : (
                          tx.nl
                        )}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-1.5 justify-end">
                        {editingTrans?.key === tx.key ? (
                          <>
                            <button
                              onClick={handleUpdateTranslation}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title={t("saveTitle")}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingTrans(null)}
                              className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                              title={t("cancelTitle")}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingTrans(tx)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title={t("editTitle")}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTranslation(tx.key)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title={t("deleteTitle")}
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
