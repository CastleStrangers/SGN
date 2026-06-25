import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet, Linking } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { apiFetch } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

  nlProvincie: string;
  serviceDescription: string | null;
  avatar: string | null;
  whatsapp: string;
  avgRating: number;
  reviewCount: number;
  userId: string;
}

const NL_PROVINCES = [
  "Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant",
  "Overijssel", "Flevoland", "Groningen", "Friesland", "Drenthe", "Zeeland", "Limburg",
];

export default function ServicesScreen() {
  const { t, isRTL } = useI18n();
  const router = useRouter();
  const [members, setMembers] = useState<ServiceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [q, city, province]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (city) params.set("city", city);
      if (province) params.set("province", province);
      const data = await apiFetch(`/members/services?${params.toString()}`);
      setMembers(data.members || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t("directory.search") || "بحث..."}
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          />
        </View>
        <View style={[styles.searchBar, { flexDirection: isRTL ? "row-reverse" : "row", marginTop: 8 }]}>
          <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder={t("memberProfilePage.nlCity") || "المدينة..."}
            placeholderTextColor={COLORS.textSecondary}
            style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8, gap: 8, flexDirection: isRTL ? "row-reverse" : "row" }}>
          <TouchableOpacity
            onPress={() => setProvince("")}
            style={[styles.provinceTab, province === "" && styles.provinceTabActive]}
          >
            <Text style={[styles.provinceTabText, province === "" && styles.provinceTabTextActive]}>{t("home.all")}</Text>
          </TouchableOpacity>
          {NL_PROVINCES.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setProvince(p)}
              style={[styles.provinceTab, province === p && styles.provinceTabActive]}
            >
              <Text style={[styles.provinceTabText, province === p && styles.provinceTabTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : members.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={64} color={COLORS.border} />
          <Text style={styles.emptyText}>{t("directory.noResults")}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {members.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.cardHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <View style={styles.avatar}>
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.avatarText}>{item.nameAr.charAt(0)}</Text>
                  )}
                </View>
                <View style={[styles.headerInfo, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                  <Text style={styles.nameAr}>{item.nameAr}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Ionicons name="star" size={12} color={item.avgRating > 0 ? COLORS.accent : COLORS.border} />
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: COLORS.text }}>{item.avgRating > 0 ? item.avgRating.toFixed(1) : "—"}</Text>
                    <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>({item.reviewCount})</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.professionRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <Ionicons name="briefcase-outline" size={16} color={COLORS.primary} />
                <Text style={styles.professionText}>{item.profession}</Text>
              </View>

              <Text style={[styles.desc, { textAlign: isRTL ? "right" : "left" }]}>
                {item.serviceDescription}
              </Text>

              <View style={[styles.cardFooter, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <View style={[styles.cityRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                  <Ionicons name="pin-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.cityText}>{item.nlCity}</Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    style={[styles.contactBtn, { backgroundColor: COLORS.primary }]}
                    onPress={() => router.push({ pathname: "/direct-chat", params: { userId: item.userId, name: item.nameAr } })}
                  >
                    <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                    <Text style={styles.contactBtnText}>{t("chat.title") || "دردشة"}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.contactBtn}
                    onPress={() => Linking.openURL(`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`)}
                  >
                    <Ionicons name="logo-whatsapp" size={18} color="#fff" />
                    <Text style={styles.contactBtnText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchSection: { padding: 16, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBar: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: { flex: 1, height: "100%", fontSize: 14, color: COLORS.text, paddingHorizontal: 8 },
  scroll: { padding: 16, gap: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 16 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: COLORS.border, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardHeader: { gap: 12, marginBottom: 12 },
  avatar: { width: 50, height: 50, borderRadius: 12, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%" },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerInfo: { flex: 1 },
  nameAr: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  nameNl: { fontSize: 12, color: COLORS.textSecondary },
  professionRow: { alignItems: "center", gap: 6, marginBottom: 8 },
  professionText: { fontSize: 14, fontWeight: "bold", color: COLORS.primary },
  desc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 16 },
  cardFooter: { justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  cityRow: { alignItems: "center", gap: 4 },
  cityText: { fontSize: 12, color: COLORS.textSecondary },
  contactBtn: { backgroundColor: "#25D366", flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, gap: 6 },
  contactBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  provinceTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  provinceTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  provinceTabText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  provinceTabTextActive: {
    color: "#fff",
  },
});
