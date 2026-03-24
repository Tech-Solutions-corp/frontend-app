import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

const IMPORT_STATUS = ["PROCESSING", "COMPLETED", "FAILED"];

export default function ImportacoesScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [imports, setImports] = useState([]);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("PROCESSING");
  const [submitting, setSubmitting] = useState(false);

  const loadImports = async () => {
    try {
      const data = await financeApi.listImportsByUser(token, userId);
      setImports(data || []);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadImports();
    }
  }, [isAuthenticated, token, userId]);

  const createImport = async () => {
    if (!fileName) {
      Alert.alert("Validação", "Informe o nome do arquivo.");
      return;
    }

    try {
      setSubmitting(true);
      await financeApi.createImport(token, {
        userId: Number(userId),
        fileName,
        status,
      });
      setFileName("");
      await loadImports();
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
        <Text style={styles.title}>Importacoes</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registrar importacao</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do arquivo (csv)"
            value={fileName}
            onChangeText={setFileName}
          />

          <View style={styles.row}>
            {IMPORT_STATUS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.tag, status === item && styles.tagActive]}
                onPress={() => setStatus(item)}
              >
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={createImport} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "Salvando..." : "Salvar"}</Text>
          </TouchableOpacity>
        </View>

        {imports.map((item) => (
          <View key={String(item.id)} style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{item.fileName}</Text>
              <Text style={styles.itemMeta}>{item.importedAt}</Text>
            </View>
            <Text style={styles.itemStatus}>{item.status}</Text>
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
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
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
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { color: COLORS.navy, fontWeight: "600" },
  itemMeta: { marginTop: 2, color: COLORS.indigo, fontSize: 12 },
  itemStatus: { color: COLORS.purple, fontWeight: "700" },
});
