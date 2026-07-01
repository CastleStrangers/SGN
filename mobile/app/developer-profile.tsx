import { View, Text, ScrollView, TouchableOpacity, Image, Linking, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

export default function DeveloperProfileScreen() {
  const { t, isRTL } = useI18n();

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/31618111116?text=Hello%20Castle%20Strangers%20Team%2C%20I%20would%20like%20to%20inquire%20about%20your%20software%20development%20and%20accounting%20systems%20services.");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:m.salim.aziza@gmail.com?subject=Software%20Development%20Inquiry");
  };

  const member1Services = [
    t("dev.service2"),
    t("dev.service1"),
    t("dev.service3"),
  ];

  const member2Services = [
    t("dev.service4"),
    t("dev.service1"),
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.mainTitle, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.title")}</Text>
        <Text style={[styles.mainSubtitle, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.subtitle")}</Text>
      </View>

      {/* Member 1: Mohamad Salim Aziza */}
      <View style={styles.memberCard}>
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

        <View style={styles.bioContainer}>
          <Text style={[styles.bioText, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.bio")}</Text>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={[styles.servicesTitle, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.services")}</Text>
          {member1Services.map((service, index) => (
            <View key={index} style={[styles.serviceRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={styles.serviceIconContainer}>
                <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.primary} />
              </View>
              <Text style={[styles.serviceText, { textAlign: isRTL ? "right" : "left" }]}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Member 2: Mohammad Raid Kaakeh */}
      <View style={styles.memberCard}>
        <View style={[styles.profileHeader, { backgroundColor: "#c8a84e" }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://sgn-indol.vercel.app/images/board/raed_kaakeh.png" }}
              style={styles.avatar}
              defaultSource={require("../assets/images/icon.png")}
            />
          </View>
          <Text style={styles.name}>{t("dev.member2Name")}</Text>
          <Text style={styles.role}>{t("dev.member2Role")}</Text>
          <View style={styles.companyBadge}>
            <Text style={styles.companyText}>{t("dev.company")}</Text>
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={[styles.bioText, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.member2Bio")}</Text>
        </View>

        <View style={styles.servicesContainer}>
          <Text style={[styles.servicesTitle, { textAlign: isRTL ? "right" : "left" }]}>{t("dev.services")}</Text>
          {member2Services.map((service, index) => (
            <View key={index} style={[styles.serviceRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
              <View style={styles.serviceIconContainer}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#c8a84e" />
              </View>
              <Text style={[styles.serviceText, { textAlign: isRTL ? "right" : "left" }]}>{service}</Text>
            </View>
          ))}
        </View>
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
  titleContainer: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  memberCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 8,
  },
  avatar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  companyBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  companyText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  bioContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  bioText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  servicesContainer: {
    padding: 16,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  serviceRow: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  serviceIconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    flex: 1,
    fontSize: 13,
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
