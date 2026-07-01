import { View, Text, ScrollView, TouchableOpacity, Image, Linking, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

export default function DeveloperProfileScreen() {
  const { t, isRTL } = useI18n();

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/31618111116?text=Hello%20Eng.%20Mohamad%20Salim%2C%20I%20would%20like%20to%20inquire%20about%20your%20software%20development%20services.");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:m.salim.aziza@gmail.com?subject=Software%20Development%20Inquiry");
  };

  const services = [
    { icon: "laptop-outline", title: t("dev.service2") },
    { icon: "phone-portrait-outline", title: t("dev.service1") },
    { icon: "hardware-chip-outline", title: t("dev.service3") },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://sgn-indol.vercel.app/images/board/Mohammad_Salim_Aziza.png" }}
            style={styles.avatar}
            defaultSource={require("../assets/images/icon.png")}
          />
        </View>
        <Text style={styles.name}>{t("dev.name")}</Text>
        <Text style={styles.role}>{t("dev.role")}</Text>
        <View style={styles.companyBadge}>
          <Text style={styles.companyText}>{t("dev.company")}</Text>
        </View>
      </View>

      {/* Detail Card */}
      <View style={styles.card}>
        <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.title")}</Text>
        <Text style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.subtitle")}</Text>
        <Text style={[styles.bio, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.bio")}</Text>
      </View>

      {/* Services Section */}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.services")}</Text>
        {services.map((item, index) => (
          <View key={index} style={[styles.serviceRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={styles.serviceIconContainer}>
              <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.serviceText, { textAlign: isRTL ? "right" : "left" }]}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Call to Actions */}
      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>{t("dev.contact")}</Text>
        <Text style={styles.ctaDesc}>{t("dev.promoDesc")}</Text>

        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          <Text style={styles.btnText}>{t("dev.whatsapp")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailBtn} onPress={handleEmail}>
          <Ionicons name="mail" size={22} color="#fff" />
          <Text style={styles.btnText}>{t("dev.email")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  profileHeader: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  role: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 12,
  },
  companyBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  companyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  serviceRow: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  serviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  ctaCard: {
    backgroundColor: "#fefcf6",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f5e8c4",
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  ctaDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  whatsappBtn: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
  },
  emailBtn: {
    backgroundColor: "#1e293b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
