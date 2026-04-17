import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

const INSIGHT_TYPES = ["SPENDING_PATTERN", "SAVING_TIP", "ANOMALY_DETECTION"];

function formatType(type) {
  if (type === "SPENDING_PATTERN") return "Padrao de gastos";
  if (type === "SAVING_TIP") return "Dica de economia";
  return "Deteccao de anomalia";
}

export default function InsightsScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [insights, setInsights] = useState([]);
  const [content, setContent] = useState("");
  const [insightType, setInsightType] = useState("SAVING_TIP");
  const [submitting, setSubmitting] = useState(false);

  const loadInsights = async () => {
    try {
      const data = await financeApi.listInsightsByUser(token, userId);
      setInsights(data || []);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadInsights();
    }
  }, [isAuthenticated, token, userId]);

  const createInsight = async () => {
    if (!content) {
      Alert.alert("Validação", "Escreva o insight.");
      return;
    }

    try {
      setSubmitting(true);
      await financeApi.createInsight(token, {
        userId: Number(userId),
        insightType,
        content,
      });
      setContent("");
      await loadInsights();
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
        <Text style={styles.title}>Insights de IA</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registrar insight</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Conteudo do insight"
            value={content}
            onChangeText={setContent}
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

          <TouchableOpacity style={styles.primaryButton} onPress={createInsight} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "Salvando..." : "Salvar insight"}</Text>
          </TouchableOpacity>
        </View>

        {insights.map((insight) => (
          <View key={String(insight.id)} style={styles.insightCard}>
            <Text style={styles.insightType}>{formatType(insight.insightType)}</Text>
            <Text style={styles.insightText}>{insight.content}</Text>
            <Text style={styles.insightDate}>{insight.generatedAt}</Text>
          </View>
        ))}
      <BarraDeNavegacao abaAtiva="home" />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 110 },
  title: { fontSize: 27, fontWeight: "800", color: COLORS.navy, marginBottom: 10 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 12,
    ...SHADOW,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8, color: COLORS.navy },
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
  tag: { backgroundColor: "#F3E8FF", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
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
  insightCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 8,
  },
  insightType: { color: COLORS.purple, fontWeight: "700", marginBottom: 4 },
  insightText: { color: COLORS.navy, lineHeight: 20 },
  insightDate: { marginTop: 5, fontSize: 12, color: COLORS.indigo },
});
