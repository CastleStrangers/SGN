import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { getActiveSurvey, voteSurvey, getSurveyResults } from "../lib/surveys";
import { getToken } from "../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../lib/i18n-context";

export default function SurveysScreen() {
  const { t, isRTL } = useI18n();
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    loadSurvey();
  }, []);

  async function loadSurvey() {
    try {
      const s = await getActiveSurvey();
      setSurvey(s);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleVote() {
    if (!selectedOption || !survey) return;
    const token = await getToken();
    if (!token) {
      Alert.alert(t("common.error"), t("favorites.loginRequired"));
      return;
    }
    setVoting(true);
    try {
      await voteSurvey(survey.id, selectedOption);
      setHasVoted(true);
      setShowResults(true);
      loadResults();
    } catch (e: any) {
      if (e.message?.includes("already voted")) {
        setHasVoted(true);
        setShowResults(true);
        loadResults();
      } else {
        Alert.alert(t("common.error"), t("surveys.voteError"));
      }
    }
    setVoting(false);
  }

  async function loadResults() {
    if (!survey) return;
    try {
      const r = await getSurveyResults(survey.id);
      setResults(r);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleViewResults() {
    setShowResults(true);
    loadResults();
  }

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />;
  }

  if (!survey) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Ionicons name="documents-outline" size={64} color={COLORS.border} />
        <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 16, textAlign: "center" }}>{t("surveys.noActiveSurvey")}</Text>
      </View>
    );
  }

  const totalVotes = survey._count?.votes || 0;

  if (showResults && results) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.text, marginBottom: 4 }}>{survey.title}</Text>
          {survey.description && <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 }}>{survey.description}</Text>}
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 16 }}>{t("surveys.totalVotes")}: {results._count?.votes || totalVotes}</Text>
          {results.options?.map((opt: any) => {
            const votes = opt._count?.votes || opt.votes || 0;
            const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            return (
              <View key={opt.id} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 14, color: COLORS.text }}>{opt.text}</Text>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>{pct}% ({votes})</Text>
                </View>
                <View style={{ height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                  <View style={{ width: `${pct}%`, height: "100%", backgroundColor: COLORS.primary, borderRadius: 4 }} />
                </View>
              </View>
            );
          })}
        </View>
        <TouchableOpacity onPress={() => setShowResults(false)} style={{ alignItems: "center", paddingVertical: 12 }}>
          <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>{t("surveys.backToSurvey")}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ backgroundColor: COLORS.card, borderRadius: 16, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.text, marginBottom: 4 }}>{survey.title}</Text>
        {survey.description && <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 }}>{survey.description}</Text>}

        {survey.options?.map((opt: any) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setSelectedOption(opt.id)}
            disabled={hasVoted}
            style={{
              flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", gap: 12,
              paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8,
              backgroundColor: selectedOption === opt.id ? "#d1fae5" : COLORS.background,
              borderWidth: 1, borderColor: selectedOption === opt.id ? COLORS.success : COLORS.border,
            }}
          >
            <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selectedOption === opt.id ? COLORS.success : COLORS.textSecondary, justifyContent: "center", alignItems: "center" }}>
              {selectedOption === opt.id && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success }} />}
            </View>
            <Text style={{ fontSize: 15, color: COLORS.text, flex: 1 }}>{opt.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleVote}
        disabled={!selectedOption || voting}
        style={{ backgroundColor: selectedOption ? COLORS.primary : COLORS.border, borderRadius: 16, paddingVertical: 14, alignItems: "center" }}
      >
        {voting ? <ActivityIndicator color="#fff" /> : <Text style={{ color: selectedOption ? "#fff" : COLORS.textSecondary, fontWeight: "bold", fontSize: 16 }}>{t("surveys.submitVote")}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleViewResults} style={{ alignItems: "center", paddingVertical: 12 }}>
        <Text style={{ color: COLORS.primary, fontWeight: "600", fontSize: 14 }}>{t("surveys.results")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
