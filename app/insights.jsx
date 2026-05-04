import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { formatDateTime } from "../utils/dateFormatter";
import { router } from "expo-router";


const INSIGHT_TYPES = ["SPENDING_PATTERN", "SAVING_TIP", "ANOMALY_DETECTION"];

function formatType(type) {
  if (type === "SPENDING_PATTERN") return "Padrão De Gastos";
  if (type === "SAVING_TIP") return "Dica De Economia";
  return "Detecção De Anomalia";
}

export default function InsightsScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [insights, setInsights] = useState([]);
  const [specification, setSpecification] = useState("");
  const [insightType, setInsightType] = useState("SAVING_TIP");
  const [submitting, setSubmitting] = useState(false);

  const loadInsights = async () => {
    try {
      const data = await financeApi.listInsightsByUser(token, userId);
      const sorted = (data || []).slice().sort((a, b) =>
        new Date(b.generatedAt) - new Date(a.generatedAt),
      );
      setInsights(sorted);
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao carregar insights.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadInsights();
    }
  }, [isAuthenticated, token, userId]);

  const generateInsight = async () => {
    if (!specification) {
      Alert.alert("Validação", "Digite a especificação da necessidade.");
      return;
    }

    try {
      setSubmitting(true);
      await financeApi.generateInsight(token, {
        insightType,
        specification,
      });
      setSpecification("");
      await loadInsights();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao gerar insight.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insights De IA</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pedir Insight de IA</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          placeholder="Especifique sua necessidade (ex: Como posso economizar mais no transporte?)"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          value={specification}
          onChangeText={setSpecification}
        />

        <View style={styles.typeRow}>
          {INSIGHT_TYPES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tag, insightType === item && styles.tagActive]}
              onPress={() => setInsightType(item)}
            >
              <Text style={styles.tagText}>{formatType(item)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={generateInsight}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Gerando..." : "Gerar Insight"}
          </Text>
        </TouchableOpacity>
      </View>

      {insights.map((insight) => (
        <TouchableOpacity
          key={String(insight.id)}
          style={styles.notificationCard}
          onPress={() => router.push(`/insights/${insight.id}`)}
        >
          <Text style={styles.notificationTitle}>
            {formatType(insight.insightType)}
          </Text>
          <Text style={styles.notificationDate}>
            {formatDateTime(insight.generatedAt)}
          </Text>
        </TouchableOpacity>
      ))}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.navy,
    marginBottom: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 12,
    ...SHADOW,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: COLORS.navy,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  textArea: { minHeight: 92, textAlignVertical: "top" },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  tag: {
    backgroundColor: "#F3E8FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tagActive: { backgroundColor: COLORS.purple },
  tagText: { color: COLORS.navy, fontWeight: "600", fontSize: 12 },
  primaryButton: {
    marginTop: 6,
    backgroundColor: COLORS.indigo,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "700" },
  notificationCard: {
    backgroundColor: "#F8F7FF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E0F8",
    marginBottom: 12,
    padding: 14,
  },
  notificationTitle: { color: COLORS.purple, fontWeight: "700", marginBottom: 6 },
  notificationDate: { color: COLORS.indigo, fontSize: 12 },
  insightType: { color: COLORS.purple, fontWeight: "700", marginBottom: 4 },
  insightText: { color: COLORS.navy, lineHeight: 20 },
  insightDate: { marginTop: 5, fontSize: 12, color: COLORS.indigo },
});
