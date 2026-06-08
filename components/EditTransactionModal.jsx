import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import {
  parseMoneyInput,
  sanitizeMoneyInput,
  formatMoneyBRL,
} from "../utils/money";
import { COLORS } from "../constants/theme";

export default function EditTransactionModal({
  visible,
  transaction,
  accounts = [],
  categories = [],
  onClose,
  onSave,
  onDelete,
  saving = false,
  deleting = false,
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [accountId, setAccountId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.transactionDescription || "");
      setAmount(formatMoneyBRL(transaction.amount).replace("R$ ", ""));
      setType(transaction.transactionType || "EXPENSE");
      setAccountId(String(transaction.accountId));
      setCategoryId(
        transaction.categoryId ? String(transaction.categoryId) : null,
      );
    } else {
      setDescription("");
      setAmount("");
      setType("EXPENSE");
      setAccountId(null);
      setCategoryId(null);
    }
    setConfirmingDelete(false);
  }, [transaction]);

  const showValidationError = (message) => {
    if (Platform.OS === "web") {
      window.alert(message);
    } else {
      Alert.alert("Validação", message);
    }
  };

  const handleSave = async () => {
    if (!description || !amount) {
      showValidationError("Descrição e valor são obrigatórios.");
      return;
    }

    const parsed = parseMoneyInput(amount);
    if (!Number.isFinite(parsed)) {
      showValidationError("Informe um valor válido.");
      return;
    }

    if (!transaction || !transaction.id) {
      showValidationError("Transação inválida.");
      return;
    }

    const payload = {
      accountId: Number(accountId),
      categoryId: categoryId ? Number(categoryId) : null,
      transactionDescription: description,
      amount: parsed,
      transactionType: type,
    };

    try {
      if (onSave) await onSave(transaction.id, payload);
    } catch (e) {
      // parent shows error
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!transaction || !transaction.id) return;
    try {
      if (onDelete) await onDelete(transaction.id);
    } catch (e) {
      // parent shows error
    } finally {
      setConfirmingDelete(false);
    }
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.card}>
          <Text style={styles.title}>Editar Transação</Text>

          <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor="rgba(26, 26, 46, 0.55)"
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Valor"
            placeholderTextColor="rgba(26, 26, 46, 0.55)"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={(v) => setAmount(sanitizeMoneyInput(v))}
          />

          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
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

          <Text style={styles.label}>Conta</Text>
          <View style={styles.inlineRowWrap}>
            {accounts.map((a) => (
              <TouchableOpacity
                key={String(a.id)}
                style={[
                  styles.tag,
                  accountId === String(a.id) && styles.tagActive,
                ]}
                onPress={() => setAccountId(String(a.id))}
              >
                <Text style={styles.tagText}>{a.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.inlineRowWrap}>
            {categories
              .filter((c) => c.type === type)
              .map((c) => (
                <TouchableOpacity
                  key={String(c.id)}
                  style={[
                    styles.tag,
                    categoryId === String(c.id) && styles.tagActive,
                  ]}
                  onPress={() => setCategoryId(String(c.id))}
                >
                  <Text style={styles.tagText}>{c.name}</Text>
                </TouchableOpacity>
              ))}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Text>
          </TouchableOpacity>

          {confirmingDelete ? (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>
                Tem certeza que deseja deletar esta transação?
              </Text>
              <View style={styles.confirmRow}>
                <TouchableOpacity
                  style={styles.confirmCancelButton}
                  onPress={() => setConfirmingDelete(false)}
                  disabled={deleting}
                >
                  <Text style={styles.confirmCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmDeleteButton}
                  onPress={handleDeleteConfirmed}
                  disabled={deleting}
                >
                  <Text style={styles.confirmDeleteText}>
                    {deleting ? "Deletando..." : "Confirmar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setConfirmingDelete(true)}
              disabled={saving || deleting}
            >
              <Text style={styles.deleteButtonText}>Deletar Transação</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
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
  label: {
    marginTop: 4,
    marginBottom: 5,
    color: COLORS.indigo,
    fontWeight: "600",
  },
  inlineRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3E8FF",
  },
  tagActive: { backgroundColor: COLORS.purple },
  tagText: { color: COLORS.navy, fontWeight: "600", fontSize: 12 },
  primaryButton: {
    marginTop: 8,
    backgroundColor: COLORS.indigo,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "700" },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  deleteButtonText: { color: "#DC2626", fontWeight: "700" },
  confirmBox: {
    marginTop: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 12,
  },
  confirmText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 10,
    textAlign: "center",
  },
  confirmRow: {
    flexDirection: "row",
    gap: 8,
  },
  confirmCancelButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.purple,
    alignItems: "center",
    paddingVertical: 10,
  },
  confirmCancelText: { color: COLORS.navy, fontWeight: "600", fontSize: 13 },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  confirmDeleteText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  cancelButton: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelButtonText: { color: COLORS.indigo, fontWeight: "600" },
});
