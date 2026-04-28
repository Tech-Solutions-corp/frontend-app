import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, StyleSheet, Alert } from "react-native";

import BarraDeNavegacao from "../components/BarraDeNavegacao";
import CarrosselDeDatas from "../components/CarrosselDeDatas";
import FiltroDeCategorias from "../components/FiltroDeCategorias";
import CartaoDeGasto from "../components/CartaoDeGasto";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";

function formatMoney(value) {
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

function toDateItem(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    dia: date.getDate(),
    diaSemana: date.toLocaleDateString("pt-BR", { weekday: "long" }),
    mes: date.toLocaleDateString("pt-BR", { month: "long" }),
    raw: dateValue,
  };
}

function formatTime(dateTimeValue) {
  if (!dateTimeValue) {
    return "--:--";
  }

  const timePart = String(dateTimeValue).split("T")[1] || "";
  return timePart.slice(0, 5) || "--:--";
}

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [indiceDateSelecionado, setIndiceDateSelecionado] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !userId) {
        return;
      }

      try {
        const [transactionData, categoryData] = await Promise.all([
          financeApi.listTransactionsByUser(token, userId),
          financeApi.listCategoriesByUser(token, userId),
        ]);

        setTransactions(transactionData || []);
        setCategories(categoryData || []);
      } catch (error) {
        Alert.alert("Erro", error.message);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, token, userId]);

  const dateItems = useMemo(() => {
    const uniqueDates = Array.from(new Set(transactions.map((transaction) => transaction.transactionDate))).sort((left, right) =>
      String(right).localeCompare(String(left))
    );

    return uniqueDates
      .map(toDateItem)
      .filter(Boolean)
      .slice(0, 8);
  }, [transactions]);

  useEffect(() => {
    if (dateItems.length > 0 && indiceDateSelecionado >= dateItems.length) {
      setIndiceDateSelecionado(0);
    }
  }, [dateItems.length, indiceDateSelecionado]);

  const selectedDate = dateItems[indiceDateSelecionado]?.raw;

  const categoryNames = useMemo(
    () => ["Todas", ...categories.map((category) => category.name)],
    [categories]
  );

  const gastosFiltrados = useMemo(() => {
    return transactions
      .filter((transaction) => !selectedDate || transaction.transactionDate === selectedDate)
      .filter((transaction) => {
        if (categoriaSelecionada === "Todas") {
          return true;
        }

        const category = categories.find((item) => String(item.id) === String(transaction.categoryId));
        return category?.name === categoriaSelecionada;
      })
      .sort((left, right) => String(right.createdAt || right.transactionDate).localeCompare(String(left.createdAt || left.transactionDate)));
  }, [transactions, selectedDate, categoriaSelecionada, categories]);

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>AGENDA</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerIcone}>🔔</Text>
          </TouchableOpacity>
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
        >
          {gastosFiltrados.length > 0 ? (
            gastosFiltrados.map((gasto) => {
              const category = categories.find((item) => String(item.id) === String(gasto.categoryId));
              const categoryName = category?.name || "Sem categoria";
              const isIncome = gasto.transactionType === "INCOME";

              return (
                <CartaoDeGasto
                  key={String(gasto.id)}
                  loja={categoryName}
                  descricao={gasto.transactionDescription || "Sem descrição"}
                  horario={formatTime(gasto.createdAt)}
                  valor={`${isIncome ? "+" : "-"} ${formatMoney(gasto.amount)}`}
                  icone={isIncome ? "↑" : "↓"}
                  corIcone={isIncome ? "#D1FAE5" : "#FEE2E2"}
                />
              );
            })
          ) : (
            <Text style={styles.emptyState}>Nenhuma transação encontrada para este filtro.</Text>
          )}
        </ScrollView>

        <View style={{ paddingBottom: insets.bottom }}>
          <BarraDeNavegacao abaAtiva="agenda" />
        </View>
      </View>
    </SafeAreaView>
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
    paddingBottom: 100,
  },
  emptyState: {
    paddingHorizontal: 20,
    color: "#6C47FF",
  },
});
