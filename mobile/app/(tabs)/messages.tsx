import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal } from "react-native";
import { useEffect, useState, useRef } from "react";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";
import { sendAIMessage, translateMessage, summarizeConversation, type AIMessage } from "../../lib/chat";

const SUGGESTED_CARDS = [
  { text: "خطوات لم الشمل بالتفصيل؟", persona: "legal", icon: "⚖️" },
  { text: "المدة المتوقعة لقرار الـ IND؟", persona: "legal", icon: "⚖️" },
  { text: "التسجيل في امتحانات الاندماج؟", persona: "integration", icon: "🎓" },
  { text: "شروط تمويل DUO للغة؟", persona: "integration", icon: "🎓" },
  { text: "التقديم على سكن اجتماعي؟", persona: "integration", icon: "💼" },
  { text: "كيفية تقييم وتعديل الشهادات؟", persona: "integration", icon: "💼" },
  { text: "آخر أخبار الجالية اليوم؟", persona: "spokesperson", icon: "📢" },
  { text: "الفعاليات القادمة والتطوع؟", persona: "spokesperson", icon: "📢" },
];

export default function MessagesScreen() {
  const { t, isRTL, locale } = useI18n();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [translatingIdx, setTranslatingIdx] = useState<number | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [persona, setPersona] = useState<string>("general");
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  async function handleSend(overrideText?: string, forcedPersona?: string) {
    const text = (overrideText || input).trim();
    if (!text || loading) return;
    setShowSuggestions(false);
    setSummary(null);
    const userMsg: AIMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const activePersona = forcedPersona || persona;

    try {
      const data = await sendAIMessage(text, sessionId || undefined, locale, activePersona);
      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("chat.aiError") }]);
    }
    setLoading(false);
  }

  async function handleTranslate(text: string, idx: number) {
    setTranslatingIdx(idx);
    try {
      const translated = await translateMessage(text, "en");
      setMessages((prev) => {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], content: copy[idx].content + `\n\n🇬🇧 ${translated}` };
        return copy;
      });
    } catch { /* ignore */ }
    setTranslatingIdx(null);
  }

  async function handleSummarize() {
    if (!sessionId) return;
    setSummarizing(true);
    try {
      const s = await summarizeConversation(sessionId, locale);
      setSummary(s);
      setShowSummary(true);
    } catch { /* ignore */ }
    setSummarizing(false);
  }

  function handleNewSession() {
    setSessionId(null);
    setMessages([]);
    setShowSuggestions(true);
    setSummary(null);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: "#fff" }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginEnd: 10 }}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
        </View>
        <Text style={{ flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.text }}>{t("chat.aiTitle")}</Text>
        {messages.length > 2 && (
          <TouchableOpacity onPress={handleSummarize} disabled={summarizing} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fef3c7", borderRadius: 8, marginEnd: 8 }}>
            {summarizing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={{ fontSize: 12, color: "#92400e", fontWeight: "600" }}>تلخيص</Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNewSession} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#f0f7f2", borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: "600" }}>{t("chat.aiClear")}</Text>
        </TouchableOpacity>
      </View>

      {/* Persona Scroll Row */}
      <View style={{ backgroundColor: "#f9fafb", borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, flexDirection: isRTL ? "row-reverse" : "row", gap: 8 }}>
          {[
            { id: "general", label: t("chat.personaGeneral") || "عام", icon: "🤖" },
            { id: "legal", label: t("chat.personaLegal") || "لجوء", icon: "⚖️" },
            { id: "integration", label: t("chat.personaIntegration") || "اندماج", icon: "🎓" },
            { id: "spokesperson", label: t("chat.personaSpokesperson") || "إعلام", icon: "📢" },
          ].map((p) => {
            const active = persona === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                onPress={() => setPersona(p.id)}
                style={{
                  flexDirection: isRTL ? "row-reverse" : "row",
                  alignItems: "center",
                  backgroundColor: active ? COLORS.primary : "#fff",
                  borderColor: active ? COLORS.primary : COLORS.border,
                  borderWidth: 1,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  gap: 6
                }}
              >
                <Text style={{ fontSize: 13 }}>{p.icon}</Text>
                <Text style={{ fontSize: 11, fontWeight: "600", color: active ? "#fff" : COLORS.text }}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary Modal */}
      <Modal visible={showSummary} transparent animationType="fade" onRequestClose={() => setShowSummary(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 8, textAlign: "center" }}>📋 ملخص المحادثة</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ fontSize: 14, lineHeight: 22, color: COLORS.text }}>{summary}</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setShowSummary(false)} style={{ marginTop: 16, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 10, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>موافق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Messages */}
      <FlatList<AIMessage>
        ref={flatRef}
        data={messages}
        keyExtractor={(_item: AIMessage, index: number) => String(index)}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          showSuggestions ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 20, paddingBottom: 20 }}>
              <Ionicons name="chatbubble-ellipses" size={40} color={COLORS.primary} style={{ opacity: 0.5, marginBottom: 8 }} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.text, marginBottom: 2 }}>{t("chat.aiTitle")}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: "center", marginBottom: 16, paddingHorizontal: 20 }}>{t("chat.aiWelcome")}</Text>
              
              {/* Quick Action Suggested Grid */}
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", flexWrap: "wrap", justifyContent: "center", gap: 8, paddingHorizontal: 16 }}>
                {SUGGESTED_CARDS.map((card, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      setPersona(card.persona);
                      handleSend(card.text, card.persona);
                    }}
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      backgroundColor: "#fff",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      gap: 6,
                      minWidth: "45%"
                    }}
                  >
                    <Text style={{ fontSize: 13 }}>{card.icon}</Text>
                    <Text style={{ fontSize: 11, color: COLORS.text, fontWeight: "500" }}>{card.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chatbubble-ellipses" size={40} color={COLORS.border} />
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 8 }}>{t("chat.noMessages")}</Text>
            </View>
          )
        }
        renderItem={({ item, index }: { item: AIMessage; index: number }) => (
          <View style={{ alignItems: item.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <View style={{ maxWidth: "80%" }}>
              <View style={{ backgroundColor: item.role === "user" ? COLORS.primary : "#fff", borderRadius: 16, borderBottomRightRadius: item.role === "user" ? 4 : 16, borderBottomLeftRadius: item.role === "user" ? 16 : 4, paddingHorizontal: 14, paddingVertical: 10, borderWidth: item.role === "user" ? 0 : 1, borderColor: COLORS.border }}>
                <Text style={{ fontSize: 14, lineHeight: 20, color: item.role === "user" ? "#fff" : COLORS.text }}>{item.content}</Text>
              </View>
              {item.role === "assistant" && (
                <TouchableOpacity onPress={() => handleTranslate(item.content, index)} disabled={translatingIdx === index} style={{ marginTop: 4, paddingHorizontal: 4 }}>
                  {translatingIdx === index ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>🇬🇧 ترجم</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <View style={{ alignItems: "flex-start", marginBottom: 10 }}>
              <View style={{ backgroundColor: "#fff", borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border }}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.textSecondary, opacity: 0.5 + i * 0.2 }}>
                      <Text> </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t("chat.aiPlaceholder")}
            placeholderTextColor={COLORS.textSecondary}
            onSubmitEditing={() => handleSend()}
            style={{ flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, textAlign: isRTL ? "right" : "left", backgroundColor: COLORS.background }}
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", opacity: !input.trim() || loading ? 0.4 : 1 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
