import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useAuth } from "../../context/AuthContext";
import { financeApi } from "../../services/financeApi";
import ThemedScreen from "../../components/ThemedScreen";
import { COLORS, SHADOW } from "../../constants/theme";
import { formatDateTime } from "../../utils/dateFormatter";

function formatType(type) {
  if (type === "SPENDING_PATTERN") return "Padrão De Gastos";
  if (type === "SAVING_TIP") return "Dica De Economia";
  return "Detecção De Anomalia";
}

export default function InsightDetailScreen() {
  const params = useLocalSearchParams();
  const insightId = useMemo(() => {
    if (Array.isArray(params.id)) return params.id[0] || "";
    return params.id || "";
  }, [params.id]);

  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token } = useAuth();

  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsight = async () => {
        if (!token || !insightId) {
            console.log("Guard barrou: token ou insightId ausente");
            return;
        }
            setLoading(true);
        try {
            const data = await financeApi.getInsightById(token, insightId);
            setInsight(data);
        } catch (error) {
            console.log("Erro na requisição:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        loadInsight();
    } else {
        console.log("isAuthenticated é false, não chamou loadInsight");
    }
    }, [isAuthenticated, token, insightId]);

  if (authLoading || !isAuthenticated || loading) {
    return (
      <ThemedScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.purple} />
        </View>
      </ThemedScreen>
    );
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhe do Insight</Text>
      </View>

      {insight ? (
        <View style={styles.card}>
          <Text style={styles.type}>{formatType(insight.insightType)}</Text>
          <Text style={styles.date}>{formatDateTime(insight.generatedAt)}</Text>
          <Text style={styles.content}>{insight.content}</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Insight não encontrado.</Text>
        </View>
      )}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  backButtonText: {
    color: COLORS.purple,
    fontWeight: "700",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.navy,
    flex: 1,
    textAlign: "center",
    marginRight: 48,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 18,
    ...SHADOW,
  },
  type: {
    color: COLORS.purple,
    fontWeight: "700",
    marginBottom: 8,
  },
  date: {
    color: COLORS.indigo,
    fontSize: 12,
    marginBottom: 14,
  },
  content: {
    color: COLORS.navy,
    lineHeight: 22,
    fontSize: 15,
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.indigo,
    textAlign: "center",
  },
});
