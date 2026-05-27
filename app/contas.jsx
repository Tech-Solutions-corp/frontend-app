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
  return `R$ ${Number(value || 0)
    .toFixed(2)
    .replace(".", ",")}`;
}

export default function ContasScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();
  const { t } = useI18n();

  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("WALLET");
  const [balance, setBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    item: null,
  });

  const handleBalanceChange = (value) => {
    const sanitized = value.replace(/[^0-9.,]/g, "");
    const [whole, decimalPart] = sanitized.split(/[,\.]/);
    if (decimalPart !== undefined) {
      setBalance(
        `${whole || "0"},${decimalPart.replace(/[^0-9]/g, "")}`,
      );
      return;
    }
    setBalance(whole);
  };

  const loadAccounts = async () => {
    try {
      const data = await financeApi.listAccountsByUser(token, userId);
      setAccounts(data || []);
    } catch (error) {
      Alert.alert(t("error"), error.message || t("error_loading_accounts"));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAccounts();
    }
  }, [isAuthenticated, token, userId]);

  const total = useMemo(
    () =>
      accounts.reduce((acc, account) => acc + Number(account.balance || 0), 0),
    [accounts],
  );

  const createAccount = async () => {
    if (!name) {
      return;
    }

    try {
      setSubmitting(true);
      await financeApi.createAccount(token, {
        userId: Number(userId),
        name,
        type,
        balance: Number(balance.replace(",", ".")),
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

  const closeModal = () => setDeleteModal({ visible: false, item: null });

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    try {
      await financeApi.deleteAccount(token, deleteModal.item.id);
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
              onPress={() => setDeleteModal({ visible: true, item: account })}
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
                  onPress={handleDeleteConfirm}
                >
                  <Text style={styles.modalBtnText}>{t("confirm_deletion")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={closeModal}
                >
                  <Text style={styles.modalCancelText}>{t("cancel")}</Text>
                </TouchableOpacity>
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
