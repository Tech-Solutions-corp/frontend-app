import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { formatDate } from "../utils/dateFormatter";
import { formatMoneyBRL, parseMoneyInput } from "../utils/money";
import EditTransactionModal from "../components/EditTransactionModal";

function toCurrency(value) {
  return formatMoneyBRL(value);
}

export default function HistoricoScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(false);

  const [editModal, setEditModal] = useState({
    visible: false,
    transaction: null,
    description: "",
    amount: "",
    type: "EXPENSE",
    accountId: null,
    categoryId: null,
  });

  const hasAccounts = accounts.length > 0;

  const loadData = async () => {
    if (!token || !userId) return;
    try {
      const [txData, accountData, categoryData] = await Promise.all([
        financeApi.listTransactionsByUser(token, userId),
        financeApi.listAccountsByUser(token, userId),
        financeApi.listCategoriesByUser(token, userId),
      ]);

      setTransactions(txData || []);
      setAccounts(accountData || []);
      setCategories(categoryData || []);
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao carregar gastos.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, token, userId]);

  const orderedTransactions = useMemo(
    () => [...transactions].reverse(),
    [transactions],
  );

  const openEditModal = (transaction) => {
    setEditModal({
      visible: true,
      transaction,
      description: transaction.transactionDescription,
      amount: formatMoneyBRL(transaction.amount).replace("R$ ", ""),
      type: transaction.transactionType,
      accountId: String(transaction.accountId),
      categoryId: transaction.categoryId
        ? String(transaction.categoryId)
        : null,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      visible: false,
      transaction: null,
      description: "",
      amount: "",
      type: "EXPENSE",
      accountId: null,
      categoryId: null,
    });
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}> Histórico de Transações</Text>

      {orderedTransactions.map((tx) => {
        const account = accounts.find(
          (a) => String(a.id) === String(tx.accountId),
        );
        const category = categories.find(
          (c) => String(c.id) === String(tx.categoryId),
        );
        const isIncome = tx.transactionType === "INCOME";

        return (
          <TouchableOpacity
            key={String(tx.id)}
            onPress={() => openEditModal(tx)}
            activeOpacity={0.8}
          >
            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>
                    {tx.transactionDescription || "Sem Descrição"}
                  </Text>
                  <Text style={styles.itemCategory}>
                    {category?.name || "Sem Categoria"}
                  </Text>
                </View>
                <View
                  style={[
                    styles.typeBadge,
                    isIncome ? styles.incomeBadge : styles.expenseBadge,
                  ]}
                >
                  <Text style={styles.typeBadgeText}>
                    {isIncome ? "Receita" : "Despesa"}
                  </Text>
                </View>
              </View>
              <View style={styles.itemDetails}>
                <View>
                  <Text style={styles.itemMeta}>
                    Conta: {account?.name || "Não Informado"}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {formatDate(tx.transactionDate)}
                  </Text>
                </View>
                <Text style={isIncome ? styles.income : styles.expense}>
                  {isIncome ? "+" : "-"} {toCurrency(tx.amount)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      <EditTransactionModal
        visible={editModal.visible}
        transaction={editModal.transaction}
        accounts={accounts}
        categories={categories}
        onClose={closeEditModal}
        onSave={async (id, payload) => {
          try {
            setRefreshing(true);
            await financeApi.updateTransaction(token, id, {
              userId: Number(userId),
              accountId: Number(payload.accountId),
              categoryId: payload.categoryId
                ? Number(payload.categoryId)
                : null,
              transactionDescription: payload.transactionDescription,
              amount: payload.amount,
              transactionDate: new Date().toISOString().slice(0, 10),
              transactionType: payload.transactionType,
            });
            await loadData();
            closeEditModal();
          } catch (err) {
            Alert.alert("Erro", err.message || "Erro ao atualizar transação.");
          } finally {
            setRefreshing(false);
          }
        }}
        onDelete={async (id) => {
          try {
            setRefreshing(true);
            setDeletingTransaction(true);
            await financeApi.deleteTransaction(token, id);
            await loadData();
            closeEditModal();
          } catch (err) {
            Alert.alert("Erro", err.message || "Erro ao deletar transação.");
          } finally {
            setDeletingTransaction(false);
            setRefreshing(false);
          }
        }}
        saving={refreshing}
        deleting={deletingTransaction}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: { fontSize: 27, fontWeight: "800", color: COLORS.navy },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 8,
    flexDirection: "column",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemTitle: { color: COLORS.navy, fontWeight: "700", fontSize: 14 },
  itemCategory: {
    marginTop: 2,
    color: COLORS.indigo,
    fontSize: 12,
    fontWeight: "500",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  incomeBadge: { backgroundColor: "#D1FAE5" },
  expenseBadge: { backgroundColor: "#FEE2E2" },
  typeBadgeText: { fontSize: 11, fontWeight: "700", color: COLORS.navy },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  itemMeta: { marginTop: 4, color: COLORS.indigo, fontSize: 11 },
  income: { color: COLORS.indigo, fontWeight: "700", fontSize: 14 },
  expense: { color: COLORS.pink, fontWeight: "700", fontSize: 14 },
});