import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

function toCurrency(value) {
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
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
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, token, userId]);

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === selectedType),
    [categories, selectedType]
  );

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setSelectedCategoryId(String(filteredCategories[0].id));
    } else {
      setSelectedCategoryId(null);
    }
  }, [selectedType, categories.length]);

  const createTransaction = async () => {
    if (!description || !amount || !selectedAccountId) {
      Alert.alert("Validação", "Descricao, valor e conta sao obrigatorios.");
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
      Alert.alert("Erro ao criar transacao", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
        <Text style={styles.title}>Transacoes</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nova transacao</Text>
          <TextInput
            style={styles.input}
            placeholder="Descricao"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
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
                style={[styles.tag, selectedAccountId === String(account.id) && styles.tagActive]}
                onPress={() => setSelectedAccountId(String(account.id))}
              >
                <Text style={styles.tagText}>{account.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.inlineRowWrap}>
            {filteredCategories.map((category) => (
              <TouchableOpacity
                key={String(category.id)}
                style={[styles.tag, selectedCategoryId === String(category.id) && styles.tagActive]}
                onPress={() => setSelectedCategoryId(String(category.id))}
              >
                <Text style={styles.tagText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={createTransaction} disabled={refreshing}>
            <Text style={styles.primaryButtonText}>{refreshing ? "Salvando..." : "Salvar transacao"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Historico</Text>
        {transactions.map((tx) => (
          <View key={String(tx.id)} style={styles.item}>
            <View>
              <Text style={styles.itemTitle}>{tx.transactionDescription || "Sem descricao"}</Text>
              <Text style={styles.itemDate}>{tx.transactionDate}</Text>
            </View>
            <Text style={tx.transactionType === "INCOME" ? styles.income : styles.expense}>
              {tx.transactionType === "INCOME" ? "+" : "-"} {toCurrency(tx.amount)}
            </Text>
          </View>
        ))}
      <BarraDeNavegacao abaAtiva="gastos" />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 110 },
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
  label: { marginTop: 4, marginBottom: 5, color: COLORS.indigo, fontWeight: "600" },
  inlineRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  inlineRowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
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
  sectionTitle: { marginTop: 16, marginBottom: 8, fontSize: 18, fontWeight: "700", color: COLORS.navy },
  item: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitle: { color: COLORS.navy, fontWeight: "600" },
  itemDate: { marginTop: 2, color: COLORS.indigo, fontSize: 12 },
  income: { color: COLORS.indigo, fontWeight: "700" },
  expense: { color: COLORS.pink, fontWeight: "700" },
});
