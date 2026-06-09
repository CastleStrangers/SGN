import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { getStats } from "../lib/stats";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

export default function DashboardScreen() {
  const { t, isRTL } = useI18n();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  const cards = [
    { icon: "newspaper-outline" as const, label: t("dashboard.posts"), value: stats?.posts ?? 0, color: "#1a5632" },
    { icon: "people-outline" as const, label: t("dashboard.users"), value: stats?.users ?? 0, color: "#2563eb" },
    { icon: "calendar-outline" as const, label: t("dashboard.events"), value: stats?.events ?? 0, color: "#c8a84e" },
    { icon: "eye-outline" as const, label: t("dashboard.totalViews"), value: stats?.totalViews ?? 0, color: "#dc2626" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", flexWrap: "wrap", gap: 12 }}>
        {cards.map((card, index) => (
          <View key={index} style={{ width: "47%", backgroundColor: "#fff", borderRadius: 16, padding: 20, alignItems: "center", gap: 8 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${card.color}15`, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name={card.icon} size={24} color={card.color} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.text }}>{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</Text>
            <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: "center" }}>{card.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
