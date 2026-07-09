import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal, Image, Alert } from "react-native";
import { useEffect, useState, useRef } from "react";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";
import { sendAIMessage, translateMessage, summarizeConversation, type AIMessage } from "../../lib/chat";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import * as Audio from "expo-av";
import { getToken } from "../../lib/api";
import { CONFIG } from "../../constants/config";

const API_URL = CONFIG.API_URL;

const SUGGESTED_CARDS = [
  { key: "cardFamilyReunification", promptKey: "promptFamilyReunification", persona: "legal", icon: "⚖️" },
  { key: "cardIndTimeframe", promptKey: "promptIndTimeframe", persona: "legal", icon: "⚖️" },
  { key: "cardIntegrationExams", promptKey: "promptIntegrationExams", persona: "integration", icon: "🎓" },
  { key: "cardDuoFunding", promptKey: "promptDuoFunding", persona: "integration", icon: "🎓" },
  { key: "cardSocialHousing", promptKey: "promptSocialHousing", persona: "employment", icon: "🏠" },
  { key: "cardEvaluateDegree", promptKey: "promptEvaluateDegree", persona: "employment", icon: "🎓" },
  { key: "cardCommunityNews", promptKey: "promptCommunityNews", persona: "spokesperson", icon: "📢" },
  { key: "cardUpcomingEvents", promptKey: "promptUpcomingEvents", persona: "spokesperson", icon: "📢" },
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
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, sources: data.sources }]);
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

  // Speech-to-Text
  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t("common.error") || "ERROR", t("chat.microphonePermissionRequired") || "يجب السماح بالوصول للميكروفون");
        return;
      }

      setIsRecording(true);
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // Simulate recording for 5 seconds then stop
      setTimeout(async () => {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          // For now, just show a message that speech-to-text requires backend processing
          Alert.alert(t("chat.recordingComplete") || "تم التسجيل", t("chat.sttRequiresBackend") || "تحويل الصوت إلى نص يتطلب معالجة من الخادم");
        }
      }, 5000);
    } catch (error) {
      console.error(error);
      setIsRecording(false);
      Alert.alert(t("common.error") || "ERROR", t("chat.recordingError") || "فشل التسجيل الصوتي");
    }
  }

  // Text-to-Speech
  async function speakText(text: string) {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await Speech.speak(text, {
        language: locale === 'ar' ? 'ar-SA' : locale === 'nl' ? 'nl-NL' : 'en-US',
        rate: 0.9,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSpeaking(false);
    }
  }

  async function handleUploadLetter() {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(t("common.error") || "خطأ", t("chat.permissionRequired") || "يجب السماح بالوصول إلى استوديو الصور لرفع المستندات.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setLoading(true);
      setShowSuggestions(false);
      setSummary(null);

      const localUri = result.assets[0].uri;
      const filename = localUri.split("/").pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      // @ts-ignore
      formData.append("file", { uri: localUri, name: filename, type });

      const token = await getToken();
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }

      const uploadData = await uploadRes.json();
      if (!uploadData.url) throw new Error("Upload URL is empty");

      const imageUrl = uploadData.url;
      const attachedDocText = t("chat.attachedDoc") || "📎 خطاب مرفق للتحليل:";

      setMessages((prev) => [...prev, { role: "user", content: `${attachedDocText} ${imageUrl}` }]);

      const analyzeRes = await fetch(`${API_URL}/chat/analyze-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl, locale }),
      });

      if (!analyzeRes.ok) {
        const errorData = await analyzeRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      const analyzeData = await analyzeRes.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: analyzeData.analysis },
      ]);

    } catch (e: any) {
      console.error(e);
      Alert.alert(t("common.error") || "خطأ", e.message || "فشل تحميل أو تحليل المستند.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chat.aiError") || "عذراً، حدث خطأ. حاول مرة أخرى." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.card }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginEnd: 10 }}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
        </View>
        <Text style={{ flex: 1, fontSize: 16, fontWeight: "700", color: COLORS.text }}>{t("chat.aiTitle")}</Text>
        {messages.length > 2 && (
          <TouchableOpacity onPress={handleSummarize} disabled={summarizing} style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fef3c7", borderRadius: 8, marginEnd: 8 }}>
            {summarizing ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={{ fontSize: 12, color: "#92400e", fontWeight: "600" }}>{t("chat.summarize")}</Text>
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
            { id: "employment", label: t("chat.personaEmployment") || "العمل", icon: "💼" },
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
          <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 8, textAlign: "center" }}>{t("chat.conversationSummary")}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={{ fontSize: 14, lineHeight: 22, color: COLORS.text }}>{summary}</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setShowSummary(false)} style={{ marginTop: 16, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 10, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>{t("common.ok")}</Text>
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
                      handleSend(t("chat." + card.promptKey), card.persona);
                    }}
                    style={{
                      flexDirection: isRTL ? "row-reverse" : "row",
                      alignItems: "center",
                      backgroundColor: COLORS.card,
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
                    <Text style={{ fontSize: 11, color: COLORS.text, fontWeight: "500" }}>{t("chat." + card.key)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Document Analyzer Trigger Card */}
              <TouchableOpacity
                onPress={handleUploadLetter}
                disabled={loading}
                style={{
                  width: "90%",
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderStyle: "dashed",
                  backgroundColor: "#f9fafb",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
                <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text }}>{t("chat.analyzeDocument")}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textSecondary, textAlign: "center" }}>{t("chat.uploadDocument")}</Text>
                <View style={{ backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginTop: 4 }}>
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>{t("chat.chooseDoc")}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="chatbubble-ellipses" size={40} color={COLORS.border} />
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 8 }}>{t("chat.noMessages")}</Text>
            </View>
          )
        }
        renderItem={({ item, index }: { item: AIMessage; index: number }) => {
          const isAttachedDoc = item.content.startsWith(t("chat.attachedDoc") || "📎 خطاب مرفق للتحليل:");
          return (
            <View style={{ alignItems: item.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <View style={{ maxWidth: "80%" }}>
                <View style={{ backgroundColor: item.role === "user" ? COLORS.primary : "#fff", borderRadius: 16, borderBottomRightRadius: item.role === "user" ? 4 : 16, borderBottomLeftRadius: item.role === "user" ? 16 : 4, paddingHorizontal: 14, paddingVertical: 10, borderWidth: item.role === "user" ? 0 : 1, borderColor: COLORS.border }}>
                  {isAttachedDoc ? (
                    <View style={{ gap: 6, minWidth: 220 }}>
                      <Text style={{ fontSize: 12, color: item.role === "user" ? "#fff" : COLORS.text, fontWeight: "600" }}>
                        {t("chat.attachedDoc") || "📎 خطاب مرفق للتحليل:"}
                      </Text>
                      <Image
                        source={{ uri: item.content.replace(t("chat.attachedDoc") || "📎 خطاب مرفق للتحليل:", "").trim() }}
                        style={{ width: 220, height: 165, borderRadius: 8, marginTop: 4 }}
                        resizeMode="cover"
                      />
                    </View>
                  ) : (
                    <Text style={{ fontSize: 14, lineHeight: 20, color: item.role === "user" ? "#fff" : COLORS.text }}>{item.content}</Text>
                  )}

                  {item.sources && item.sources.length > 0 && (
                    <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: COLORS.primary, marginBottom: 4 }}>{t("chat.sources") || "المصادر:"}</Text>
                      {item.sources.map((s, idx) => (
                        <View key={idx} style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", marginBottom: 2 }}>
                          <Ionicons name="link-outline" size={10} color={COLORS.primary} style={{ marginHorizontal: 2 }} />
                          <Text numberOfLines={1} style={{ fontSize: 10, color: COLORS.textSecondary, flex: 1 }}>{s.title}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                {item.role === "assistant" && (
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 8, marginTop: 4, paddingHorizontal: 4 }}>
                    <TouchableOpacity onPress={() => handleTranslate(item.content, index)} disabled={translatingIdx === index}>
                      {translatingIdx === index ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      ) : (
                        <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>{t("chat.translate")}</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => speakText(item.content)} style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4 }}>
                      <Ionicons name={isSpeaking ? "volume-mute" : "volume-high"} size={16} color={COLORS.primary} />
                      <Text style={{ fontSize: 11, color: COLORS.primary }}>{isSpeaking ? t("chat.stopSpeaking") : t("chat.speak")}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          loading ? (
            <View style={{ alignItems: "flex-start", marginBottom: 10 }}>
              <View style={{ backgroundColor: COLORS.card, borderRadius: 16, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border }}>
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
      <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.card }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            onPress={handleUploadLetter}
            disabled={loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#f3f4f6",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="add" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={startRecording}
            disabled={isRecording || loading}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: isRecording ? "#fee2e2" : "#f3f4f6",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: isRecording ? "#ef4444" : COLORS.border,
            }}
          >
            <Ionicons name={isRecording ? "mic" : "mic-outline"} size={24} color={isRecording ? "#ef4444" : COLORS.textSecondary} />
          </TouchableOpacity>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t("chat.aiPlaceholder")}
            placeholderTextColor={COLORS.textSecondary}
            onSubmitEditing={() => handleSend()}
            editable={!loading}
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
