import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { getFavorites, removeFavorite } from "../../lib/news";
import { getToken } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";

export default function FavoritesScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = await getToken();
    if (!token) {
      Alert.alert(t("common.error"), t("favorites.loginRequired"));
      router.push("/login");
      return;
    }
    loadFavorites();
  }

  async function loadFavorites() {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleRemove(postId: string) {
    try {
      await removeFavorite(postId);
      setFavorites(prev => prev.filter(f => f.postId !== postId));
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message || t("favorites.removeError"));
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background }}>
        <Ionicons name="heart-outline" size={64} color={COLORS.border} />
        <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 16 }}>{t("favorites.empty")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <FlatList
        data={favorites}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }: { item: any }) => (
          <TouchableOpacity
            onPress={() => router.push(`/news/${item.post.slug}`)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            {item.post.image && (
              <Image source={{ uri: item.post.image }} style={{ width: 100, height: 100 }} resizeMode="cover" />
            )}
            <View style={{ flex: 1, padding: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: COLORS.text, marginBottom: 4 }} numberOfLines={2}>
                {item.post.title}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                {item.post.category} • {new Date(item.createdAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
              </Text>
              <TouchableOpacity onPress={() => handleRemove(item.postId)} style={{ marginTop: 8, alignSelf: "flex-start" }}>
                <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
}
