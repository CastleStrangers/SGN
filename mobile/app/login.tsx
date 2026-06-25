import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { login } from "../lib/api";
import { useI18n } from "../lib/i18n-context";
import { requestAndRegisterPush } from "../lib/notifications";

export default function LoginScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t("common.error"), t("login.validation"));
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // Register push token after successful login
      requestAndRegisterPush().catch(err => console.log("Push error:", err));

      Alert.alert(t("common.success"), t("login.success"));
      router.replace("/");
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || t("login.error"));
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", padding: 24 }}>
      <View style={{ backgroundColor: COLORS.card, borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.primary, textAlign: "center", marginBottom: 8 }}>
          {t("login.title")}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textSecondary, textAlign: "center", marginBottom: 24 }}>
          {t("login.subtitle")}
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t("login.emailPlaceholder")}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 12, textAlign: isRTL ? "right" : "left" }}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("login.passwordPlaceholder")}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 24, textAlign: isRTL ? "right" : "left" }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("login.submit")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: COLORS.primary, fontSize: 14 }}>{t("login.noAccount")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
