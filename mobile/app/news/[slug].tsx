import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { getNewsDetail, addFavorite, removeFavorite } from "../../lib/news";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../../lib/api";
import { useI18n } from "../../lib/i18n-context";
import { formatDate } from "../../lib/date";

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { t, isRTL, locale } = useI18n();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (slug) loadPost();
  }, [slug]);

  async function loadPost() {
    try {
      const data = await getNewsDetail(slug);
      setPost(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function toggleFavorite() {
    const token = await getToken();
    if (!token) {
      Alert.alert(t("common.error"), t("news.detail.favoriteAddRequired"));
      router.push("/login");
      return;
    }
    try {
      if (isFavorited) {
        await removeFavorite(post.id);
        setIsFavorited(false);
      } else {
        await addFavorite(post.id);
        setIsFavorited(true);
      }
    } catch (e: any) {
      Alert.alert(t("common.error"), e.message);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: COLORS.textSecondary }}>{t("news.detail.notFound")}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {post.image && (
        <Image source={{ uri: post.image }} style={{ width: "100%", height: 240 }} resizeMode="cover" />
      )}

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <View style={{ flexDirection: isRTL ? "row-reverse" : "row", gap: 8, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: COLORS.accent, fontWeight: "600", backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border }}>
              {post.category}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{post.author?.name}</Text>
          </View>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={isFavorited ? COLORS.error : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.text, lineHeight: 30, marginBottom: 8 }}>
          {post.title}
        </Text>

        <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>
          {formatDate(post.createdAt, locale, { year: "numeric", month: "long", day: "numeric" })}
        </Text>

        <View style={{ width: "100%", height: 1, backgroundColor: COLORS.border, marginBottom: 16 }} />

        <Text style={{ fontSize: 15, color: COLORS.text, lineHeight: 26 }}>
          {post.content}
        </Text>

        {post.source && (
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 20, fontStyle: "italic" }}>
            {t("news.detail.source")}: {post.source}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
