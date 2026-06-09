import { View, Image, FlatList, TouchableOpacity, ActivityIndicator, Text, Modal } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { getGalleryImages } from "../lib/gallery";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

export default function GalleryScreen() {
  const { t, isRTL } = useI18n();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {images.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="images-outline" size={64} color={COLORS.border} />
          <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 16 }}>{t("gallery.noImages")}</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          numColumns={2}
          contentContainerStyle={{ padding: 8, gap: 8 }}
          columnWrapperStyle={{ gap: 8 }}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              onPress={() => setSelectedImage(item.image)}
              style={{ flex: 1, aspectRatio: 1, borderRadius: 12, overflow: "hidden" }}
            >
              <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
            </TouchableOpacity>
          )}
          keyExtractor={(item: any) => item.id}
        />
      )}

      <Modal visible={!!selectedImage} transparent animationType="fade" onRequestClose={() => setSelectedImage(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" }} onPress={() => setSelectedImage(null)}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={{ width: "90%", aspectRatio: 1 }} resizeMode="contain" />
          )}
          <TouchableOpacity style={{ position: "absolute", top: 50, right: 20 }} onPress={() => setSelectedImage(null)}>
            <Ionicons name="close-circle" size={36} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
