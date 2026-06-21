import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../constants/colors";
import { useEffect, useMemo, useState } from "react";
import { Appearance, LogBox, ActivityIndicator, View, Text, TextInput, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { I18nProvider, useI18n } from "../lib/i18n-context";
import * as Font from "expo-font";

// تهيئة وتطبيق خط المراعي كخط افتراضي لجميع عناصر النصوص في الموبايل
const patchText = () => {
  const defaultFont = "Almarai-Regular";
  const boldFont = "Almarai-Bold";
  const lightFont = "Almarai-Light";

  const getFontFamily = (style: any) => {
    if (!style) return defaultFont;
    const flat = StyleSheet.flatten(style);
    if (!flat) return defaultFont;

    const weight = flat.fontWeight;
    if (weight === "bold" || weight === "700" || weight === "800" || weight === "900") {
      return boldFont;
    }
    if (weight === "300" || weight === "100" || weight === "200") {
      return lightFont;
    }
    return defaultFont;
  };

  const oldTextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = oldTextRender.call(this, ...args);
    if (!origin) return origin;
    const style = origin.props.style;
    const fontFamily = getFontFamily(style);
    return React.cloneElement(origin, {
      style: [{ fontFamily }, style],
    });
  };

  const oldInputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = oldInputRender.call(this, ...args);
    if (!origin) return origin;
    const style = origin.props.style;
    const fontFamily = getFontFamily(style);
    return React.cloneElement(origin, {
      style: [{ fontFamily }, style],
    });
  };
};

patchText();

LogBox.ignoreLogs(["expo-notifications: Android Push notifications"]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
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

        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: t("register.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="news/[slug]"
        options={{
          headerShown: true,
          title: t("news.detail.notFound"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: true,
          title: t("settings.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="events/[id]"
        options={{
          headerShown: true,
          title: t("events.list.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="donate"
        options={{
          headerShown: true,
          title: t("donate.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="surveys"
        options={{
          headerShown: true,
          title: t("surveys.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="volunteer"
        options={{
          headerShown: true,
          title: t("volunteer.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="gallery"
        options={{
          headerShown: true,
          title: t("gallery.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: true,
          title: t("dashboard.title"),
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: "#fff",

        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Notifications.requestPermissionsAsync();

    const subscription = Appearance.addChangeListener((prefs: { colorScheme: "light" | "dark" | null | undefined }) => {
      setColorScheme(prefs.colorScheme);
    });

    async function loadFonts() {
      try {
        await Font.loadAsync({
          "Almarai-Light": "https://fonts.gstatic.com/s/almarai/v13/ts3VOGoOOeLGS2tX12P_0sZlqH7e.ttf",
          "Almarai-Regular": "https://fonts.gstatic.com/s/almarai/v13/ts3VOGoOOeLGS2tX12Xv0sZlqH7e.ttf",
          "Almarai-Bold": "https://fonts.gstatic.com/s/almarai/v13/ts3YOGoOOeLGS2tX12lz1PtzqH7e16xO.ttf",
          "Almarai-ExtraBold": "https://fonts.gstatic.com/s/almarai/v13/ts3YOGoOOeLGS2tX12n41PtzqH7e16xO.ttf",
        });
      } catch (error) {
        console.error("Error loading fonts:", error);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <I18nProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <StackScreens />
    </I18nProvider>
  );
}
