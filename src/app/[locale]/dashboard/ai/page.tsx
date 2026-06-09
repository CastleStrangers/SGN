"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Sparkles, Send, Bot, Loader2, Languages, BarChart3, Newspaper, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type Tab = "suggest" | "news" | "translate" | "sentiment";

export default function AIPage() {
  const { status } = useSession();
  const t = useTranslations("dashboard.aiPage");
  const [tab, setTab] = useState<Tab>("suggest");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const [postId, setPostId] = useState("");
  const [posts, setPosts] = useState<{ id: string; title: string }[]>([]);
  const [translateFrom, setTranslateFrom] = useState("ar");
  const [translateTo, setTranslateTo] = useState("nl");
  const [translateText, setTranslateText] = useState("");

  useEffect(() => {
    fetch("/api/news?limit=50")
      .then(r => r.json())
      .then(d => setPosts(Array.isArray(d) ? d.map((p: any) => ({ id: p.id, title: p.title })) : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      let url = "/api/ai/suggest";
      let body: any = {};

      if (tab === "suggest") {
        url = "/api/ai/suggest";
        body = { action: "suggest", prompt };
      } else if (tab === "news") {
        url = "/api/ai/news";
        body = { action: "summarize", postId, from: "ar" };
      } else if (tab === "translate") {
        url = "/api/ai/news";
        body = { action: "translate", content: translateText, from: translateFrom, to: translateTo };
      } else if (tab === "sentiment") {
        url = "/api/ai/sentiment";
        body = { action: "analyze-all" };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || t("errorGeneric")); setResult(data.result || ""); }
      else { setResult(data.result); }
    } catch { setError(t("errorConn")); }
    setLoading(false);
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "suggest", label: t("suggestTab"), icon: Sparkles },
    { key: "news", label: t("summariseTab"), icon: Newspaper },
    { key: "translate", label: t("translateTab"), icon: Languages },
    { key: "sentiment", label: t("sentimentTab"), icon: BarChart3 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-6">{t("desc")}</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm border transition-colors ${
              tab === t.key ? "bg-[#1a5632] text-white border-[#1a5632]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Input forms */}
      <div className="bg-white rounded-2xl border p-4 mb-6">
        {tab === "suggest" && (
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={t("suggestPlaceholder")}
              className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        )}

        {tab === "news" && (
          <div className="space-y-3">
            <select
              value={postId}
              onChange={e => setPostId(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            >
              <option value="">{t("articleSelect")}</option>
              {posts.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={loading || !postId}
              className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Newspaper className="w-4 h-4" />}
              {t("summariseBtn")}
            </button>
            <button
              onClick={async () => {
                setLoading(true); setError(""); setResult("");
                try {
                  const res = await fetch("/api/ai/news", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "batch-summarize" }),
                  });
                  const data = await res.json();
                  if (!res.ok) { setError(data.error); }
                  else { setResult(t("summariseSuccess", { count: data.results?.length || 0 })); }
                } catch { setError(t("errorConn")); }
                setLoading(false);
              }}
              disabled={loading}
              className="flex items-center gap-2 bg-[#c8a84e] hover:bg-[#b8973f] text-[#1a1a2e] px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 mr-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {t("summariseAllBtn")}
            </button>
          </div>
        )}

        {tab === "translate" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <select value={translateFrom} onChange={e => setTranslateFrom(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm">
                <option value="ar">{t("arabic")}</option>
                <option value="nl">{t("dutch")}</option>
                <option value="en">{t("english")}</option>
              </select>
              <ArrowRight className="w-5 h-5 text-gray-400 self-center" />
              <select value={translateTo} onChange={e => setTranslateTo(e.target.value)} className="px-3 py-2.5 border rounded-xl text-sm">
                <option value="nl">{t("dutch")}</option>
                <option value="ar">{t("arabic")}</option>
                <option value="en">{t("english")}</option>
              </select>
            </div>
            <textarea
              value={translateText}
              onChange={e => setTranslateText(e.target.value)}
              placeholder={t("translatePlaceholder")}
              rows={4}
              className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !translateText.trim()}
              className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />}
              {t("translateBtn")}
            </button>
          </div>
        )}

        {tab === "sentiment" && (
          <div>
            <p className="text-sm text-gray-500 mb-3">{t("sentimentDesc")}</p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
              {t("sentimentBtn")}
            </button>
          </div>
        )}
      </div>

      {error && <div className="bg-amber-50 text-amber-700 p-4 rounded-xl text-sm mb-4 border border-amber-200">{error}</div>}

      {result && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-[#1a5632]" />
            <span className="font-bold text-gray-900">{t("result")}</span>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
}
