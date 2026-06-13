"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, useCallback } from "react";
import { Send, Search, MessageSquare, ArrowLeft, Loader2, AlertCircle, Bot, Plus, Sparkles } from "lucide-react";

interface Conversation {
  member: { id: string; nameAr: string; nameNl: string; avatar: string | null };
  lastMessage: string | null;
  unreadCount: number;
  lastMessageAt: string | null;
}

interface ChatMsg {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "ما هي أخبار الجالية اليوم؟",
  "متى موعد الفعالية القادمة؟",
  "كيف أستطيع التطوع؟",
  "ما هي الخدمات المتاحة للاجئين؟",
  "كيف أتواصل مع الإدارة؟",
];

export default function MessagesPage() {
  const { data: session } = useSession();
  const t = useTranslations("chat");
  const [mode, setMode] = useState<"users" | "ai">("users");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState("");
  const [sendError, setSendError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const fetchConversations = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/chat/conversations");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setConversations(data);
    } catch {
      setError(t("loading"));
    } finally {
      setLoadingConv(false);
    }
  }, [t]);

  const fetchMessages = useCallback(async (partnerId: string) => {
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/chat/messages?with=${partnerId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(data);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) fetchConversations();
  }, [session, fetchConversations]);

  useEffect(() => {
    if (selectedId && mode === "users") {
      fetchMessages(selectedId);
      pollingRef.current = setInterval(() => fetchMessages(selectedId), 5000);
      return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    }
  }, [selectedId, mode, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedId) return;
    setSendError("");
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: selectedId, message: input.trim() }),
      });
      if (!res.ok) throw new Error();
      setInput("");
      fetchMessages(selectedId);
      fetchConversations();
    } catch {
      setSendError(t("sendError"));
    }
  };

  const filteredConv = conversations.filter((c) => {
    const q = search.toLowerCase();
    return c.member.nameAr.includes(q) || c.member.nameNl.toLowerCase().includes(q);
  });

  const selectedMember = conversations.find((c) => c.member.id === selectedId)?.member;
  const partnerName = session?.user?.id && selectedId
    ? (conversations.find((c) => c.member.id === selectedId)?.member.nameAr || selectedId)
    : "";

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return t("justNow");
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    if (d.toDateString() === now.toDateString()) return `${hours}:${mins}`;
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden h-[calc(100vh-160px)] min-h-[500px] flex">
        {/* Sidebar */}
        <div className={`w-full sm:w-80 lg:w-96 border-l flex flex-col ${mode === "ai" || selectedId ? "hidden sm:flex" : "flex"}`}>
          {/* AI Assistant Toggle */}
          <div className="p-3 border-b">
            <button
              onClick={() => { setMode("ai"); setSelectedId(null); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${mode === "ai" ? "bg-[#1a5632] text-white" : "hover:bg-gray-50 text-gray-700"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${mode === "ai" ? "bg-white/20" : "bg-[#1a5632]/10"}`}>
                <Bot className={`w-5 h-5 ${mode === "ai" ? "text-white" : "text-[#1a5632]"}`} />
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{t("aiTitle")}</div>
                <div className={`text-xs ${mode === "ai" ? "text-white/70" : "text-gray-400"}`}>{t("aiSubtitle")}</div>
              </div>
            </button>
          </div>

          {/* Conversations Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t("title")}</h2>
            </div>
            <div className="relative mt-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="w-full pr-9 pl-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a5632]/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mode !== "ai" && loadingConv && (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin ml-2" />
                <span className="text-sm">{t("loading")}</span>
              </div>
            )}
            {mode !== "ai" && !loadingConv && error && (
              <div className="flex items-center justify-center py-12 text-red-400">
                <AlertCircle className="w-5 h-5 ml-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {mode !== "ai" && !loadingConv && !error && filteredConv.length === 0 && (
              <p className="text-center text-gray-400 py-12 text-sm">{t("noConversations")}</p>
            )}
            {mode !== "ai" && filteredConv.map((conv) => (
              <button
                key={conv.member.id}
                onClick={() => { setSelectedId(conv.member.id); setMode("users"); setMessages([]); }}
                className={`w-full text-right p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedId === conv.member.id && mode === "users" ? "bg-[#f0f7f2]" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#c8a84e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {conv.member.avatar ? (
                    <img src={conv.member.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (conv.member.nameAr || "?").charAt(0)
                  )}
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 text-sm truncate">{conv.member.nameAr}</span>
                    {conv.lastMessageAt && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0">{formatTime(conv.lastMessageAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 truncate">{conv.lastMessage || ""}</span>
                    {conv.unreadCount > 0 && (
                      <span className="bg-[#c8a84e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className={`flex-1 flex flex-col ${mode !== "ai" && !selectedId ? "hidden sm:flex" : "flex"}`}>
          {mode === "ai" ? (
            <AIChatPanel
              t={t}
              onBack={() => setMode("users")}
            />
          ) : !selectedId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t("noConversations")}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <button className="sm:hidden p-1" onClick={() => setSelectedId(null)} title={t("back") || "Back"}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-[#c8a84e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                  {selectedMember?.avatar ? (
                    <img src={selectedMember.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    (partnerName || "?").charAt(0)
                  )}
                </div>
                <span className="font-medium text-gray-900 text-sm">{partnerName}</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs && (
                  <div className="flex items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    <span className="text-sm">{t("loading")}</span>
                  </div>
                )}
                {!loadingMsgs && messages.length === 0 && (
                  <p className="text-center text-gray-400 py-12 text-sm">{t("noMessages")}</p>
                )}
                {!loadingMsgs && messages.map((msg) => {
                  const isMine = msg.senderId === session?.user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          isMine
                            ? "bg-[#1a5632] text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        {msg.message}
                        <div className={`text-[10px] mt-1 ${isMine ? "text-white/70 text-left" : "text-gray-400 text-left"}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                {sendError && (
                  <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {sendError}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={t("placeholder")}
                    className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]/20"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="bg-[#1a5632] text-white p-2.5 rounded-xl hover:bg-[#0f3d23] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    title={t("send") || "Send"}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AIChatPanel({
  t, onBack,
}: {
  t: any;
  onBack: () => void;
}) {
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [input, setInput] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [translatingIdx, setTranslatingIdx] = useState<number | null>(null);
  const [persona, setPersona] = useState<string>("general");
  const aiBottomRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAISend();
    }
  };

  useEffect(() => {
    aiBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, aiLoading]);

  const handleAISend = async (overrideText?: string, forcedPersona?: string) => {
    const text = (overrideText || input).trim();
    if (!text) return;
    setAiError("");
    setShowSuggestions(false);
    setSummary(null);

    const userMsg: AIMessage = { role: "user", content: text };
    setAiMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAiLoading(true);

    const activePersona = forcedPersona || persona;

    try {
      const res = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: aiSessionId,
          locale: "ar",
          persona: activePersona,
        }),
      });
      if (!res.ok) throw new Error(t("aiError"));
      const data = await res.json();
      setAiSessionId(data.sessionId);
      setAiMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setAiError(t("aiError"));
      setAiMessages((prev) => [...prev, { role: "assistant", content: t("aiError") }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUploadLetter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setAiLoading(true);
    setAiError("");
    setShowSuggestions(false);
    try {
      const fd = new FormData(); fd.set("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const uploadData = await res.json();
      if (!uploadData.url) throw new Error("Upload URL empty");

      setAiMessages((prev) => [...prev, { role: "user", content: `📎 [صورة مرفقة للتحليل]: ${uploadData.url}` }]);

      const analyzeRes = await fetch("/api/chat/analyze-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploadData.url, locale: "ar" }),
      });
      if (!analyzeRes.ok) throw new Error("Analysis failed");
      const analyzeData = await analyzeRes.json();
      setAiMessages((prev) => [...prev, { role: "assistant", content: analyzeData.analysis }]);
    } catch (err: any) {
      setAiError(err.message || "Failed to analyze document");
    } finally {
      setAiLoading(false);
    }
  };

  const handleTranslate = async (text: string, idx: number) => {
    setTranslatingIdx(idx);
    try {
      const res = await fetch("/api/chat/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, to: "en" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAiMessages((prev) => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], content: copy[idx].content + `\n\n🇬🇧 ${data.translated}` };
        return copy;
      });
    } catch { /* ignore */ }
    setTranslatingIdx(null);
  };

  const handleSummarize = async () => {
    if (!aiSessionId) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/chat/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: aiSessionId, locale: "ar" }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSummary(data.summary);
    } catch { /* ignore */ }
    setSummarizing(false);
  };

  const handleNewSession = () => {
    setAiSessionId(null);
    setAiMessages([]);
    setShowSuggestions(true);
    setAiError("");
    setSummary(null);
  };

  return (
    <>
      <div className="flex flex-col border-b">
        <div className="flex items-center gap-3 p-4">
          <button className="sm:hidden p-1" onClick={onBack} title="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#1a5632] flex items-center justify-center text-white flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-900 text-sm flex-1">{t("aiTitle")}</span>
          {aiMessages.length > 2 && (
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="text-xs text-[#1a5632] hover:bg-[#f0f7f2] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-40"
            >
              {summarizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              تلخيص
            </button>
          )}
          <button
            onClick={handleNewSession}
            className="text-xs text-[#1a5632] hover:bg-[#f0f7f2] px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {t("aiClear")}
          </button>
        </div>

        {/* Persona Select Tabs */}
        <div className="bg-gray-50 border-t p-2 flex gap-1.5 overflow-x-auto select-none">
          {[
            { id: "general", label: t("personaGeneral"), icon: "🤖" },
            { id: "legal", label: t("personaLegal"), icon: "⚖️" },
            { id: "integration", label: t("personaIntegration"), icon: "🎓" },
            { id: "spokesperson", label: t("personaSpokesperson"), icon: "📢" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                persona === p.id
                  ? "bg-[#1a5632] border-[#1a5632] text-white shadow-sm"
                  : "bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {showSuggestions && aiMessages.length === 0 && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-3 text-[#1a5632] opacity-80" />
              <p className="text-gray-900 font-bold text-base mb-1">{t("aiTitle")}</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">{t("aiWelcome")}</p>
            </div>

            {/* Quick Action Guides Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto px-2">
              <div className="p-4 rounded-2xl border bg-gradient-to-br from-emerald-50/50 to-white hover:shadow-md hover:border-emerald-100 transition-all duration-300">
                <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2 mb-2">
                  <span>⚖️</span>
                  <span>{t("personaLegal")}</span>
                </h4>
                <div className="flex flex-col gap-1.5 text-right">
                  <button onClick={() => handleAISend("ما هي خطوات لم الشمل بالتفصيل في هولندا؟", "legal")} className="text-xs text-gray-600 hover:text-emerald-800 hover:underline text-right block w-full">← خطوات لم الشمل بالتفصيل؟</button>
                  <button onClick={() => handleAISend("كم المدة الزمنية المتوقعة لقرار IND؟", "legal")} className="text-xs text-gray-600 hover:text-emerald-800 hover:underline text-right block w-full">← المدة المتوقعة لقرار الـ IND؟</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border bg-gradient-to-br from-blue-50/50 to-white hover:shadow-md hover:border-blue-100 transition-all duration-300">
                <h4 className="font-bold text-sm text-blue-900 flex items-center gap-2 mb-2">
                  <span>🎓</span>
                  <span>{t("personaIntegration")}</span>
                </h4>
                <div className="flex flex-col gap-1.5 text-right">
                  <button onClick={() => handleAISend("كيف أسجل في امتحانات الاندماج (Inburgering)؟", "integration")} className="text-xs text-gray-600 hover:text-blue-800 hover:underline text-right block w-full">← التسجيل في امتحانات الاندماج؟</button>
                  <button onClick={() => handleAISend("ما هي شروط تمويل DUO لدراسة اللغة؟", "integration")} className="text-xs text-gray-600 hover:text-blue-800 hover:underline text-right block w-full">← شروط وقروض تمويل DUO؟</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border bg-gradient-to-br from-amber-50/50 to-white hover:shadow-md hover:border-amber-100 transition-all duration-300">
                <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2 mb-2">
                  <span>💼</span>
                  <span>العمل والسكن الاجتماعي</span>
                </h4>
                <div className="flex flex-col gap-1.5 text-right">
                  <button onClick={() => handleAISend("كيف أقدم على سكن اجتماعي في هولندا؟", "integration")} className="text-xs text-gray-600 hover:text-amber-800 hover:underline text-right block w-full">← التقديم على سكن اجتماعي؟</button>
                  <button onClick={() => handleAISend("ما هي متطلبات تعديل شهادتي السورية؟", "integration")} className="text-xs text-gray-600 hover:text-amber-800 hover:underline text-right block w-full">← كيفية تقييم وتعديل الشهادات؟</button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border bg-gradient-to-br from-purple-50/50 to-white hover:shadow-md hover:border-purple-100 transition-all duration-300">
                <h4 className="font-bold text-sm text-purple-900 flex items-center gap-2 mb-2">
                  <span>📢</span>
                  <span>{t("personaSpokesperson")}</span>
                </h4>
                <div className="flex flex-col gap-1.5 text-right">
                  <button onClick={() => handleAISend("ما هي آخر أخبار الجالية السورية اليوم؟", "spokesperson")} className="text-xs text-gray-600 hover:text-purple-800 hover:underline text-right block w-full">← آخر أخبار الجالية اليوم؟</button>
                  <button onClick={() => handleAISend("هل توجد فعاليات اجتماعية قادمة للجالية؟", "spokesperson")} className="text-xs text-gray-600 hover:text-purple-800 hover:underline text-right block w-full">← الفعاليات القادمة للتسجيل؟</button>
                </div>
              </div>
            </div>

            {/* Document Analyzer Trigger Card */}
            <div className="max-w-2xl mx-auto p-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 transition-all flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right px-6">
              <div className="w-12 h-12 rounded-full bg-[#1a5632]/10 text-[#1a5632] flex items-center justify-center shrink-0">
                <Plus className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-800">{t("analyzeDocument")}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{t("uploadDocument")}</p>
              </div>
              <label className="shrink-0 bg-[#1a5632] hover:bg-[#0f3d23] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm">
                <span>اختر صورة المستند</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadLetter} />
              </label>
            </div>
          </div>
        )}

        {summary && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
            <p className="font-bold text-xs mb-1 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> ملخص المحادثة</p>
            <p>{summary}</p>
          </div>
        )}

        {aiMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
            <div className="max-w-[80%]">
              <div
                className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#1a5632] text-white rounded-br-md"
                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                }`}
              >
                {msg.content.startsWith("📎 [صورة مرفقة للتحليل]: ") ? (
                  <div className="space-y-2">
                    <span className="block text-xs opacity-80">📎 خطاب مرفق للتحليل:</span>
                    <img
                      src={msg.content.replace("📎 [صورة مرفقة للتحليل]: ", "")}
                      alt="Uploaded Document"
                      className="max-w-full rounded-lg max-h-48 object-cover border border-white/20"
                    />
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "assistant" && (
                <div className="flex gap-1 mt-1 px-1">
                  <button
                    onClick={() => handleTranslate(msg.content, i)}
                    disabled={translatingIdx === i}
                    className="text-[10px] text-gray-400 hover:text-[#1a5632] transition-colors flex items-center gap-0.5"
                  >
                    {translatingIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : "🇬🇧"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {aiLoading && (
          <div className="flex justify-end">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce animation-delay-0" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce animation-delay-150" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce animation-delay-300" />
              </div>
            </div>
          </div>
        )}

        <div ref={aiBottomRef} />
      </div>

      <div className="p-4 border-t">
        {aiError && !aiLoading && (
          <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {aiError}
          </p>
        )}
        <div className="flex items-center gap-2">
          {/* Document Analyzer Icon Button */}
          <label className="shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-xl cursor-pointer transition-colors border flex items-center justify-center" title={t("analyzeDocument")}>
            <Plus className="w-5 h-5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleUploadLetter} disabled={aiLoading} title={t("analyzeDocument") || "Upload letter"} />
          </label>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("aiPlaceholder")}
            className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]/20"
            disabled={aiLoading}
          />
          <button
            onClick={() => handleAISend()}
            disabled={!input.trim() || aiLoading}
            className="bg-[#1a5632] text-white p-2.5 rounded-xl hover:bg-[#0f3d23] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </>
  );
}
