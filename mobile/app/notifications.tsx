import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";
import { getToken } from "../lib/api";
import { formatDate } from "../lib/date";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getNotificationAISummary,
  type DBNotification,
} from "../lib/notifications";

export default function NotificationsScreen() {
  const router = useRouter();
  const { t, isRTL, locale } = useI18n();
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = await getToken();
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    await loadNotifications();
  }

  async function loadNotifications() {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (e: any) {
      console.error("Failed to load notifications:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setSummary(null); // Clear summary when read
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message);
    }
  }

  async function handleNotificationClick(n: DBNotification) {
    if (!n.read) {
      try {
        await markNotificationRead(n.id);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
        );
      } catch (e) {
        console.error("Failed to mark read:", e);
      }
    }

    if (n.link) {
      // Clean link for router if it has full URL or language prefix
      let localLink = n.link;
      if (localLink.startsWith("http")) {
        try {
          const url = new URL(localLink);
          localLink = url.pathname;
        } catch { /* ignore */ }
      }
      
      // Strip language prefix like /ar, /en, /nl from link
      localLink = localLink.replace(/^\/(ar|en|nl)/, "");
      
      try {
        router.push(localLink as any);
      } catch (e) {
        console.warn("Failed to navigate to notification link:", localLink, e);
      }
    }
  }

  async function handleAISummary() {
    setAiLoading(true);
    setSummary(null);
    try {
      const summaryText = await getNotificationAISummary(locale);
      setSummary(summaryText);
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message);
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={[styles.center, { backgroundColor: COLORS.background, padding: 24 }]}>
        <Ionicons name="notifications-off-outline" size={72} color={COLORS.textSecondary} style={{ opacity: 0.5, marginBottom: 16 }} />
        <Text style={[styles.title, { color: COLORS.text, marginBottom: 8 }]}>{t("notifications.title")}</Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: "center", marginBottom: 24 }}>
          {t("notifications.loginRequired")}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
        >
          <Text style={styles.primaryButtonText}>{t("profile.login")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header Panel */}
      <View style={[styles.headerPanel, { backgroundColor: COLORS.card, borderColor: COLORS.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
        <Text style={[styles.titleText, { color: COLORS.text }]}>{t("notifications.title")}</Text>
        
        {unreadCount > 0 && (
          <View style={[styles.actionRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity
              onPress={handleAISummary}
              disabled={aiLoading}
              style={[styles.aiButton, { borderColor: COLORS.primary }]}
            >
              <Ionicons name="sparkles" size={15} color={COLORS.primary} style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }} />
              <Text style={[styles.aiButtonText, { color: COLORS.primary }]}>{t("notifications.aiSummary")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={[styles.readAllText, { color: COLORS.primary }]}>{t("notifications.markAllRead")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* AI Summary Loading */}
        {aiLoading && (
          <View style={[styles.aiLoadingContainer, { backgroundColor: COLORS.card, borderColor: COLORS.border, flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <ActivityIndicator size="small" color={COLORS.primary} style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }} />
            <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("notifications.aiSummaryLoading")}</Text>
          </View>
        )}

        {/* AI Summary Card */}
        {summary && (
          <View style={[styles.aiCard, { backgroundColor: COLORS.card, borderColor: COLORS.primary }]}>
            <View style={[styles.aiCardHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={[styles.aiCardTitleRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Ionicons name="sparkles" size={16} color={COLORS.primary} style={isRTL ? { marginLeft: 6 } : { marginRight: 6 }} />
                <Text style={[styles.aiCardTitle, { color: COLORS.primary }]}>{t("notifications.aiSummaryTitle")}</Text>
              </View>
              <TouchableOpacity onPress={() => setSummary(null)}>
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.aiSummaryContent, { color: COLORS.text, textAlign: isRTL ? "right" : "left" }]}>
              {summary}
            </Text>
          </View>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={48} color={COLORS.textSecondary} style={{ opacity: 0.3, marginBottom: 8 }} />
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>{t("notifications.empty")}</Text>
          </View>
        )}

        {/* Notifications list */}
        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleNotificationClick(item)}
            style={[
              styles.notificationItem,
              {
                backgroundColor: COLORS.card,
                borderColor: COLORS.border,
                borderLeftWidth: !item.read ? 4 : 1,
                borderLeftColor: !item.read ? COLORS.primary : COLORS.border,
              },
            ]}
          >
            <View style={[styles.itemHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <Text style={[styles.itemTitle, { color: COLORS.text, flex: 1, textAlign: isRTL ? "right" : "left" }]}>
                {item.title}
              </Text>
              {!item.read && <View style={[styles.unreadDot, { backgroundColor: COLORS.error }]} />}
            </View>
            {item.message && (
              <Text style={[styles.itemMessage, { color: COLORS.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
                {item.message}
              </Text>
            )}
            <Text style={[styles.itemTime, { color: COLORS.textSecondary, textAlign: isRTL ? "right" : "left" }]}>
              {formatDate(item.createdAt, locale)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerPanel: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionRow: {
    alignItems: "center",
    gap: 12,
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  readAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  aiLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    marginBottom: 16,
  },
  aiCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  aiCardHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  aiCardTitleRow: {
    alignItems: "center",
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  aiSummaryContent: {
    fontSize: 13,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  notificationItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  itemHeader: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemMessage: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  itemTime: {
    fontSize: 10,
    opacity: 0.8,
  },
});
