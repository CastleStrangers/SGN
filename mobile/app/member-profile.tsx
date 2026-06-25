import { View, Text, ScrollView, Switch, TouchableOpacity, ActivityIndicator, Alert, Linking, StyleSheet, Modal, Image, Dimensions, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { apiFetch, getToken } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";
import { API_URL } from "../constants/api";
import { CONFIG } from "../constants/config";
import { getServiceReviews, submitReview, type Review } from "../lib/reviews";

const { width } = Dimensions.get("window");

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
  isServiceProvider?: boolean | null;
  serviceDescription?: string | null;
  views: number;
  createdAt: string;
}

interface RecommendedTask {
  id: string;
  title: string;
  description: string;
  matchReason: string;
}

export default function MemberProfileScreen() {
  const { t, isRTL } = useI18n();
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [recommendedTasks, setRecommendedTasks] = useState<RecommendedTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [editingService, setEditingService] = useState(false);
  const [tempServiceDesc, setServiceDesc] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadData();
    loadRecommendations();
    loadStats();
  }, []);

  async function loadStats() {
    setLoadingStats(true);
    try {
      const data = await apiFetch("/member/stats");
      setStats(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingStats(false);
  }

  async function loadRecommendations() {
    setLoadingTasks(true);
    try {
      const data = await apiFetch("/member/recommendations");
      if (data?.tasks) {
        setRecommendedTasks(data.tasks);
      }
    } catch (e) {
      console.error("Failed to load recommendations", e);
    }
    setLoadingTasks(false);
  }

  async function loadData() {
    try {
      const userToken = await getToken();
      setToken(userToken);
      const data = await apiFetch("/member/me");
      if (data?.member) {
        setMember(data.member);
        setServiceDesc(data.member.serviceDescription || "");

        if (data.member.isServiceProvider) {
          loadReviews(data.member.id);
        }
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert(t("common.error"), e.message || t("memberProfilePage.saveError"));
    }
    setLoading(false);
  }

  async function loadReviews(memberId: string) {
    setLoadingReviews(true);
    try {
      const data = await getServiceReviews(memberId);
      setReviews(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingReviews(false);
  }

  async function handleReviewSubmit() {
    if (!member || !userComment.trim()) return;
    setSubmittingReview(true);
    try {
      const newReview = await submitReview(member.id, userRating, userComment);
      setReviews([newReview, ...reviews]);
      setUserComment("");
      setUserRating(5);
      Alert.alert(t("common.success"), "تم إضافة تقييمك بنجاح");
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || "فشل إرسال التقييم");
    }
    setSubmittingReview(false);
  }

  async function toggleSetting(field: "showInPublicProfile" | "isCvPublic" | "isServiceProvider", currentValue: boolean) {
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
        setServiceDesc(data.member.serviceDescription || "");
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert(t("common.error"), e.message || t("memberProfilePage.saveError"));
    }
    setUpdating(false);
  }

  async function saveServiceDescription() {
    if (!member) return;
    setUpdating(true);
    try {
      const data = await apiFetch("/member/me", {
        method: "PATCH",
        body: JSON.stringify({ serviceDescription: tempServiceDesc }),
      });
      if (data?.member) {
        setMember(data.member);
        setEditingService(false);
      }
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message);
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

      {/* Stats Cards (New) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>{t("memberProfilePage.memberStats")}</Text>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <View style={styles.statsSmallCard}>
            <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
            <Text style={styles.statsValue}>{stats?.totalViews || 0}</Text>
            <Text style={styles.statsLabel}>{t("memberProfilePage.totalViews")}</Text>
          </View>
          <View style={styles.statsSmallCard}>
            <Ionicons name="star-outline" size={20} color={COLORS.accent} />
            <Text style={styles.statsValue}>{stats?.avgRating ? stats.avgRating.toFixed(1) : "0.0"}</Text>
            <Text style={styles.statsLabel}>{t("memberProfilePage.avgRating")}</Text>
          </View>
          <View style={styles.statsSmallCard}>
            <Ionicons name="chatbubble-outline" size={20} color="#2563eb" />
            <Text style={styles.statsValue}>{stats?.reviewCount || 0}</Text>
            <Text style={styles.statsLabel}>{t("memberProfilePage.reviews")}</Text>
          </View>
        </View>
      </View>

      {/* Digital Card Button */}
      <TouchableOpacity onPress={() => setCardVisible(true)} style={[styles.downloadButton, { backgroundColor: COLORS.accent }]}>
        <Ionicons name="card-outline" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>{t("memberProfilePage.verificationCard")}</Text>
      </TouchableOpacity>

      {/* Digital ID Card Modal */}
      <Modal visible={cardVisible} animationType="slide" transparent={true} onRequestClose={() => setCardVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModal} onPress={() => setCardVisible(false)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{t("memberProfilePage.verificationCard")}</Text>

            <View style={styles.idCard}>
              <View style={[styles.idCardHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <View>
                  <Text style={styles.idCardOrgAr}>الجالية السورية في هولندا</Text>
                  <Text style={styles.idCardOrgEn}>Syrian Community in NL</Text>
                </View>
                <View style={styles.idCardFlags}>
                  <View style={styles.flagSyr} />
                  <View style={styles.flagNl} />
                </View>
              </View>

              <View style={[styles.idCardMain, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
                <View style={styles.idCardAvatar}>
                  <Text style={styles.idCardAvatarText}>{member.nameAr.charAt(0)}</Text>
                </View>
                <View style={[styles.idCardInfo, { alignItems: isRTL ? "flex-end" : "flex-start" }]}>
                  <Text style={styles.idCardNameAr}>{member.nameAr}</Text>
                  <Text style={styles.idCardNameNl}>{member.nameNl}</Text>
                  <View style={styles.idCardBadge}>
                    <Text style={styles.idCardBadgeText}>{t("memberProfilePage.accepted")}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.idCardFooter}>
                <View style={styles.idCardDetails}>
                  <Text style={styles.idCardDetailLabel}>{t("memberProfilePage.memberNumber")}</Text>
                  <Text style={styles.idCardDetailValue}>{member.memberNumber ? String(member.memberNumber).padStart(6, '0') : "------"}</Text>

                  <Text style={[styles.idCardDetailLabel, { marginTop: 8 }]}>{t("memberProfilePage.nlCity")}</Text>
                  <Text style={styles.idCardDetailValue}>{member.nlCity}</Text>
                </View>

                <View style={styles.qrContainer}>
                  <Image
                    source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${CONFIG.APP_URL}/member/${member.id}`)}&bgcolor=1a5632&color=ffffff&margin=1` }}
                    style={styles.qrCode}
                  />
                  <Text style={styles.qrText}>SCAN TO VERIFY</Text>
                </View>
              </View>
            </View>

            <Text style={styles.scanInstruction}>{t("memberProfilePage.scanToVerify")}</Text>

            <TouchableOpacity onPress={downloadPdf} style={styles.modalDownloadBtn}>
              <Ionicons name="download-outline" size={20} color={COLORS.primary} />
              <Text style={styles.modalDownloadText}>{t("memberProfilePage.downloadPdf")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

          <View style={styles.divider} />

          <View style={[styles.settingRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t("memberProfilePage.isServiceProvider")}</Text>
              <Text style={styles.settingDesc}>{t("memberProfilePage.serviceProviderDesc")}</Text>
            </View>
            <Switch
              value={!!member.isServiceProvider}
              onValueChange={() => toggleSetting("isServiceProvider", !!member.isServiceProvider)}
              disabled={updating}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor="#fff"
            />
          </View>

          {member.isServiceProvider && (
            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Text style={styles.settingLabel}>{t("memberProfilePage.serviceDescription")}</Text>
                <TouchableOpacity onPress={() => editingService ? saveServiceDescription() : setEditingService(true)}>
                  <Text style={{ color: COLORS.primary, fontWeight: "bold", fontSize: 13 }}>
                    {editingService ? t("memberProfilePage.saveChanges") : t("memberProfilePage.editBtn")}
                  </Text>
                </TouchableOpacity>
              </View>
              {editingService ? (
                <TextInput
                  value={tempServiceDesc}
                  onChangeText={setServiceDesc}
                  placeholder={t("memberProfilePage.serviceDescriptionPlaceholder")}
                  multiline
                  style={[styles.serviceInput, { textAlign: isRTL ? "right" : "left" }]}
                />
              ) : (
                <Text style={styles.settingDesc}>{member.serviceDescription || t("memberProfilePage.serviceDescriptionPlaceholder")}</Text>
              )}
            </View>
          )}
        </View>
      )}

      {/* Admin Notes */}
      {member.notes && (
        <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>{t("memberProfilePage.adminNotes")}</Text>
          <Text style={styles.notesText}>{member.notes}</Text>
        </View>
      )}

      {/* Recommended Tasks */}
      {member.status === "accepted" && (
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name="sparkles" size={20} color={COLORS.accent} />
            <View>
              <Text style={styles.sectionTitle}>{t("memberProfilePage.recommendedTasks")}</Text>
              <Text style={styles.settingDesc}>{t("memberProfilePage.matchingYourSkills")}</Text>
            </View>
          </View>

          {loadingTasks ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : recommendedTasks.length > 0 ? (
            recommendedTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => Alert.alert(task.title, task.description)}
              >
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color={COLORS.textSecondary} />
                </View>
                <Text style={[styles.matchReason, { textAlign: isRTL ? "right" : "left" }]}>✨ {task.matchReason}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, textAlign: "center" }}>{t("memberProfilePage.noRecommendations")}</Text>
          )}
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

      {/* Reviews Section for Mobile */}
      {member.isServiceProvider && (
        <View style={styles.sectionCard}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Ionicons name="star" size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>تقييمات الأعضاء ({reviews.length})</Text>
          </View>

          {/* New Review Form */}
          <View style={styles.reviewForm}>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12, justifyContent: "center" }}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setUserRating(s)}>
                  <Ionicons name={s <= userRating ? "star" : "star-outline"} size={28} color={s <= userRating ? COLORS.accent : COLORS.border} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={userComment}
              onChangeText={setUserComment}
              placeholder="اكتب تجربتك مع مزود الخدمة..."
              multiline
              style={[styles.reviewInput, { textAlign: isRTL ? "right" : "left" }]}
            />
            <TouchableOpacity
              style={[styles.submitReviewBtn, (!userComment.trim() || submittingReview) && { opacity: 0.5 }]}
              disabled={!userComment.trim() || submittingReview}
              onPress={handleReviewSubmit}
            >
              {submittingReview ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitReviewText}>إرسال التقييم</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {loadingReviews ? (
            <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
          ) : reviews.length === 0 ? (
            <Text style={{ textAlign: "center", color: COLORS.textSecondary, margin: 20 }}>لا توجد تقييمات بعد</Text>
          ) : (
            reviews.map(rev => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={styles.reviewerName}>{rev.reviewer.name || "عضو"}</Text>
                  <View style={{ flexDirection: "row", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Ionicons key={s} name="star" size={10} color={s <= rev.rating ? COLORS.accent : COLORS.border} />
                    ))}
                  </View>
                </View>
                <Text style={[styles.reviewText, { textAlign: isRTL ? "right" : "left" }]}>{rev.comment}</Text>
              </View>
            ))
          )}
        </View>
      )}
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
  taskItem: {
    backgroundColor: `${COLORS.primary}05`,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: `${COLORS.primary}10`,
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.text,
  },
  statsSmallCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 4,
  },
  statsLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    marginTop: 2,
    textAlign: "center",
  },
  matchReason: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 32,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  closeModal: {
    alignSelf: "flex-end",
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 24,
  },
  idCard: {
    width: "100%",
    aspectRatio: 1.586,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  idCardHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  idCardOrgAr: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  idCardOrgEn: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 8,
    fontWeight: "600",
  },
  idCardFlags: {
    flexDirection: "row",
    gap: 4,
  },
  flagSyr: {
    width: 20,
    height: 12,
    backgroundColor: "#fff", // Simplified
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  flagNl: {
    width: 20,
    height: 12,
    backgroundColor: "#fff", // Simplified
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  idCardMain: {
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  idCardAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  idCardAvatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  idCardInfo: {
    flex: 1,
  },
  idCardNameAr: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  idCardNameNl: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  idCardBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  idCardBadgeText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: "bold",
  },
  idCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flex: 1,
  },
  idCardDetails: {
    flex: 1,
  },
  idCardDetailLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 8,
    textTransform: "uppercase",
  },
  idCardDetailValue: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  qrContainer: {
    alignItems: "center",
    gap: 4,
  },
  qrCode: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  qrText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 7,
    fontWeight: "bold",
  },
  scanInstruction: {
    marginTop: 24,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  modalDownloadBtn: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
  },
  modalDownloadText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 15,
  },
  serviceInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
  },
  reviewForm: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  reviewInput: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  submitReviewBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  submitReviewText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.text,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});
