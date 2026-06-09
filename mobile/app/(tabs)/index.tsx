import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/colors";
import { getNews } from "../../lib/news";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../../lib/i18n-context";

export default function HomeScreen() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const categories = [
    t("home.all"),
    "أخبار الجالية",
    "ثقافة وفن",
    "خدمات",
    "عمل إنساني",
    "رياضة",
    "تكنولوجيا",
  ];

  useEffect(() => {
    loadNews();
  }, [category]);

  async function loadNews() {
    setLoading(true);
    try {
      const data = await getNews(1, category || undefined);
      setPosts(Array.isArray(data) ? data : data.posts || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const filtered = search
    ? posts.filter((p: any) => p.title?.includes(search))
    : posts;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12 }}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("home.searchPlaceholder")}
            placeholderTextColor={COLORS.textSecondary}
            style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 8, fontSize: 14, textAlign: isRTL ? "right" : "left" }}
          />
        </View>
      </View>

      {/* Category filter */}
      <FlatList
        horizontal
        data={categories}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        style={{ maxHeight: 44, marginBottom: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCategory(item === t("home.all") ? "" : item)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: (item === t("home.all") && !category) || category === item ? COLORS.primary : "#fff",
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{ color: (item === t("home.all") && !category) || category === item ? "#fff" : COLORS.text, fontSize: 13, fontWeight: "500" }}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
      />

      {/* News list */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              onPress={() => router.push(`/news/${item.slug}`)}
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              {item.image && (
                <Image source={{ uri: item.image }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
              )}
              <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 11, color: COLORS.accent, fontWeight: "600", marginBottom: 4 }}>
                  {item.category}
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold", color: COLORS.text, marginBottom: 6, lineHeight: 22 }}>
                  {item.title}
                </Text>
                {item.excerpt && (
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 8 }} numberOfLines={2}>
                    {item.excerpt}
                  </Text>
                )}
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                    {item.author?.name} • {new Date(item.createdAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                  </Text>
                  <Ionicons name="eye-outline" size={16} color={COLORS.textSecondary} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item: any) => item.id}
        />
      )}
    </View>
  );
}
