import React, { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  Modal,
  TextInput,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";

import CarrosselDeDatas from "../components/CarrosselDeDatas";
import FiltroDeCategorias from "../components/FiltroDeCategorias";
import CartaoDeGasto from "../components/CartaoDeGasto";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";
import { formatTime } from "../utils/dateFormatter";
import ThemedScreen from "../components/ThemedScreen";
import NotificationBell from "../components/NotificationBell";
import { COLORS } from "../constants/theme";
import { formatMoneyBRL, parseMoneyInput, sanitizeMoneyInput } from "../utils/money";
import { TouchableOpacity } from "react-native";
import EditTransactionModal from "../components/EditTransactionModal";

function formatMoney(value) {
  return formatMoneyBRL(value);
}

function toDateItem(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const capitalizeFirst = (value = "") => {
    const text = String(value);
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return {
    dia: date.getDate(),
    diaSemana: capitalizeFirst(
      date.toLocaleDateString("pt-BR", { weekday: "long" }),
    ),
    mes: capitalizeFirst(date.toLocaleDateString("pt-BR", { month: "long" })),
    raw: dateValue,
  };
}

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [indiceDateSelecionado, setIndiceDateSelecionado] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [editModal, setEditModal] = useState({
    visible: false,
    transaction: null,
    description: "",
    amount: "",
    type: "EXPENSE",
    accountId: null,
    categoryId: null,
  });

  const loadData = async () => {
    if (!token || !userId) {
      return;
    }

    try {
      const [transactionData, categoryData, accountData] = await Promise.all([
        financeApi.listTransactionsByUser(token, userId),
        financeApi.listCategoriesByUser(token, userId),
        financeApi.listAccountsByUser(token, userId),
      ]);

      setTransactions(transactionData || []);
      setCategories(categoryData || []);
      setAccounts(accountData || []);
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao carregar agenda.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, token, userId]);

  const dateItems = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(transactions.map((transaction) => transaction.transactionDate)),
    ).sort((left, right) => String(right).localeCompare(String(left)));

    return uniqueDates.map(toDateItem).filter(Boolean).slice(0, 8);
  }, [transactions]);

  useEffect(() => {
    if (dateItems.length > 0 && indiceDateSelecionado >= dateItems.length) {
      setIndiceDateSelecionado(0);
    }
  }, [dateItems.length, indiceDateSelecionado]);

  const selectedDate = dateItems[indiceDateSelecionado]?.raw;

  const categoryNames = useMemo(
    () => ["Todas", ...categories.map((category) => category.name)],
    [categories],
  );

  const gastosFiltrados = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          !selectedDate || transaction.transactionDate === selectedDate,
      )
      .filter((transaction) => {
        if (categoriaSelecionada === "Todas") {
          return true;
        }

        const category = categories.find(
          (item) => String(item.id) === String(transaction.categoryId),
        );
        return category?.name === categoriaSelecionada;
      })
      .sort((left, right) =>
        String(right.createdAt || right.transactionDate).localeCompare(
          String(left.createdAt || left.transactionDate),
        ),
      );
  }, [transactions, selectedDate, categoriaSelecionada, categories]);

  const [refreshing, setRefreshing] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(false);

  const openEditModal = (transaction) => {
    setEditModal({
      visible: true,
      transaction,
      description: transaction.transactionDescription,
      amount: formatMoneyBRL(transaction.amount).replace("R$ ", ""),
      type: transaction.transactionType,
      accountId: String(transaction.accountId),
      categoryId: transaction.categoryId ? String(transaction.categoryId) : null,
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

  const saveTransaction = async () => {
    if (!editModal.description || !editModal.amount) {
      Alert.alert("Validação", "Descrição e valor são obrigatórios.");
      return;
    }

    const parsedAmount = parseMoneyInput(editModal.amount);
    if (!Number.isFinite(parsedAmount)) {
      Alert.alert("Validação", "Informe um valor válido.");
      return;
    }

    try {
      setRefreshing(true);

      await financeApi.updateTransaction(token, editModal.transaction.id, {
        userId: Number(userId),
        accountId: Number(editModal.accountId),
        categoryId: editModal.categoryId ? Number(editModal.categoryId) : null,
        transactionDescription: editModal.description,
        amount: parsedAmount,
        transactionDate: new Date().toISOString().slice(0, 10),
        transactionType: editModal.type,
      });

      await loadData();
      closeEditModal();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao atualizar transação.");
    } finally {
      setRefreshing(false);
    }
  };

  const performDeleteTransaction = async () => {
    if (!editModal.transaction?.id) {
      Alert.alert("Erro", "Transação inválida para exclusão.");
      return;
    }

    try {
      setRefreshing(true);
      setDeletingTransaction(true);
      await financeApi.deleteTransaction(token, editModal.transaction.id);
      await loadData();
      closeEditModal();
    } catch (error) {
      Alert.alert("Erro", error.message || "Erro ao deletar transação.");
    } finally {
      setDeletingTransaction(false);
      setRefreshing(false);
    }
  };

  const deleteTransaction = () => {
    Alert.alert("Confirmar", "Tem certeza que deseja deletar esta transação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => {
          void performDeleteTransaction();
        },
      },
    ]);
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.page} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Agenda</Text>
          <NotificationBell />
        </View>

        <CarrosselDeDatas
          datas={dateItems}
          indiceSelecionado={indiceDateSelecionado}
          aoSelecionarData={setIndiceDateSelecionado}
        />

        <View style={styles.filtroWrapper}>
          <FiltroDeCategorias
            categorias={categoryNames}
            categoriaSelecionada={categoriaSelecionada}
            aoSelecionar={setCategoriaSelecionada}
          />
        </View>

        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaConteudo}
          bounces={false}
          overScrollMode="never"
        >
          {gastosFiltrados.length > 0 ? (
            gastosFiltrados.map((gasto) => {
              const category = categories.find(
                (item) => String(item.id) === String(gasto.categoryId),
              );
              const categoryName = category?.name || "Sem Categoria";
              const isIncome = gasto.transactionType === "INCOME";

              return (
                  <TouchableOpacity onPress={() => openEditModal(gasto)} activeOpacity={0.8}>
                  <CartaoDeGasto
                  key={String(gasto.id)}
                  loja={categoryName}
                  descricao={gasto.transactionDescription || "Sem Descrição"}
                  horario={formatTime(gasto.createdAt)}
                  valor={`${isIncome ? "+" : "-"} ${formatMoney(gasto.amount)}`}
                  icone={isIncome ? "↑" : "↓"}
                  corIcone={isIncome ? "#D1FAE5" : "#FEE2E2"}
                    />
                  </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.emptyState}>
              Nenhuma Transação Encontrada Para Este Filtro.
            </Text>
          )}
        </ScrollView>

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
                categoryId: payload.categoryId ? Number(payload.categoryId) : null,
                transactionDescription: payload.transactionDescription,
                amount: payload.amount,
                transactionDate: new Date().toISOString().slice(0, 10),
                transactionType: payload.transactionType,
              });
              await loadData();
              closeEditModal();
            } catch (err) {
              Alert.alert('Erro', err.message || 'Erro ao atualizar transação.');
            } finally {
              setRefreshing(false);
            }
          }}
          onDelete={async (id) => {
            try {
              setRefreshing(true);
              await financeApi.deleteTransaction(token, id);
              await loadData();
              closeEditModal();
            } catch (err) {
              Alert.alert('Erro', err.message || 'Erro ao deletar transação.');
            } finally {
              setRefreshing(false);
            }
          }}
          saving={refreshing}
          deleting={deletingTransaction}
        />
        <View style={{ paddingBottom: insets.bottom }} />
      </View>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F2FF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerIcone: {
    fontSize: 18,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  filtroWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingBottom: 18,
  },
  emptyState: {
    paddingHorizontal: 20,
    color: "#6C47FF",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    maxHeight: "90%",
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
  cancelButton: {
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelButtonText: { color: COLORS.indigo, fontWeight: "600" },
});
