import { useEffect, useMemo, useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useI18n } from "../context/I18nContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import HeaderUsuario from "../components/HeaderUsuario";
import CardLimite from "../components/CardLimite";
import WelcomeModal from "../components/WelcomeModal";
import { COLORS } from "../constants/theme";
import { formatMoneyBRL, moneyValue } from "../utils/money";

const CATEGORY_COLORS = [
  "#FF6B8A",
  "#A78BFA",
  "#F97316",
  "#FBBF24",
  "#FF6B9D",
  "#34D399",
];

function formatMoney(value) {
  return formatMoneyBRL(value);
}

function formatMonthYearFromIso(iso) {
  if (!iso) return "";
  try {
    const d = new Date(String(iso).length === 7 ? `${iso}-01` : iso);
    const formatted = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(d);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  } catch {
    return iso;
  }
}

export default function HomeScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId, userName, userEmail, isFirstLogin, clearFirstLogin } =
    useAuth();
  const { t } = useI18n();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [monthlyLimits, setMonthlyLimits] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      if (!token || !userId) return;

      try {
        const [accountData, transactionData, limitData] = await Promise.all([
          financeApi.listAccountsByUser(token, userId),
          financeApi.listTransactionsByUser(token, userId),
          financeApi.listMonthlyLimitsByUser(token, userId),
        ]);

        setAccounts(accountData || []);
        setTransactions(transactionData || []);
        setMonthlyLimits(limitData || []);
      } catch (error) {
        Alert.alert("Erro", error.message);
      }
    };

    if (isAuthenticated) {
      loadHomeData();
    }
  }, [isAuthenticated, token, userId]);

  const currentMonthKey = new Date().toISOString().slice(0, 7);

  // Usado apenas para o CardLimite (despesas do mês atual)
  const expenseTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) =>
          transaction.transactionType === "EXPENSE" &&
          String(transaction.transactionDate || "").startsWith(currentMonthKey),
      ),
    [transactions, currentMonthKey],
  );

  const expenseTotal = useMemo(
    () =>
      expenseTransactions.reduce(
        (sum, transaction) => sum + moneyValue(transaction.amount),
        0,
      ),
    [expenseTransactions],
  );

  // Totais gerais para o card de contas ativas
  const incomeTotalGeral = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.transactionType === "INCOME")
        .reduce((sum, transaction) => sum + moneyValue(transaction.amount), 0),
    [transactions],
  );

  const expenseTotalGeral = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.transactionType === "EXPENSE")
        .reduce((sum, transaction) => sum + moneyValue(transaction.amount), 0),
    [transactions],
  );

  const spendingPercent = useMemo(() => {
    const base = incomeTotalGeral + expenseTotalGeral;
    if (base <= 0) return 0;
    return Math.min(100, Math.round((expenseTotalGeral / base) * 100));
  }, [expenseTotalGeral, incomeTotalGeral]);

  const currentMonthlyLimit = useMemo(
    () =>
      monthlyLimits.find((limit) =>
        String(limit.referenceMonth || "").startsWith(currentMonthKey),
      ) || null,
    [monthlyLimits, currentMonthKey],
  );

  const monthlyLimitPercent = useMemo(() => {
    const limitAmount = moneyValue(currentMonthlyLimit?.amount);
    if (limitAmount <= 0) return spendingPercent;
    return Math.min(100, Math.round((expenseTotal / limitAmount) * 100));
  }, [currentMonthlyLimit, expenseTotal, spendingPercent]);

  const accountsSummary = useMemo(() => {
    return accounts.map((account) => {
      const accountTransactions = transactions.filter(
        (tx) => String(tx.accountId) === String(account.id),
      );
      const accountIncome = accountTransactions
        .filter((tx) => tx.transactionType === "INCOME")
        .reduce((sum, tx) => sum + moneyValue(tx.amount), 0);
      const accountExpense = accountTransactions
        .filter((tx) => tx.transactionType === "EXPENSE")
        .reduce((sum, tx) => sum + moneyValue(tx.amount), 0);

      return {
        ...account,
        income: accountIncome,
        expense: accountExpense,
        balance: moneyValue(account.balance),
      };
    });
  }, [accounts, transactions]);

  const totalBalance = useMemo(
    () =>
      accounts.reduce((sum, account) => sum + moneyValue(account.balance), 0),
    [accounts],
  );
  const balanceColor = totalBalance >= 0 ? "#34D399" : "#FF6B9D";

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen>
      <WelcomeModal visible={isFirstLogin} onClose={clearFirstLogin} />

      <HeaderUsuario nome={userName || userEmail || "Usuário"} />

      <CardLimite
        title={t("monthly_limit")}
        subtitle={
          currentMonthlyLimit
            ? formatMonthYearFromIso(currentMonthlyLimit.referenceMonth)
            : `${formatMonthYearFromIso(currentMonthKey)} — ${t("no_limit_registered")}`
        }
        metric={
          currentMonthlyLimit
            ? `${formatMoney(expenseTotal)} De ${formatMoney(currentMonthlyLimit.amount)}`
            : `${formatMoney(expenseTotal)} ${t("spent_in_month")}`
        }
        percent={monthlyLimitPercent}
        aoVerGastos={() => router.push("/gastos")}
        aoRegistrarLimite={() => router.push("/limite-mensal")}
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>{t("active_accounts")}</Text>
        <Text style={styles.summaryValue}>{accounts.length}</Text>
        <Text style={styles.summaryMeta}>
          {t("income")}: {formatMoney(incomeTotalGeral)} · {t("expenses")}:{" "}
          {formatMoney(expenseTotalGeral)}
        </Text>
        <View style={styles.balanceDivider} />
        <Text style={styles.summaryLabel}>{t("total_balance")}</Text>
        <Text style={[styles.balanceValue, { color: balanceColor }]}>
          {formatMoney(totalBalance)}
        </Text>
      </View>

      {accountsSummary.length > 0 && (
        <>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>{t("account_summary")}</Text>
          </View>
          {accountsSummary.map((account) => (
            <View key={String(account.id)} style={styles.accountSummaryCard}>
              <View style={styles.accountHeader}>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text
                  style={[
                    styles.accountBalance,
                    { color: account.balance >= 0 ? "#34D399" : "#FF6B9D" },
                  ]}
                >
                  {formatMoney(account.balance)}
                </Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountMeta}>
                  {t("revenue")}: {formatMoney(account.income)}
                </Text>
                <Text style={styles.accountMeta}>
                  {t("expense")}: {formatMoney(account.expense)}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      <View style={{ height: 32 }} />
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
  balanceDivider: {
    height: 1,
    backgroundColor: COLORS.purple,
    marginVertical: 12,
  },
  balanceValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "800",
  },
  accountSummaryCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E8E1FF",
  },
  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  accountName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.navy,
    flex: 1,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: "700",
  },
  accountDetails: {
    flexDirection: "row",
    gap: 16,
  },
  accountMeta: {
    fontSize: 12,
    color: COLORS.indigo,
  },
});
