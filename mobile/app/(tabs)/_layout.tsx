import { Tabs, useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const { t, isRTL, direction } = useI18n();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={isRTL ? { marginLeft: 16 } : { marginRight: 16 }}
          >
            <Ionicons name="notifications-outline" size={23} color="#fff" />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
          flexDirection: isRTL ? "row-reverse" : "row" as any,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.news"),
          tabBarLabel: t("tabs.news"),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t("tabs.favorites"),
          tabBarLabel: t("tabs.favorites"),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t("tabs.events"),
          tabBarLabel: t("tabs.events"),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t("tabs.messages"),
          tabBarLabel: t("tabs.messages"),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarLabel: t("tabs.profile"),
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
