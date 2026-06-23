import { View, Text, ScrollView, Switch, TouchableOpacity, ActivityIndicator, Alert, Linking, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { apiFetch, getToken } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";
import { API_URL } from "../constants/api";

interface MemberData {
  id: string;
  memberNumber?: number | null;
  nameAr: string;
  nameNl: string;
  birthYear: number;
  gender: string;
  originCity: string;
  whatsapp: string;
  email: string | null;
  nlProvincie: string;
  nlCity: string;
  expNl: string | null;
  expOutside: string | null;
  educationLevel: string | null;
  profession: string | null;
  skills: string | null;
  maritalStatus: string | null;
  status: string | null;
  notes: string | null;
  showInPublicProfile?: boolean | null;
  isCvPublic?: boolean | null;
  createdAt: string;
}

export default function MemberProfileScreen() {
  const { t, isRTL } = useI18n();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const userToken = await getToken();
      setToken(userToken);
      const data = await apiFetch("/member/me");
      if (data?.member) {
        setMember(data.member);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert(t("common.error"), e.message || t("memberProfilePage.saveError"));
    }
    setLoading(false);
  }

  async function toggleSetting(field: "showInPublicProfile" | "isCvPublic", currentValue: boolean) {
    if (!member) return;
    setUpdating(true);
    try {
      const updatedValue = !currentValue;
      const data = await apiFetch("/member/me", {
        method: "PATCH",
        body: JSON.stringify({ [field]: updatedValue }),
      });
      if (data?.member) {
        setMember(data.member);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert(t("common.error"), e.message || t("memberProfilePage.saveError"));
    }
    setUpdating(false);
  }

  async function downloadPdf() {
    if (!member || !token) return;
    const downloadUrl = `${API_URL}/members/${member.id}/pdf?token=${token}`;
    try {
      const supported = await Linking.canOpenURL(downloadUrl);
      if (supported) {
        await Linking.openURL(downloadUrl);
      } else {
        Alert.alert(t("common.error"), "Cannot open browser download link");
      }
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || "Failed to download PDF");
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!member) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="card-outline" size={80} color={COLORS.border} />
        <Text style={styles.emptyTitle}>{t("memberProfilePage.noApplication")}</Text>
        <Text style={styles.emptyDesc}>{t("memberProfilePage.noApplicationDesc")}</Text>
      </View>
    );
  }

  const isProfilePublic = member.showInPublicProfile !== false;
  const isCvPublicVal = member.isCvPublic !== false;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{member.nameAr.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.nameAr}>{member.nameAr}</Text>
          <Text style={styles.nameNl}>{member.nameNl}</Text>
          {member.memberNumber && (
            <Text style={styles.memberNumber}>
              {t("memberProfilePage.memberNumber")} {member.memberNumber}
            </Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: member.status === "accepted" ? `${COLORS.success}20` : `${COLORS.accent}20` }]}>
            <Text style={[styles.statusText, { color: member.status === "accepted" ? COLORS.success : COLORS.accent }]}>
              {t(`memberProfilePage.${member.status || "pending"}`)}
            </Text>
          </View>
        </View>
      </View>

      {/* PDF Download Button */}
      <TouchableOpacity onPress={downloadPdf} style={styles.downloadButton}>
        <Ionicons name="document-text-outline" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>{t("memberProfilePage.downloadPdf")}</Text>
      </TouchableOpacity>

      {/* Privacy Settings Switches */}
      {member.status === "accepted" && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{t("settings.title")}</Text>
          
          <View style={[styles.settingRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t("memberProfilePage.profileVisible")}</Text>
              <Text style={styles.settingDesc}>
                {isProfilePublic ? t("memberProfilePage.profileVisible") : t("memberProfilePage.profileHidden")}
              </Text>
            </View>
            <Switch
              value={isProfilePublic}
              onValueChange={() => toggleSetting("showInPublicProfile", isProfilePublic)}
              disabled={updating}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={[styles.settingRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t("memberProfilePage.cvVisible") || "CV Privacy"}</Text>
              <Text style={styles.settingDesc}>
                {isCvPublicVal 
                  ? t("memberProfilePage.cvPublic") || "Public (anyone can see experiences)" 
                  : t("memberProfilePage.cvPrivate") || "Private (only you and admins)"}
              </Text>
            </View>
            <Switch
              value={isCvPublicVal}
              onValueChange={() => toggleSetting("isCvPublic", isCvPublicVal)}
              disabled={updating}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>
      )}

      {/* Admin Notes */}
      {member.notes && (
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>{t("memberProfilePage.adminNotes")}</Text>
          <Text style={styles.notesText}>{member.notes}</Text>
        </View>
      )}

      {/* Profile Details List */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t("memberProfilePage.sectionTitle")}</Text>
        
        <DetailItem label={t("memberProfilePage.nameAr")} value={member.nameAr} icon="person-outline" isRTL={isRTL} />
        <DetailItem label={t("memberProfilePage.nameNl")} value={member.nameNl} icon="person-outline" isRTL={isRTL} />
        <DetailItem label={t("memberProfilePage.birthYear")} value={String(member.birthYear)} icon="calendar-outline" isRTL={isRTL} />
        <DetailItem label={t("memberProfilePage.gender")} value={member.gender} icon="male-female-outline" isRTL={isRTL} />
        <DetailItem label={t("memberProfilePage.originCity")} value={member.originCity} icon="map-outline" isRTL={isRTL} />
        <DetailItem label={t("memberProfilePage.whatsapp")} value={member.whatsapp} icon="logo-whatsapp" isRTL={isRTL} />
        {member.email && <DetailItem label={t("memberProfilePage.email")} value={member.email} icon="mail-outline" isRTL={isRTL} />}
        <DetailItem label={t("memberProfilePage.nlProvincie")} value={member.nlProvincie} icon="map-outline" isRTL={isRTL} />
        <DetailItem label={t("memberProfilePage.nlCity")} value={member.nlCity} icon="pin-outline" isRTL={isRTL} />
        
        {member.educationLevel && <DetailItem label={t("memberProfilePage.educationLevel")} value={member.educationLevel} icon="school-outline" isRTL={isRTL} />}
        {member.profession && <DetailItem label={t("memberProfilePage.profession")} value={member.profession} icon="briefcase-outline" isRTL={isRTL} />}
        {member.skills && <DetailItem label={t("memberProfilePage.skills")} value={member.skills} icon="construct-outline" isRTL={isRTL} />}
        {member.maritalStatus && <DetailItem label={t("memberProfilePage.maritalStatus")} value={member.maritalStatus} icon="heart-half-outline" isRTL={isRTL} />}

        {member.expNl && (
          <View style={styles.expBox}>
            <Text style={styles.expTitle}>{t("memberProfilePage.expNl")}</Text>
            <Text style={styles.expText}>{member.expNl}</Text>
          </View>
        )}

        {member.expOutside && (
          <View style={[styles.expBox, { marginTop: 12 }]}>
            <Text style={styles.expTitle}>{t("memberProfilePage.expOutside")}</Text>
            <Text style={styles.expText}>{member.expOutside}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function DetailItem({ label, value, icon, isRTL }: { label: string; value: string; icon: any; isRTL: boolean }) {
  return (
    <View style={[styles.detailItemRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.detailIcon} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  nameAr: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  nameNl: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  memberNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  settingRow: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  notesCard: {
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: `${COLORS.accent}30`,
    gap: 6,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.accentDark,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  detailItemRow: {
    alignItems: "center",
    gap: 12,
  },
  detailIcon: {
    width: 24,
    textAlign: "center",
  },
  detailTextContainer: {
    flex: 1,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  expBox: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  expTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  expText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
});
