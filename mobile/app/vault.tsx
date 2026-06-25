import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, StyleSheet, Modal } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { apiFetch } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "../constants/api";

interface Doc {
  id: string;
  title: string;
  fileUrl: string;
  category: string | null;
  analysis: string | null;
  createdAt: string;
}

export default function VaultScreen() {
  const { t, isRTL } = useI18n();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      const data = await apiFetch("/member/vault");
      if (data?.documents) setDocs(data.documents);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      handleUpload(result.assets[0].uri);
    }
  }

  async function handleUpload(uri: string) {
    setUploading(true);
    try {
      // 1. Upload to server
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "document.jpg",
        type: "image/jpeg",
      } as any);

      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.url) throw new Error("Upload failed");

      // 2. Save to vault with AI analysis
      await apiFetch("/member/vault", {
        method: "POST",
        body: JSON.stringify({
          title: "New Document",
          fileUrl: uploadData.url,
          category: "letter",
          analyze: true
        }),
      });

      loadDocs();
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message);
    }
    setUploading(false);
  }

  async function deleteDoc(id: string) {
    Alert.alert(t("common.error"), t("memberProfilePage.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.ok"), style: "destructive", onPress: async () => {
        try {
          await apiFetch(`/member/vault/${id}`, { method: "DELETE" });
          loadDocs();
          setSelectedDoc(null);
        } catch (e) {
          Alert.alert("Error deleting");
        }
      }}
    ]);
  }

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>{t("memberProfilePage.vaultTitle")}</Text>
          <Text style={styles.subtitle}>{t("memberProfilePage.vaultDesc")}</Text>
        </View>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={pickImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              <Text style={styles.uploadBtnText}>{t("memberProfilePage.uploadDoc")}</Text>
            </>
          )}
        </TouchableOpacity>

        {docs.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>{t("memberProfilePage.noDocs")}</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {docs.map((doc) => (
              <TouchableOpacity key={doc.id} style={styles.card} onPress={() => setSelectedDoc(doc)}>
                <Image source={{ uri: doc.fileUrl }} style={styles.thumbnail} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{doc.title}</Text>
                  <Text style={styles.cardDate}>{new Date(doc.createdAt).toLocaleDateString()}</Text>
                  {doc.analysis && <Ionicons name="sparkles" size={14} color={COLORS.accent} style={styles.sparkle} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!selectedDoc} animationType="slide" onRequestClose={() => setSelectedDoc(null)}>
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={[styles.modalHeader, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <TouchableOpacity onPress={() => setSelectedDoc(null)}>
              <Ionicons name="close" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>{selectedDoc?.title}</Text>
            <TouchableOpacity onPress={() => selectedDoc && deleteDoc(selectedDoc.id)}>
              <Ionicons name="trash-outline" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {selectedDoc?.fileUrl && (
              <Image source={{ uri: selectedDoc.fileUrl }} style={styles.fullImage} resizeMode="contain" />
            )}

            {selectedDoc?.analysis && (
              <View style={styles.analysisCard}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Ionicons name="sparkles" size={20} color={COLORS.accent} />
                  <Text style={styles.analysisTitle}>{t("memberProfilePage.analysisResult")}</Text>
                </View>
                <Text style={[styles.analysisText, { textAlign: isRTL ? "right" : "left" }]}>{selectedDoc.analysis}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  uploadBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    gap: 10,
    marginBottom: 24,
  },
  uploadBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { color: COLORS.textSecondary, marginTop: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnail: { width: "100%", height: 120, backgroundColor: "#eee" },
  cardInfo: { padding: 10, position: "relative" },
  cardTitle: { fontSize: 13, fontWeight: "bold", color: COLORS.text },
  cardDate: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  sparkle: { position: "absolute", top: 10, right: 10 },
  modalHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: "center", justifyContent: "space-between" },
  modalHeaderText: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  fullImage: { width: "100%", height: 400, borderRadius: 16, marginBottom: 20 },
  analysisCard: { backgroundColor: `${COLORS.accent}10`, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: `${COLORS.accent}30` },
  analysisTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.accentDark },
  analysisText: { fontSize: 14, lineHeight: 22, color: COLORS.text },
});
