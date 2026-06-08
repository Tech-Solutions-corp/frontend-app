import React, { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  Modal,
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
import * as DocumentPicker from "expo-document-picker";

function formatLabel(value = "") {
  return String(value)
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ImportacoesScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [imports, setImports] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileUri, setFileUri] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reprocessingId, setReprocessingId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const hasSelectedFile = Boolean(fileName && fileUri);

  const clearSelectedFile = () => {
    setFileName("");
    setFileUri(null);
    setFileBlob(null);
  };

  const loadImports = async () => {
    try {
      const data = await financeApi.listImportsByUser(token, userId);
      setImports(data || []);
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao carregar importações.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadImports();
      loadAccounts();
    }
  }, [isAuthenticated, token, userId]);

  const createImport = async () => {
    if (!fileUri) {
      Alert.alert("Validação", "Selecione um arquivo CSV antes de continuar.");
      return;
    }

    if (!selectedAccountId) {
      Alert.alert("Validação", "Selecione a conta para importar as transações.");
      return;
    }

    try {
      setSubmitting(true);
      // Upload actual CSV file as multipart/form-data
      await financeApi.createImportFile(token, {
        userId: Number(userId),
        accountId: selectedAccountId,
        file: { uri: fileUri, name: fileName, type: "text/csv", blob: fileBlob },
      });
      clearSelectedFile();
      setSelectedAccountId(null);
      await loadImports();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao registrar importação.");
    } finally {
      setSubmitting(false);
    }
  };

  const reprocessImport = async (importId) => {
    try {
      setReprocessingId(importId);
      const result = await financeApi.reprocessImport(token, importId);
      Alert.alert(
        "Sucesso",
        result?.message || "Importação reprocessada com sucesso.",
      );
      await loadImports();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao reprocessar importação.");
    } finally {
      setReprocessingId(null);
    }
  };

  const loadAccounts = async () => {
    try {
      const data = await financeApi.listAccountsByUser(token, userId);
      setAccounts(data || []);
    } catch (error) {
      // ignore
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/plain", "application/vnd.ms-excel", "*/*"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      const asset = res?.assets?.[0] || null;
      const canceled = Boolean(res?.canceled);
      const legacyCanceled = res?.type === "cancel";

      if (canceled || legacyCanceled) {
        console.log("DocumentPicker cancelled");
        return;
      }

      const selectedUri = asset?.uri || res?.uri || null;
      const selectedName =
        asset?.name || res?.name || (selectedUri ? selectedUri.split("/").pop() : "arquivo.csv");
      const selectedType = asset?.mimeType || res?.mimeType || "text/csv";

      if (!selectedUri) {
        Alert.alert("Erro", "Não foi possível obter o arquivo selecionado.");
        return;
      }

      setFileName(selectedName);
      setFileUri(selectedUri);

      // try to convert uri to blob for reliable upload (Android content:// URIs)
      try {
        const blob = await uriToBlob(selectedUri);
        setFileBlob(blob);
      } catch (e) {
        console.warn("uriToBlob failed", e);
        setFileBlob(null);
      }

      // provide immediate feedback so user knows selection succeeded
      Alert.alert("Arquivo selecionado", selectedName);
      console.log("DocumentPicker result:", res, { selectedUri, selectedName, selectedType });
    } catch (err) {
      console.error("pickDocument error", err);
      Alert.alert("Erro", "Falha ao selecionar o arquivo.");
    }
  };

  // Convert a file URI (including content://) to a Blob using XMLHttpRequest
  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          // response is a blob
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new Error("Failed to fetch file blob"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      } catch (err) {
        reject(err);
      }
    });
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Importações</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registrar Importação</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={pickDocument}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {hasSelectedFile ? "Trocar arquivo CSV" : "Selecionar CSV"}
          </Text>
        </TouchableOpacity>

        <View style={[styles.fileStatusBox, hasSelectedFile ? styles.fileStatusBoxLoaded : styles.fileStatusBoxEmpty]}>
          <Text style={styles.fileStatusLabel}>
            {hasSelectedFile ? "Arquivo carregado" : "Nenhum arquivo selecionado"}
          </Text>
          <Text style={styles.fileStatusName} numberOfLines={1}>
            {hasSelectedFile ? fileName : "Selecione um arquivo CSV para continuar"}
          </Text>
          {hasSelectedFile ? (
            <TouchableOpacity
              onPress={clearSelectedFile}
              style={styles.fileClearButton}
              disabled={submitting}
            >
              <Text style={styles.fileClearButtonText}>Remover arquivo</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={{ marginBottom: 6, color: COLORS.navy }}>Conta de destino</Text>
          <View style={styles.row}>
            {accounts.map((acc) => (
              <TouchableOpacity
                key={acc.id}
                style={[styles.tag, selectedAccountId === acc.id && styles.tagActive]}
                onPress={() => setSelectedAccountId(acc.id)}
                disabled={submitting}
              >
                <Text style={styles.tagText}>{acc.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { marginTop: 10 }]}
          onPress={createImport}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Enviando..." : "Importar"}
          </Text>
        </TouchableOpacity>
      </View>

      {imports.map((item) => (
        <View key={String(item.id)} style={styles.item}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.itemTitle}>{item.fileName}</Text>
            <Text style={styles.itemMeta}>
              {formatDateTime(item.importedAt)}
            </Text>
            <Text style={styles.itemStatus}>{formatLabel(item.status)}</Text>
          </View>
            <TouchableOpacity
              style={[
                styles.reprocessButton,
                reprocessingId === item.id && styles.reprocessButtonDisabled,
              ]}
              onPress={() => reprocessImport(item.id)}
              disabled={reprocessingId === item.id || submitting}
            >
            <Text style={styles.reprocessButtonText}>
              {reprocessingId === item.id ? "Reprocessando..." : "Reprocessar"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal transparent visible={submitting} animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.indigo} />
            <Text style={styles.loadingText}>Importando transações...</Text>
          </View>
        </View>
      </Modal>
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
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
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
  fileStatusBox: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  fileStatusBoxLoaded: {
    borderColor: COLORS.indigo,
    backgroundColor: "#EEF2FF",
  },
  fileStatusBoxEmpty: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  fileStatusLabel: {
    color: COLORS.navy,
    fontWeight: "700",
    fontSize: 13,
  },
  fileStatusName: {
    marginTop: 4,
    color: COLORS.indigo,
    fontSize: 12,
  },
  fileClearButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#E0E7FF",
  },
  fileClearButtonText: {
    color: COLORS.indigo,
    fontWeight: "700",
    fontSize: 12,
  },
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
  reprocessButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#E0E7FF",
    borderWidth: 1,
    borderColor: COLORS.indigo,
  },
  reprocessButtonDisabled: {
    opacity: 0.6,
  },
  reprocessButtonText: {
    color: COLORS.indigo,
    fontWeight: "700",
    fontSize: 12,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    width: "100%",
    maxWidth: 280,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 12,
    ...SHADOW,
  },
  loadingText: {
    color: COLORS.navy,
    fontWeight: "700",
    textAlign: "center",
  },
});
