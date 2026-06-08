import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { formatMoneyBRL, moneyValue, parseMoneyInput, sanitizeMoneyInput } from "../utils/money";

const ACCOUNT_TYPES = [
  "WALLET",
  "BANK",
  "SAVINGS",
  "CREDIT_CARD",
  "INVESTMENT",
];

const ACCOUNT_TYPE_LABELS = {
  WALLET: "wallet",
  BANK: "bank",
  SAVINGS: "savings",
  CREDIT_CARD: "credit_card",
  INVESTMENT: "investment",
};

function money(value) {
  return formatMoneyBRL(value);
}

export default function ContasScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();
  const { t } = useI18n();

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedReassignCategoryId, setSelectedReassignCategoryId] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("WALLET");
  const [balance, setBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    item: null,
    step: "main",
  });

  const handleBalanceChange = (value) => {
    setBalance(sanitizeMoneyInput(value));
  };

  const loadAccounts = async () => {
    try {
      const data = await financeApi.listAccountsByUser(token, userId);
      setAccounts(data || []);
    } catch (error) {
      Alert.alert(t("error"), error.message || t("error_loading_accounts"));
    }
  };

  const loadCategories = async () => {
    try {
      const data = await financeApi.listCategoriesByUser(token, userId);
      setCategories(data || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAccounts();
    }
  }, [isAuthenticated, token, userId]);
  useEffect(() => {
    if (isAuthenticated) loadCategories();
  }, [isAuthenticated, token, userId]);

  const total = useMemo(
    () =>
      accounts.reduce((acc, account) => acc + moneyValue(account.balance), 0),
    [accounts],
  );

  const createAccount = async () => {
    if (!name) {
      return;
    }

    const parsedBalance = balance.trim() ? parseMoneyInput(balance) : 0;
    if (!Number.isFinite(parsedBalance)) {
      Alert.alert(t("error"), "Informe um valor válido.");
      return;
    }

    try {
      setSubmitting(true);

      await financeApi.createAccount(token, {
        userId: Number(userId),
        name,
        type,
        balance: parsedBalance,
      });
      setName("");
      setBalance("");
      await loadAccounts();
    } catch (error) {
      Alert.alert(t("error"), error.message || t("error_creating_account"));
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () =>
    setDeleteModal({ visible: false, item: null, step: "main" });

  const otherAccounts = useMemo(() => {
    if (!deleteModal.item) return [];
    return accounts.filter((a) => a.id !== deleteModal.item.id);
  }, [deleteModal.item, accounts]);

  const handleDeleteConfirm = async (reassignToAccountId = null, reassignCategoryId = null) => {
    if (!deleteModal.item) return;
    try {
      await financeApi.deleteAccount(
        token,
        deleteModal.item.id,
        reassignToAccountId,
        reassignCategoryId,
      );
      await loadAccounts();
    } catch (error) {
      Alert.alert(t("error"), error.message || t("error_deleting_account"));
    } finally {
      closeModal();
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("accounts")}</Text>
      <Text style={styles.total}>{t("total_balance")} {money(total)}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("new_account")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("account_name")}
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t("initial_balance")}
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          keyboardType="decimal-pad"
          value={balance}
          onChangeText={handleBalanceChange}
        />

        <View style={styles.types}>
          {ACCOUNT_TYPES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tag, type === item && styles.tagActive]}
              onPress={() => setType(item)}
            >
              <Text style={styles.tagText}>{t(ACCOUNT_TYPE_LABELS[item])}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={createAccount}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? t("creating") : t("create")}
          </Text>
        </TouchableOpacity>
      </View>

      {accounts.map((account) => (
        <View key={String(account.id)} style={styles.accountItem}>
          <View style={styles.itemRow}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountMeta}>{account.type}</Text>
              <Text style={styles.accountBalance}>
                {money(account.balance)}
              </Text>
            </View>
              <TouchableOpacity
                onPress={() =>
                  setDeleteModal({ visible: true, item: account, step: "main" })
                }
                style={styles.deleteBtn}
              >
              <Text style={styles.deleteText}>{t("delete")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal transparent animationType="fade" visible={deleteModal.visible}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  {deleteModal.step === "main" && (
                    <>
                      <Text style={styles.modalTitle}>{t("delete_account")}</Text>
                      <Text style={styles.modalMessage}>
                        {t("accounts")} {" "}
                        <Text style={{ fontWeight: "700" }}>
                          "{deleteModal.item?.name}"
                        </Text>{" "}
                        {t("delete_confirmation")}
                      </Text>

                      <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => handleDeleteConfirm(null)}
                      >
                        <Text style={styles.modalBtnText}>
                          Excluir transações relacionadas
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.modalReassignBtn,
                          otherAccounts.length === 0 && { opacity: 0.5 },
                        ]}
                        onPress={() =>
                          otherAccounts.length > 0 && setDeleteModal((prev) => ({ ...prev, step: "reassign" }))
                        }
                        disabled={otherAccounts.length === 0}
                      >
                        <Text style={styles.modalReassignBtnText}>
                          {otherAccounts.length > 0
                            ? "Reatribuir transações..."
                            : "Reatribuir transações (nenhuma outra conta)"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalCancelBtn}
                        onPress={closeModal}
                      >
                        <Text style={styles.modalCancelText}>{t("cancel")}</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {deleteModal.step === "reassign" && (
                    <>
                      <Text style={styles.modalTitle}>Reatribuir para</Text>
                      <Text style={styles.modalMessage}>
                        Escolha a conta de destino:
                      </Text>

                      <Text style={{ marginBottom: 6, color: COLORS.navy, fontWeight: "600" }}>
                        Opcional - alterar categoria
                      </Text>
                      <View style={{ marginBottom: 8, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        <TouchableOpacity
                          key="none-cat"
                          style={[styles.tag, selectedReassignCategoryId === null && styles.tagActive]}
                          onPress={() => setSelectedReassignCategoryId(null)}
                        >
                          <Text style={styles.tagText}>Manter categorias</Text>
                        </TouchableOpacity>
                        {categories.map((c) => (
                          <TouchableOpacity
                            key={String(c.id)}
                            style={[styles.tag, selectedReassignCategoryId === c.id && styles.tagActive]}
                            onPress={() => setSelectedReassignCategoryId(c.id)}
                          >
                            <Text style={styles.tagText}>{c.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {otherAccounts.map((a) => (
                        <TouchableOpacity
                          key={String(a.id)}
                          style={styles.modalTargetBtn}
                          onPress={() => handleDeleteConfirm(a.id, selectedReassignCategoryId)}
                        >
                          <Text style={styles.modalTargetBtnText}>{a.name}</Text>
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
  title: { fontSize: 27, fontWeight: "800", color: COLORS.navy },
  total: {
    marginTop: 6,
    color: COLORS.indigo,
    marginBottom: 12,
    fontWeight: "700",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 14,
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
  types: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  tag: {
    backgroundColor: "#F3E8FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tagActive: { backgroundColor: COLORS.purple },
  tagText: { fontSize: 12, fontWeight: "600", color: COLORS.navy },
  primaryButton: {
    marginTop: 6,
    backgroundColor: COLORS.indigo,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "700" },
  accountItem: {
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
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  accountInfo: { flex: 1, marginRight: 12 },
  accountName: { color: COLORS.navy, fontWeight: "600" },
  accountMeta: { marginTop: 2, color: COLORS.indigo, fontSize: 12 },
  accountBalance: { color: COLORS.navy, fontWeight: "700", marginTop: 6 },
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
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  modalBtnText: {
    color: "#DC2626",
    fontWeight: "700",
  },
  modalReassignBtn: {
    backgroundColor: "#FFE5CC",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  modalReassignBtnText: {
    color: "#D97706",
    fontWeight: "700",
  },
  modalTargetBtn: {
    backgroundColor: "#F3E8FF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  modalTargetBtnText: {
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
