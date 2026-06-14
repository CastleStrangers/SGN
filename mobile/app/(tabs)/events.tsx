import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { getEvents } from "../../lib/events";
import { getImageUrl } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";
import { formatDate } from "../../lib/date";

export default function EventsScreen() {
  const router = useRouter();
  const { t, isRTL, locale } = useI18n();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [showUpcoming]);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await getEvents(showUpcoming ? true : undefined);
      setEvents(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ flexDirection: isRTL ? "row-reverse" : "row", paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}>
        <TouchableOpacity
          onPress={() => setShowUpcoming(true)}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
            backgroundColor: showUpcoming ? COLORS.primary : COLORS.card,
            borderWidth: 1, borderColor: COLORS.border,
          }}
        >
          <Text style={{ color: showUpcoming ? "#fff" : COLORS.text, fontWeight: "600", fontSize: 14 }}>
            {t("events.list.upcoming")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowUpcoming(false)}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
            backgroundColor: !showUpcoming ? COLORS.primary : COLORS.card,
            borderWidth: 1, borderColor: COLORS.border,
          }}
        >
          <Text style={{ color: !showUpcoming ? "#fff" : COLORS.text, fontWeight: "600", fontSize: 14 }}>
            {t("events.list.all")}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : events.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="calendar-outline" size={64} color={COLORS.border} />
          <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 16 }}>{t("events.list.noEvents")}</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: `/events/${item.id}`, params: { id: item.id, title: item.title, description: item.description || "", date: item.date, location: item.location || "", image: getImageUrl(item.image) || "", category: item.category || "" } })}
              style={{
                backgroundColor: COLORS.card, borderRadius: 16, overflow: "hidden",
                shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
              }}
            >
              {item.image && (
                <Image source={{ uri: getImageUrl(item.image) || undefined }} style={{ width: "100%", height: 160 }} resizeMode="cover" />
              )}
              <View style={{ padding: 14 }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <Text style={{ fontSize: 11, color: COLORS.accent, fontWeight: "600" }}>{item.category}</Text>
                  <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                    {formatDate(item.date, locale)}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.text, marginBottom: 4 }}>{item.title}</Text>
                {item.location && (
                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                    <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.location}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item: any) => item.id}
        />
      )}
    </View>
  );
}
// Touch comment to trigger type checker refresh

