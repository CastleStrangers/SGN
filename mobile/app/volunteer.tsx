import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { submitVolunteer } from "../lib/volunteer";
import { useI18n } from "../lib/i18n-context";

export default function VolunteerScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert(t("common.error"), t("volunteer.nameRequired"));
      return;
    }
    if (!email.trim()) {
      Alert.alert(t("common.error"), t("volunteer.emailRequired"));
      return;
    }
    setSubmitting(true);
    try {
      await submitVolunteer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        skills: skills.trim() || undefined,
        availability: availability.trim() || undefined,
        message: message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || t("volunteer.error"));
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#d1fae5", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 32 }}>✓</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.text, textAlign: "center", marginBottom: 8 }}>{t("volunteer.success")}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 24, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32 }}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("common.ok")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("volunteer.nameLabel")}</Text>
        <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("volunteer.emailLabel")}</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("volunteer.phoneLabel")}</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("volunteer.skillsLabel")}</Text>
        <TextInput value={skills} onChangeText={setSkills} style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("volunteer.availabilityLabel")}</Text>
        <TextInput value={availability} onChangeText={setAvailability} style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("volunteer.messageLabel")}</Text>
        <TextInput value={message} onChangeText={setMessage} multiline numberOfLines={3} style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left", minHeight: 80 }} />
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("volunteer.submit")}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
