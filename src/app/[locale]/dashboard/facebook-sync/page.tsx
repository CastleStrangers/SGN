"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl";
import {
  Facebook,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Download,
  ExternalLink,
  Info,
  Loader2,
} from "lucide-react"

interface SyncStatus {
  configured: boolean
  pageId: string | null
  pageSlug: string
  tokenValid: boolean
  hasPageAccess: boolean
  tokenScopes: string[]
  errorMsg: string
  authUrl: string
  appId: string
}

interface SyncResult {
  success: boolean
  message: string
  fetched?: number
  new?: number
  skipped?: number
  errors?: string[]
}

export default function FacebookSyncPage() {
  const t = useTranslations("dashboard.fbSyncPage");
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [since, setSince] = useState("2026-05-14")
  const [result, setResult] = useState<SyncResult | null>(null)
  const [newToken, setNewToken] = useState("")
  const [savingToken, setSavingToken] = useState(false)
  const [tokenMsg, setTokenMsg] = useState("")

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    setLoading(true)
    try {
      const res = await fetch("/api/sync/facebook")
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus(null)
    }
    setLoading(false)
  }

  async function runSync() {
    setSyncing(true)
    setResult(null)
    try {
      const res = await fetch("/api/sync/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", since }),
      })
      const data = await res.json()
      setResult(data.error ? { success: false, message: data.error } : data)
    } catch (e) {
      setResult({ success: false, message: t("connError") })
    }
    setSyncing(false)
  }

  async function verifyToken() {
    if (!newToken.trim()) return
    setSavingToken(true)
    setTokenMsg("")
    try {
      const res = await fetch("/api/sync/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_token", token: newToken.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setTokenMsg(`✅ ${t("tokenValid")}${data.scopes?.join(", ")}`)
      } else {
        setTokenMsg(`❌ ${data.error}`)
      }
    } catch {
      setTokenMsg(`❌ ${t("verifyFailed")}`)
    }
    setSavingToken(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a5632]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#1877f2]/10 to-blue-50 rounded-2xl border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#1877f2] flex items-center justify-center">
            <Facebook className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t("title")}</h1>
            <p className="text-sm text-gray-500">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <a
          href="https://www.facebook.com/DeSyrischeGemeenschapInNederland"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-[#1877f2] hover:underline mt-2"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          facebook.com/DeSyrischeGemeenschapInNederland
        </a>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">{t("setupStatus")}</h2>
          <button
            onClick={fetchStatus}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> {t("refresh")}
          </button>
        </div>

        <div className="space-y-3">
          <StatusRow
            label="Page ID"
            value={status?.pageId || t("notSet")}
            ok={!!status?.pageId}
          />
          <StatusRow
            label="Facebook Token"
            value={status?.tokenValid ? t("valid") : status?.errorMsg || t("notSet")}
            ok={status?.tokenValid ?? false}
          />
          <StatusRow
            label={t("pageReadAccess")}
            value={
              status?.hasPageAccess
                ? t("available")
                : t("notAvailable")
            }
            ok={status?.hasPageAccess ?? false}
            warning={!status?.hasPageAccess && status?.tokenValid}
          />
          {status?.tokenScopes && status.tokenScopes.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
              {t("currentPermissions")}{status.tokenScopes.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Get Proper Token Section */}
      {!status?.hasPageAccess && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-3">
                الـ Token غير صالح أو منتهي الصلاحية
              </h3>

              <p className="text-sm text-amber-800 mb-4">
                لقد قمنا بتسهيل العملية لتتم بضغطة زر واحدة! اضغط على الزر أدناه لتسجيل الدخول بحساب فيسبوك الذي يدير الصفحة، وسيقوم النظام بجلب الصلاحيات والتوكن وحفظه تلقائياً.
              </p>

              <a
                href="/api/auth/facebook-page"
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-[#1877f2] text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Facebook className="w-5 h-5" />
                تسجيل الدخول وجلب التوكن تلقائياً
              </a>
              <p className="mt-3 text-xs text-amber-700/70">
                ملاحظة: سيتم طلب صلاحيات قراءة المنشورات (pages_read_engagement).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Token Input */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-gray-500" />
          {t("verifyNewToken")}
        </h3>
        <div className="flex gap-2">
          <input
            type="password"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder={t("pasteTokenPlaceholder")}
            className="flex-1 border rounded-xl px-4 py-2.5 text-sm font-mono"
          />
          <button
            onClick={verifyToken}
            disabled={savingToken || !newToken.trim()}
            className="px-4 py-2.5 bg-[#1a5632] text-white text-sm rounded-xl hover:bg-[#0f3d23] disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {savingToken ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {t("verifyBtn")}
          </button>
        </div>
        {tokenMsg && (
          <p className={`mt-2 text-sm ${tokenMsg.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {tokenMsg}
          </p>
        )}
        {tokenMsg.includes("✅") && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
            <p className="font-medium mb-1">{t("addEnvLine")}<code>.env</code>:</p>
            <code className="block bg-white border rounded p-2 text-xs font-mono select-all">
              FACEBOOK_PAGE_TOKEN=&quot;{newToken}&quot;
            </code>
            <p className="mt-2 text-xs text-green-600">{t("restartServer")}</p>
          </div>
        )}
      </div>

      {/* Sync Controls */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-gray-500" />
          {t("importSection")}
        </h2>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm text-gray-700 whitespace-nowrap">{t("importSince")}</label>
          <input
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={runSync}
          disabled={syncing || !status?.hasPageAccess}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1877f2] text-white rounded-xl text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {syncing ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t("importing")}</>
          ) : (
            <><Facebook className="w-4 h-4" /> {t("importBtn")}</>
          )}
        </button>

        {!status?.hasPageAccess && (
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {t("needsToken")}
          </p>
        )}

        {/* Result */}
        {result && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`font-medium text-sm ${result.success ? "text-green-800" : "text-red-800"}`}
                >
                  {result.message}
                </p>
                {result.success && (
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    <span>📥 {t("fetched")}{result.fetched}</span>
                    <span>✅ {t("new")}{result.new}</span>
                    <span>⏭️ {t("skipped")}{result.skipped}</span>
                  </div>
                )}
                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-2 text-xs text-red-700 space-y-1">
                    {result.errors.map((e, i) => (
                      <li key={i}>• {e}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex items-start gap-2 text-sm text-blue-700">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">{t("howItWorks")}</p>
            <p className="text-xs text-blue-600">
              {t("howItWorksDesc")}
              {process.env.NEXT_PUBLIC_HAS_OPENAI
                ? t("usesChatGpt")
                : t("addApiKey")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusRow({
  label,
  value,
  ok,
  warning,
}: {
  label: string
  value: string
  ok: boolean
  warning?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900 text-left">{value}</span>
        {ok ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : warning ? (
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400" />
        )}
      </div>
    </div>
  )
}
