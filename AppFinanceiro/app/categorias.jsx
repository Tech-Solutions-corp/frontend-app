import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function CategoriasScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await financeApi.listCategoriesByUser(token, userId);
      setCategories(data || []);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated, token, userId]);

  const grouped = useMemo(
    () => ({
      expense: categories.filter((c) => c.type === "EXPENSE"),
      income: categories.filter((c) => c.type === "INCOME"),
    }),
    [categories]
  );

  const createCategory = async () => {
    if (!name) {
      Alert.alert("Validação", "Informe o nome da categoria.");
      return;
    }

    try {
      setSubmitting(true);
      await financeApi.createCategory(token, {
        userId: Number(userId),
        name,
        type,
      });
      setName("");
      await loadCategories();
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
        <Text style={styles.title}>Categorias</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nova categoria</Text>
          <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.tag, type === "EXPENSE" && styles.tagActive]}
              onPress={() => setType("EXPENSE")}
            >
              <Text style={styles.tagText}>Despesa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tag, type === "INCOME" && styles.tagActive]}
              onPress={() => setType("INCOME")}
            >
              <Text style={styles.tagText}>Receita</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={createCategory} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "Criando..." : "Criar categoria"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>Despesas</Text>
        {grouped.expense.map((item) => (
          <View key={String(item.id)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        ))}

        <Text style={styles.section}>Receitas</Text>
        {grouped.income.map((item) => (
          <View key={String(item.id)} style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
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
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
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
  section: { marginTop: 12, marginBottom: 6, fontSize: 16, fontWeight: "700", color: COLORS.navy },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 8,
  },
  itemText: { color: COLORS.navy, fontWeight: "600" },
});
