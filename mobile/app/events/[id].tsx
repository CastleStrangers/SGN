import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";
import { formatDate, formatTime } from "../../lib/date";

export default function EventDetailScreen() {
  const { t, isRTL, locale } = useI18n();
  const params = useLocalSearchParams();

  const event = {
    title: params.title as string,
    description: params.description as string,
    date: params.date as string,
    location: params.location as string,
    image: params.image as string,
    category: params.category as string,
  };

  if (!event.title) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <Text style={{ color: COLORS.textSecondary }}>{t("common.loading")}</Text>
      </View>
    );
  }

  const date = new Date(event.date);
  const dateStr = formatDate(date, locale, {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const timeStr = formatTime(date, locale, {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {event.image ? (
        <Image source={{ uri: event.image }} style={{ width: "100%", height: 240 }} resizeMode="cover" />
      ) : (
        <View style={{ width: "100%", height: 200, backgroundColor: COLORS.border, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="calendar" size={48} color={COLORS.textSecondary} />
        </View>
      )}
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 11, color: COLORS.accent, fontWeight: "600", marginBottom: 8 }}>
          {event.category}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: COLORS.text, marginBottom: 16 }}>
          {event.title}
        </Text>

        <View style={{ gap: 12, marginBottom: 20 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <View>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{t("events.detail.date")}</Text>
              <Text style={{ fontSize: 14, color: COLORS.text, fontWeight: "500" }}>{dateStr}</Text>
            </View>
          </View>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <View>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{t("events.detail.time")}</Text>
              <Text style={{ fontSize: 14, color: COLORS.text, fontWeight: "500" }}>{timeStr}</Text>
            </View>
          </View>
          {event.location ? (
            <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
              <View>
                <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{t("events.detail.location")}</Text>
                <Text style={{ fontSize: 14, color: COLORS.text, fontWeight: "500" }}>{event.location}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {event.description ? (
          <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 14, color: COLORS.text, lineHeight: 22 }}>{event.description}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
