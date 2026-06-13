import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { submitDonation } from "../lib/donate";
import { useI18n } from "../lib/i18n-context";

export default function DonateScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert(t("common.error"), t("donate.nameRequired"));
      return;
    }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      Alert.alert(t("common.error"), t("donate.amountRequired"));
      return;
    }
    setSubmitting(true);
    try {
      const data = await submitDonation({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        amount: amt,
        message: message.trim() || undefined,
        paymentMethod,
      });
      setResult(data);
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || t("donate.error"));
    }
    setSubmitting(false);
  }

  if (result) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 24, alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
        <View style={{ backgroundColor: COLORS.card, borderRadius: 24, padding: 32, width: "100%", alignItems: "center" }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#d1fae5", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 32 }}>✓</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.text, textAlign: "center", marginBottom: 8 }}>{t("donate.success")}</Text>
          <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: "center", marginBottom: 24 }}>€{amount}</Text>
          {result.bankDetails && (
            <View style={{ backgroundColor: COLORS.background, borderRadius: 12, padding: 16, width: "100%", gap: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.text, marginBottom: 4 }}>{t("donate.bankDetails")}</Text>
              <Text style={{ fontSize: 13, color: COLORS.text }}>{t("donate.iban")}: {result.bankDetails.iban}</Text>
              <Text style={{ fontSize: 13, color: COLORS.text }}>{t("donate.bankName")}: {result.bankDetails.bankName}</Text>
              <Text style={{ fontSize: 13, color: COLORS.text }}>{t("donate.accountHolder")}: {result.bankDetails.accountHolder}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginTop: 24, backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("common.ok")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("donate.nameLabel")}</Text>
        <TextInput value={name} onChangeText={setName} style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("donate.emailLabel")}</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("donate.phoneLabel")}</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("donate.amountLabel")}</Text>
        <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left" }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("donate.messageLabel")}</Text>
        <TextInput value={message} onChangeText={setMessage} multiline numberOfLines={3} style={{ borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 14, textAlign: isRTL ? "right" : "left", minHeight: 80 }} />
        <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{t("donate.paymentMethod")}</Text>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 8 }}>
          <TouchableOpacity onPress={() => setPaymentMethod("bank")} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: paymentMethod === "bank" ? COLORS.primary : COLORS.card, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: paymentMethod === "bank" ? "#fff" : COLORS.text, fontWeight: "600", fontSize: 13 }}>{t("donate.bankTransfer")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPaymentMethod("mollie")} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: paymentMethod === "mollie" ? COLORS.primary : COLORS.card, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: paymentMethod === "mollie" ? "#fff" : COLORS.text, fontWeight: "600", fontSize: 13 }}>{t("donate.mollie")}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        style={{ backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{t("donate.submit")}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
