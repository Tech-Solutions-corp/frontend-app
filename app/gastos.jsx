import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { formatDate } from "../utils/dateFormatter";

function toCurrency(value) {
  return `R$ ${Number(value || 0)
    .toFixed(2)
    .replace(".", ",")}`;
}

export default function GastosScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedType, setSelectedType] = useState("EXPENSE");
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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

      if (!selectedAccountId && (accountData || []).length > 0) {
        setSelectedAccountId(String(accountData[0].id));
      }
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao carregar gastos.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, token, userId]);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === selectedType),
    [categories, selectedType],
  );

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setSelectedCategoryId(String(filteredCategories[0].id));
    } else {
      setSelectedCategoryId(null);
    }
  }, [selectedType, categories.length]);

  const createTransaction = async () => {
    if (!hasAccounts || !selectedAccountId) {
      Alert.alert(
        "Conta obrigatória",
        "Toda transação precisa estar associada a uma conta. Crie uma conta antes de salvar.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Criar Conta",
            onPress: () => router.push("/contas"),
          },
        ],
      );
      return;
    }

    if (!description || !amount) {
      Alert.alert("Validação", "Descrição e valor são obrigatórios.");
      return;
    }

    try {
      setRefreshing(true);
      await financeApi.createTransaction(token, {
        userId: Number(userId),
        accountId: Number(selectedAccountId),
        categoryId: selectedCategoryId ? Number(selectedCategoryId) : null,
        transactionDescription: description,
        amount: Number(amount.replace(",", ".")),
        transactionDate: new Date().toISOString().slice(0, 10),
        transactionType: selectedType,
      });

      setDescription("");
      setAmount("");
      await loadData();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao criar transação.");
    } finally {
      setRefreshing(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Transações</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nova Transação</Text>
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
          onChangeText={setAmount}
        />

        <View style={styles.inlineRow}>
          <TouchableOpacity
            style={[styles.tag, selectedType === "EXPENSE" && styles.tagActive]}
            onPress={() => setSelectedType("EXPENSE")}
          >
            <Text style={styles.tagText}>Despesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tag, selectedType === "INCOME" && styles.tagActive]}
            onPress={() => setSelectedType("INCOME")}
          >
            <Text style={styles.tagText}>Receita</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Conta</Text>
        <View style={styles.inlineRowWrap}>
          {accounts.map((account) => (
            <TouchableOpacity
              key={String(account.id)}
              style={[
                styles.tag,
                selectedAccountId === String(account.id) && styles.tagActive,
              ]}
              onPress={() => setSelectedAccountId(String(account.id))}
            >
              <Text style={styles.tagText}>{account.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!hasAccounts && (
          <View style={styles.accountRequiredBox}>
            <Text style={styles.accountRequiredText}>
              Nenhuma conta encontrada. Para registrar qualquer transação, crie
              uma conta primeiro.
            </Text>
            <TouchableOpacity
              style={styles.accountRequiredButton}
              onPress={() => router.push("/contas")}
            >
              <Text style={styles.accountRequiredButtonText}>Ir Para Contas</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.inlineRowWrap}>
          {filteredCategories.map((category) => (
            <TouchableOpacity
              key={String(category.id)}
              style={[
                styles.tag,
                selectedCategoryId === String(category.id) && styles.tagActive,
              ]}
              onPress={() => setSelectedCategoryId(String(category.id))}
            >
              <Text style={styles.tagText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={createTransaction}
          disabled={refreshing}
        >
          <Text style={styles.primaryButtonText}>
            {refreshing ? "Salvando..." : "Salvar Transação"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/importacoes")}
      >
        <Text style={styles.secondaryButtonText}>Importar Transações</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Histórico</Text>
      {transactions.map((tx) => {
        const account = accounts.find(
          (a) => String(a.id) === String(tx.accountId),
        );
        const category = categories.find(
          (c) => String(c.id) === String(tx.categoryId),
        );
        const isIncome = tx.transactionType === "INCOME";
        return (
          <View key={String(tx.id)} style={styles.item}>
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
        );
      })}
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: { fontSize: 27, fontWeight: "800", color: COLORS.navy },
  card: {
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
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
  label: {
    marginTop: 4,
    marginBottom: 5,
    color: COLORS.indigo,
    fontWeight: "600",
  },
  inlineRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  inlineRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  accountRequiredBox: {
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFF4E5",
    marginBottom: 8,
  },
  accountRequiredText: {
    color: COLORS.navy,
    fontSize: 13,
    lineHeight: 18,
  },
  accountRequiredButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.indigo,
  },
  accountRequiredButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 12,
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
  secondaryButton: {
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderColor: COLORS.purple,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: COLORS.navy, fontWeight: "600" },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
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
