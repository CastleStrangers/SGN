"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MessageSquare, X, Trash2, Send, Loader2, Sparkles, Bot } from "lucide-react";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

const PERSONAS = [
  { id: "general", labelKey: "personaGeneral" },
  { id: "legal", labelKey: "personaLegal" },
  { id: "integration", labelKey: "personaIntegration" },
  { id: "spokesperson", labelKey: "personaSpokesperson" },
];

const SUGGESTED_QUESTIONS = [
  "ما هي أخبار الجالية اليوم؟",
  "متى موعد الفعالية القادمة؟",
  "كيف أستطيع التطوع؟",
  "كيف أتواصل مع الإدارة؟",
];

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [persona, setPersona] = useState<string>("general");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: t("aiWelcome") || "مرحباً! أنا المساعد الذكي للجالية السورية في هولندا. كيف يمكنني مساعدتك اليوم؟",
        },
      ]);
    }
  }, [messages, t]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    setLoading(true);
    setInput("");
    setShowSuggestions(false);

    // Append user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId,
          locale: locale,
          persona: persona,
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("aiError") || "عذراً، حدث خطأ. حاول مرة أخرى." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSessionId(null);
    setShowSuggestions(true);
    setMessages([
      {
        role: "assistant",
        content: t("aiWelcome") || "مرحباً! أنا المساعد الذكي للجالية السورية في هولندا. كيف يمكنني مساعدتك اليوم؟",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      {/* Popover Window */}
      {isOpen && (
        <div
          className={`mb-4 w-96 max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 opacity-100 ${
            isRtl ? "origin-bottom-left" : "origin-bottom-right"
          }`}
        >
          {/* Header */}
          <div className="bg-[#1a5632] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">{t("aiTitle") || "المساعد الذكي"}</h3>
                <p className="text-[10px] text-emerald-200/80 mt-0.5 font-medium">
                  {t("aiSubtitle") || "أسئلتك عن الجالية، الأخبار، الخدمات، والفعاليات"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Persona selector tabs */}
          <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800/50 p-2 flex gap-1 overflow-x-auto scrollbar-none">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  persona === p.id
                    ? "bg-[#1a5632] text-white shadow-sm"
                    : "bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                }`}
              >
                {t(p.labelKey) || p.id}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-950/20">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.role === "user" ? (isRtl ? "mr-auto flex-row-reverse" : "ml-auto") : (isRtl ? "ml-auto" : "mr-auto flex-row-reverse")
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1a5632] text-white rounded-br-none"
                      : "bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-zinc-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="m-0 whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 max-w-[80%] ml-auto">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                </div>
                <div className="p-3.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-xs text-gray-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1a5632]" />
                  <span>{t("aiThinking") || "جارٍ كتابة الرد..."}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions Panel */}
          {showSuggestions && (
            <div className="p-3 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900">
              <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">
                {t("aiSuggested") || "أسئلة مقترحة"}:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 rounded-xl text-[10px] font-semibold transition border border-emerald-100/50 dark:border-emerald-900/10 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 flex gap-2">
            <button
              onClick={handleClear}
              title={t("aiClear") || "محادثة جديدة"}
              className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-500 rounded-2xl transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("aiPlaceholder") || "اسأل المساعد الذكي..."}
              className="flex-1 bg-gray-50 dark:bg-zinc-900 text-xs px-4 py-3 rounded-2xl border border-gray-100 dark:border-zinc-800 focus:outline-none focus:border-emerald-700 dark:focus:border-emerald-600 focus:ring-1 focus:ring-emerald-700 dark:focus:ring-emerald-600 transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 bg-[#1a5632] hover:bg-[#0f3d23] disabled:opacity-50 text-white rounded-2xl transition flex items-center justify-center cursor-pointer shadow-md shadow-emerald-950/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-[#1a5632] to-[#0f3d23] hover:from-[#0f3d23] hover:to-[#0f3d23] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer border border-emerald-700/20 active:scale-95 group relative overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
