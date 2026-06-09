import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { register } from "../lib/api";
import { useI18n } from "../lib/i18n-context";

export default function RegisterScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t("common.error"), t("register.validation"));
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      Alert.alert(t("common.success"), t("register.success"));
      router.replace("/login");
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || t("register.error"));
    }
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", padding: 24 }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.primary, textAlign: "center", marginBottom: 24 }}>
          {t("register.title")}
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={t("register.namePlaceholder")}
          placeholderTextColor={COLORS.textSecondary}
          style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 12, textAlign: isRTL ? "right" : "left" }}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t("register.emailPlaceholder")}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 12, textAlign: isRTL ? "right" : "left" }}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t("register.passwordPlaceholder")}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry
          style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, marginBottom: 24, textAlign: isRTL ? "right" : "left" }}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("register.submit")}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")} style={{ marginTop: 16, alignItems: "center" }}>
          <Text style={{ color: COLORS.primary, fontSize: 14 }}>{t("register.hasAccount")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
