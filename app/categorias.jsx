import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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

  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    item: null,
    step: "main",
  });

  const loadCategories = async () => {
    try {
      const data = await financeApi.listCategoriesByUser(token, userId);
      setCategories(data || []);
    } catch (error) {}
  };

  useEffect(() => {
    if (isAuthenticated) loadCategories();
  }, [isAuthenticated, token, userId]);

  const grouped = useMemo(
    () => ({
      expense: categories.filter((c) => c.type === "EXPENSE"),
      income: categories.filter((c) => c.type === "INCOME"),
    }),
    [categories],
  );

  const createCategory = async () => {
    if (!name) return;
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
    } finally {
      setSubmitting(false);
    }
  };

  const otherCategories = useMemo(() => {
    if (!deleteModal.item) return [];
    return categories.filter(
      (c) => c.id !== deleteModal.item.id && c.type === deleteModal.item.type,
    );
  }, [deleteModal.item, categories]);

  const closeModal = () =>
    setDeleteModal({ visible: false, item: null, step: "main" });

  const handleDeleteConfirm = async (reassignId = null) => {
    try {
      await financeApi.deleteCategory(token, deleteModal.item.id, reassignId);
      await loadCategories();
    } catch (error) {
    } finally {
      closeModal();
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Categorias</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nova Categoria</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
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
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={createCategory}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Criando..." : "Criar Categoria"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.section}>Despesas</Text>
      {grouped.expense.map((item) => (
        <View key={String(item.id)} style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({ visible: true, item, step: "main" })
              }
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={styles.section}>Receitas</Text>
      {grouped.income.map((item) => (
        <View key={String(item.id)} style={styles.item}>
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({ visible: true, item, step: "main" })
              }
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Modal de exclusão */}
      <Modal transparent animationType="fade" visible={deleteModal.visible}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                {deleteModal.step === "main" && (
                  <>
                    <Text style={styles.modalTitle}>Excluir Categoria</Text>
                    <Text style={styles.modalMessage}>
                      O que deseja fazer com os registros associados à categoria{" "}
                      <Text style={{ fontWeight: "700" }}>
                        "{deleteModal.item?.name}"
                      </Text>
                      ?
                    </Text>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => handleDeleteConfirm(null)}
                    >
                      <Text style={styles.modalBtnText}>
                        Remover (Deixar Sem Categoria)
                      </Text>
                    </TouchableOpacity>
                    {otherCategories.length > 0 && (
                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() =>
                          setDeleteModal((prev) => ({
                            ...prev,
                            step: "reassign",
                          }))
                        }
                      >
                        <Text style={styles.modalBtnText}>Reatribuir...</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.modalCancelBtn}
                      onPress={closeModal}
                    >
                      <Text style={styles.modalCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {deleteModal.step === "reassign" && (
                  <>
                    <Text style={styles.modalTitle}>Reatribuir Para</Text>
                    <Text style={styles.modalMessage}>
                      Escolha a categoria destino:
                    </Text>
                    {otherCategories.map((c) => (
                      <TouchableOpacity
                        key={String(c.id)}
                        style={styles.modalBtn}
                        onPress={() => handleDeleteConfirm(c.id)}
                      >
                        <Text style={styles.modalBtnText}>{c.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.modalCancelBtn}
                      onPress={closeModal}
                    >
                      <Text style={styles.modalCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  row: { flexDirection: "row", gap: 8, marginBottom: 8 },
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
  section: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
  },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 8,
  },
  itemText: { color: COLORS.navy, fontWeight: "600" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  deleteText: { color: "#DC2626", fontWeight: "700" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: COLORS.indigo,
    marginBottom: 16,
  },
  modalBtn: {
    backgroundColor: "#F3E8FF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  modalBtnText: {
    color: COLORS.navy,
    fontWeight: "600",
  },
  modalCancelBtn: {
    marginTop: 4,
    alignItems: "center",
    paddingVertical: 10,
  },
  modalCancelText: {
    color: COLORS.indigo,
    fontWeight: "600",
  },
});
