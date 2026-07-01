import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { getToken, logout } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = await getToken();
    setIsLoggedIn(!!token);
    setChecking(false);
  }

  async function handleLogout() {
    Alert.alert(t("profile.logoutConfirm"), "", [
      { text: t("profile.cancel"), style: "cancel" },
      { text: t("profile.logoutAction"), style: "destructive", onPress: async () => {
        await logout();
        setIsLoggedIn(false);
        router.replace("/");
      }},
    ]);
  }

  if (checking) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Ionicons name="person-circle-outline" size={80} color={COLORS.border} />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.text, marginTop: 16, marginBottom: 8 }}>{t("profile.welcome")}</Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: "center", marginBottom: 24 }}>
          {t("profile.loginPrompt")}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("profile.login")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    { icon: "heart-outline" as const, label: t("profile.favorites"), route: "/(tabs)/favorites" },
    { icon: "card-outline" as const, label: t("memberProfilePage.sectionTitle"), route: "/member-profile" },
    { icon: "briefcase-outline" as const, label: t("nav.services") || "دليل الخدمات", route: "/services" },
    { icon: "folder-open-outline" as const, label: t("memberProfilePage.vaultTitle"), route: "/vault" },
    { icon: "code-working-outline" as const, label: t("dev.title") || "عن المطور والشركة المنفذة", route: "/developer-profile" },
    { icon: "settings-outline" as const, label: t("profile.settings"), route: "/settings" },
  ];

  const communityItems = [
    { icon: "wallet-outline" as const, label: t("more.donate"), route: "/donate" },
    { icon: "people-outline" as const, label: t("more.volunteer"), route: "/volunteer" },
    { icon: "documents-outline" as const, label: t("more.surveys"), route: "/surveys" },
    { icon: "images-outline" as const, label: t("more.gallery"), route: "/gallery" },
    { icon: "stats-chart-outline" as const, label: t("more.dashboard"), route: "/dashboard" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, padding: 16 }}>
      <View style={{ backgroundColor: COLORS.card, borderRadius: 24, padding: 24, alignItems: "center", marginBottom: 16 }}>
        <Ionicons name="person-circle" size={72} color={COLORS.primary} />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.text, marginTop: 8 }}>{t("profile.user")}</Text>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(item.route as any)}
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 16,
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <Ionicons name={item.icon} size={22} color={COLORS.primary} />
            <Text style={{ fontSize: 15, color: COLORS.text }}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}

      <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 12 }} />

      <Text style={{ fontSize: 13, fontWeight: "600", color: COLORS.textSecondary, marginBottom: 8, paddingHorizontal: 4 }}>
        {t("more.community")}
      </Text>

      {communityItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(item.route as any)}
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            padding: 16,
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12 }}>
            <Ionicons name={item.icon} size={22} color={COLORS.primary} />
            <Text style={{ fontSize: 15, color: COLORS.text }}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={handleLogout}
        style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12, marginTop: 8 }}
      >
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
        <Text style={{ fontSize: 15, color: COLORS.error }}>{t("profile.logout")}</Text>
      </TouchableOpacity>
    </View>
  );
}
