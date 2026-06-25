import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Image } from "react-native";
import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";
import { getMessages, sendMessage, type ChatMsg } from "../lib/direct-chat";
import * as Notifications from "expo-notifications";

export default function DirectChatScreen() {
  const { userId, name } = useLocalSearchParams<{ userId: string; name: string }>();
  const { t, isRTL } = useI18n();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    if (userId) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);

      const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
        const data = notification.request.content.data;
        if (data?.type === "chat" && data?.senderId === userId) {
          loadMessages();
        }
      });

      return () => {
        clearInterval(interval);
        foregroundSubscription.remove();
      };
    }
  }, [userId]);

  async function loadMessages() {
    try {
      const msgs = await getMessages(userId);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const newMsg = await sendMessage(userId, input.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInput("");
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) {
      console.error(e);
    }
    setSending(false);
  }

  if (loading && messages.length === 0) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Custom Header */}
      <View style={[styles.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name || t("chat.title")}</Text>
          <Text style={styles.headerStatus}>{t("chat.justNow")}</Text>
        </View>
      </View>

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMine = item.senderId !== userId;
          return (
            <View style={[styles.msgWrapper, { alignItems: isMine ? "flex-end" : "flex-start" }]}>
              <View style={[
                styles.msgBubble,
                isMine ? styles.msgMine : styles.msgOther
              ]}>
                <Text style={[styles.msgText, { color: isMine ? "#fff" : COLORS.text }]}>{item.message}</Text>
                <Text style={[styles.msgTime, { color: isMine ? "rgba(255,255,255,0.7)" : COLORS.textSecondary }]}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      <View style={styles.inputArea}>
        <View style={[styles.inputRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={t("chat.placeholder")}
            multiline
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || sending}
            style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]}
          >
            {sending ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: "center", gap: 12 },
  backBtn: { padding: 4 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  headerStatus: { fontSize: 11, color: COLORS.success },
  list: { padding: 16, gap: 12 },
  msgWrapper: { marginBottom: 8 },
  msgBubble: { maxWidth: "80%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  msgMine: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  msgOther: { backgroundColor: COLORS.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  msgText: { fontSize: 14, lineHeight: 20 },
  msgTime: { fontSize: 9, marginTop: 4, textAlign: "right" },
  inputArea: { padding: 12, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border },
  inputRow: { alignItems: "center", gap: 8 },
  input: { flex: 1, backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.text, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center" },
});
