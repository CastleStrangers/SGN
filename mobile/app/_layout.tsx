import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../constants/colors";
import { useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";
import * as Notifications from "expo-notifications";
import { I18nProvider, useI18n } from "../lib/i18n-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function StackScreens() {
  const { t, isRTL } = useI18n();

  const screenOptions = useMemo(() => ({
    headerShown: false,
  }), []);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: t("login.submit"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: t("register.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="news/[slug]"
        options={{
          headerShown: true,
          title: t("news.detail.notFound"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: t("settings.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="events/[id]"
        options={{
          headerShown: true,
          title: t("events.list.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="donate"
        options={{
          headerShown: true,
          title: t("donate.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="surveys"
        options={{
          headerShown: true,
          title: t("surveys.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="volunteer"
        options={{
          headerShown: true,
          title: t("volunteer.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="gallery"
        options={{
          headerShown: true,
          title: t("gallery.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: true,
          title: t("dashboard.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",
          headerTitleStyle: { textAlign: isRTL ? "right" : "left" as any },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    const subscription = Appearance.addChangeListener((prefs: { colorScheme: "light" | "dark" | null | undefined }) => {
      setColorScheme(prefs.colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <I18nProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <StackScreens />
    </I18nProvider>
  );
}
