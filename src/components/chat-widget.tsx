"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { MessageSquare, X, Trash2, Send, Loader2, Sparkles, Bot, Mic, MicOff } from "lucide-react";

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

const WELCOME_MESSAGES: Record<string, string> = {
  general: "مرحباً! أنا المساعد العام للجالية السورية في هولندا. كيف يمكنني مساعدتك اليوم في شؤون الحياة اليومية والخدمات العامة؟",
  legal: "مرحباً! أنا المستشار القانوني وإجراءات اللجوء للجالية. تفضل بطرح استفساراتك حول الإقامة، لم الشمل، خطوات الـ IND، أو المعاملات القانونية في هولندا.",
  integration: "مرحباً! أنا مرشد الاندماج واللغة. يسعدني مساعدتك في كل ما يخص امتحانات الاندماج (Inburgering)، تعلم اللغة الهولندية، المدارس، وتقييم الشهادات بالاستعانة بالمنهاج الهولندي.",
  spokesperson: "مرحباً! أنا الناطق الإعلامي للجالية. يمكنني إجابتك عن أحدث مشاريع وأنشطة الجالية السورية، الفعاليات الثقافية والاجتماعية القادمة، وكيفية التطوع معنا.",
};

const SUGGESTIONS: Record<string, string[]> = {
  general: [
    "ما هي الخدمات المتاحة للاجئين؟",
    "كيف أتواصل مع إدارة الجالية؟",
    "كيف أبحث عن سكن اجتماعي؟",
  ],
  legal: [
    "ما هي شروط لم الشمل في هولندا؟",
    "كم تستغرق موافقة الـ IND عادةً؟",
    "كيف أحصل على مساعدة قانونية مجانية؟",
  ],
  integration: [
    "ما هي امتحانات الاندماج المطلوبة؟",
    "كيف أبدأ بتعلم اللغة الهولندية؟",
    "كيف أسجل أطفالي في المدارس؟",
  ],
  spokesperson: [
    "ما هي آخر مشاريع وأنشطة الجالية؟",
    "كيف أستطيع التطوع والمساهمة معكم؟",
    "هل توجد فعاليات قادمة قريبة؟",
  ],
};

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
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: WELCOME_MESSAGES[persona] || WELCOME_MESSAGES.general,
        },
      ]);
    }
  }, [messages, persona]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handlePersonaChange = (newPersona: string) => {
    setPersona(newPersona);
    setSessionId(null);
    setShowSuggestions(true);
    setMessages([
      {
        role: "assistant",
        content: WELCOME_MESSAGES[newPersona] || WELCOME_MESSAGES.general,
      },
    ]);
  };

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
        content: WELCOME_MESSAGES[persona] || WELCOME_MESSAGES.general,
      },
    ]);
  };

  // Speech-to-Text
  const startRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t("voiceNotSupported") || "متصفحك لا يدعم التسجيل الصوتي");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = locale === 'ar' ? 'ar-SA' : locale === 'nl' ? 'nl-NL' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Text-to-Speech
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(t("speechNotSupported") || "متصفحك لا يدعم التحدث الصوتي");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale === 'ar' ? 'ar-SA' : locale === 'nl' ? 'nl-NL' : 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = (content: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakText(content);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" dir={isRtl ? "rtl" : "ltr"}>
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
              title={t("close") || "إغلاق"}
              aria-label={t("close") || "إغلاق"}
              className="p-1.5 hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Persona selector tabs */}
          <div className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800/50 p-2.5 flex flex-wrap gap-1.5 justify-center">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePersonaChange(p.id)}
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
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      title={isSpeaking ? (t("stopSpeaking") || "إيقاف التحدث") : (t("speak") || "تحدث")}
                    >
                      {isSpeaking ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      {isSpeaking ? (t("stopSpeaking") || "إيقاف") : (t("speak") || "تحدث")}
                    </button>
                  )}
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
                {(SUGGESTIONS[persona] || SUGGESTIONS.general).map((q, idx) => (
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
              aria-label={t("aiClear") || "محادثة جديدة"}
              className="p-3 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-500 rounded-2xl transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={startRecording}
              disabled={isRecording || loading}
              title={isRecording ? (t("recording") || "جاري التسجيل...") : (t("startRecording") || "تسجيل صوتي")}
              aria-label={isRecording ? (t("recording") || "جاري التسجيل...") : (t("startRecording") || "تسجيل صوتي")}
              className={`p-3 rounded-2xl transition flex items-center justify-center cursor-pointer ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                  : "bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-500"
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
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
              title={t("send") || "إرسال"}
              aria-label={t("send") || "إرسال"}
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
        title={isOpen ? (t("close") || "إغلاق") : (t("aiTitle") || "المساعد الذكي")}
        aria-label={isOpen ? (t("close") || "إغلاق") : (t("aiTitle") || "المساعد الذكي")}
        className="w-14 h-14 bg-gradient-to-tr from-[#1a5632] to-[#0f3d23] hover:from-[#0f3d23] hover:to-[#0f3d23] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer border border-emerald-700/20 active:scale-95 group relative overflow-hidden"
      >
        <span className="absolute inset-0 bg-white/10 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300"></span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
