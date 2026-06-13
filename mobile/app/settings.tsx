import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { useState, useEffect } from "react";
import { COLORS } from "../constants/colors";
import { registerPushToken } from "../lib/news";
import { getToken } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

export default function SettingsScreen() {
  const { t, locale, setLocale, isRTL, locales } = useI18n();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = await getToken();
    setIsLoggedIn(!!token);
  }

  async function togglePush() {
    if (!isLoggedIn) {
      Alert.alert(t("common.error"), t("settings.loginRequired"));
      return;
    }

    if (pushEnabled) {
      setPushEnabled(false);
      return;
    }

    try {
      const { default: Notifications } = await import("expo-notifications");
      const { data: tokenData } = await Notifications.getExpoPushTokenAsync();
      await registerPushToken(tokenData);
      setPushEnabled(true);
      Alert.alert(t("common.success"), t("settings.pushSuccess"));
    } catch (e: any) {
      Alert.alert(t("common.error"), t("settings.pushError") + ": " + e.message);
    }
  }

  const localeLabels: Record<string, string> = {
    ar: t("settings.arabic"),
    nl: t("settings.dutch"),
    en: t("settings.english"),
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      <View style={{ backgroundColor: COLORS.card, borderRadius: 24, padding: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.text, marginBottom: 16 }}>
          {t("settings.title")}
        </Text>

        {/* Language selector */}
        <View style={{ paddingVertical: 12 }}>
          <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 }}>{t("settings.language")}</Text>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 8 }}>
            {locales.map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => setLocale(l)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  backgroundColor: locale === l ? COLORS.primary : COLORS.background,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: locale === l ? COLORS.primary : COLORS.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: locale === l ? "#fff" : COLORS.text,
                  }}
                >
                  {localeLabels[l]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 4 }} />

        {/* Push notifications toggle */}
        <TouchableOpacity
          onPress={togglePush}
          style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.primary} />
            <Text style={{ fontSize: 15, color: COLORS.text }}>{t("settings.pushNotifications")}</Text>
          </View>
          <View style={{
            width: 48, height: 28, borderRadius: 14,
            backgroundColor: pushEnabled ? COLORS.primary : COLORS.border,
            justifyContent: "center",
            paddingHorizontal: 4,
            alignItems: pushEnabled ? "flex-end" : "flex-start",
          }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff" }} />
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 4 }} />

        <View style={{ paddingVertical: 12 }}>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 }}>
            {t("settings.appInfo")}
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>{t("app.version")}</Text>
        </View>
      </View>
    </View>
  );
}
