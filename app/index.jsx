import { useEffect, useMemo, useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import HeaderUsuario from "../components/HeaderUsuario";
import CardLimite from "../components/CardLimite";
import CardCategoria from "../components/CardCategoria";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { COLORS } from "../constants/theme";

const CATEGORY_STYLE_MAP = {
  ALIMENTACAO: { icone: "🍽️", cor: "#FF6B8A" },
  LAZER: { icone: "🎮", cor: "#A78BFA" },
  EDUCACAO: { icone: "📚", cor: "#F97316" },
  TRANSPORTE: { icone: "🚗", cor: "#FBBF24" },
  SAUDE: { icone: "🏥", cor: "#FF6B9D" },
  UTILITIES: { icone: "⚡", cor: "#34D399" },
};

function formatMoney(value) {
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

function normalizeKey(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();
}

export default function HomeScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId, userName, userEmail } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      if (!token || !userId) {
        return;
      }

      try {
        const [accountData, categoryData, transactionData] = await Promise.all([
          financeApi.listAccountsByUser(token, userId),
          financeApi.listCategoriesByUser(token, userId),
          financeApi.listTransactionsByUser(token, userId),
        ]);

        setAccounts(accountData || []);
        setCategories(categoryData || []);
        setTransactions(transactionData || []);
      } catch (error) {
        Alert.alert("Erro", error.message);
      }
    };

    if (isAuthenticated) {
      loadHomeData();
    }
  }, [isAuthenticated, token, userId]);

  const expenseTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.transactionType === "EXPENSE"),
    [transactions]
  );

  const incomeTotal = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.transactionType === "INCOME")
        .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
    [transactions]
  );

  const expenseTotal = useMemo(
    () => expenseTransactions.reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0),
    [expenseTransactions]
  );

  const spendingPercent = useMemo(() => {
    const base = incomeTotal + expenseTotal;
    if (base <= 0) {
      return 0;
    }

    return Math.min(100, Math.round((expenseTotal / base) * 100));
  }, [expenseTotal, incomeTotal]);

  const categoryCards = useMemo(() => {
    const categoryMap = new Map(categories.map((category) => [String(category.id), category]));
    const totalsByCategory = new Map();

    expenseTransactions.forEach((transaction) => {
      const category = categoryMap.get(String(transaction.categoryId));
      const categoryName = category?.name || "Sem categoria";
      const key = normalizeKey(categoryName);
      const current = totalsByCategory.get(key) || { nome: categoryName, qtd: 0, total: 0, style: CATEGORY_STYLE_MAP[key] || { icone: "•", cor: "#8B8B8B" } };

      current.qtd += 1;
      current.total += Number(transaction.amount || 0);
      totalsByCategory.set(key, current);
    });

    const totalSpent = Array.from(totalsByCategory.values()).reduce((sum, item) => sum + item.total, 0) || 1;

    return Array.from(totalsByCategory.values())
      .sort((a, b) => b.total - a.total)
      .map((item, index) => ({
        id: `${item.nome}-${index}`,
        nome: item.nome,
        qtd: item.qtd,
        percent: Math.max(1, Math.round((item.total / totalSpent) * 100)),
        icone: item.style.icone,
        cor: item.style.cor,
      }));
  }, [categories, expenseTransactions]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen>
      <HeaderUsuario nome={userName || userEmail || "Usuário"} />

      <CardLimite percent={spendingPercent} aoVerGastos={() => router.push("/gastos")} />

      <View style={styles.secaoHeader}>
        <Text style={styles.secaoTitulo}>Gastos por categoria</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>{categoryCards.length}</Text>
        </View>
      </View>

      {categoryCards.length > 0 ? (
        categoryCards.map((category) => <CardCategoria key={category.id} {...category} />)
      ) : (
        <Text style={styles.emptyState}>Ainda não há gastos registrados para resumir.</Text>
      )}

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Contas ativas</Text>
        <Text style={styles.summaryValue}>{accounts.length}</Text>
        <Text style={styles.summaryMeta}>Receitas: {formatMoney(incomeTotal)} · Despesas: {formatMoney(expenseTotal)}</Text>
      </View>

      <View style={{ height: 32 }} />
      <BarraDeNavegacao abaAtiva="home" />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  secaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  badge: {
    backgroundColor: "#E0D9FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeTexto: {
    color: "#6C47FF",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    paddingHorizontal: 20,
    color: COLORS.indigo,
    marginBottom: 12,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  summaryLabel: {
    color: COLORS.indigo,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  summaryValue: {
    marginTop: 4,
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: "800",
  },
  summaryMeta: {
    marginTop: 6,
    color: COLORS.indigo,
  },
});
