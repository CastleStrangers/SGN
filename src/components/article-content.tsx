"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Languages, RotateCcw, Lock, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ArticleContentProps {
  originalTitle: string;
  originalExcerpt: string | null;
  originalContent: string;
  locale: string;
  isLoggedIn: boolean;
  membersOnly: boolean;
  tSource: string;
  postSource: string | null;
  children?: React.ReactNode;
}

export function ArticleContent({
  originalTitle,
  originalExcerpt,
  originalContent,
  locale,
  isLoggedIn,
  membersOnly,
  tSource,
  postSource,
  children,
}: ArticleContentProps) {
  const t = useTranslations("newsPage");
  const [translated, setTranslated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(originalTitle);
  const [excerpt, setExcerpt] = useState(originalExcerpt);
  const [content, setContent] = useState(originalContent);

  const isArabic = (text: string) => {
    return /[\u0600-\u06FF]/.test(text);
  };

  const showTranslateButton = locale !== "ar" && isArabic(originalTitle);

  const handleTranslate = async () => {
    if (translated) {
      setTitle(originalTitle);
      setExcerpt(originalExcerpt);
      setContent(originalContent);
      setTranslated(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [titleRes, excerptRes, contentRes] = await Promise.all([
        fetch("/api/ai/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "translate", content: originalTitle, from: "ar", to: locale })
        }).then(r => r.json()),
        originalExcerpt ? fetch("/api/ai/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "translate", content: originalExcerpt, from: "ar", to: locale })
        }).then(r => r.json()) : Promise.resolve({ result: "" }),
        fetch("/api/ai/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "translate", content: originalContent, from: "ar", to: locale })
        }).then(r => r.json()),
      ]);

      if (titleRes.error || contentRes.error) {
        throw new Error(titleRes.error || contentRes.error || "Translation failed");
      }

      setTitle(titleRes.result || originalTitle);
      if (originalExcerpt) {
        setExcerpt(excerptRes.result || originalExcerpt);
      }
      setContent(contentRes.result || originalContent);
      setTranslated(true);
    } catch (err: any) {
      setError(t("translateError"));
      console.error("Translation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return t("translateBtnLoading");
    if (translated) return t("translateBtnRevert");
    return t("translateBtn");
  };

  const contentHtml = content.replace(/\n/g, "<br/>");

  return (
    <div>
      {showTranslateButton && (
        <div className="mb-6 flex flex-wrap gap-2 items-center justify-between p-3.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 rounded-2xl animate-pulse-subtle">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-800 dark:text-purple-300">
              {t("translatePrompt")}
            </p>
          </div>
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            {translated ? <RotateCcw className="w-3.5 h-3.5" /> : <Languages className="w-3.5 h-3.5" />}
            <span>{getButtonText()}</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
        {title}
      </h1>

      {excerpt && (
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium leading-relaxed border-r-4 border-[#c8a84e] pr-4">
          {excerpt}
        </p>
      )}

      {membersOnly && !isLoggedIn ? (
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800/60 p-6 md:p-8 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="text-gray-400 leading-8 text-base md:text-lg space-y-4 select-none blur-[5px] pointer-events-none opacity-30">
            <p>{originalContent.slice(0, 200)}...</p>
            <p>{originalContent.slice(0, 200)}...</p>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/95 to-white/30 dark:from-gray-950 dark:via-gray-950/95 dark:to-gray-950/30 pt-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#1a5632]/10 flex items-center justify-center text-[#1a5632] mb-4 shadow-inner border border-[#1a5632]/5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("membersOnlyTitle")}
            </h3>
            <p className="text-gray-505 dark:text-gray-400 text-sm max-w-sm mb-6 leading-relaxed px-4">
              {t("membersOnlyDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs px-4">
              <Link
                href="/login"
                className="flex-1 bg-[#1a5632] hover:bg-[#0f3d23] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md text-center flex items-center justify-center gap-1.5"
              >
                <span>{t("loginButton")}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-xl text-sm transition-all border border-gray-200 dark:border-gray-700 text-center"
              >
                {t("signupButton")}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-gray-800 dark:text-gray-200 leading-8 text-base md:text-lg space-y-4" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          {postSource && (
            <p className="mt-8 text-sm text-gray-400 dark:text-gray-500 pt-4 border-t">
              {tSource} {postSource}
            </p>
          )}
          {children}
        </>
      )}
    </div>
  );
}
