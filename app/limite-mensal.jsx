import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

function money(value) {
  return `R$ ${Number(value || 0)
    .toFixed(2)
    .replace(".", ",")}`;
}

export default function LimiteMensalScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();
  const [referenceMonth, setReferenceMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [amount, setAmount] = useState("");
  const [amountDisplay, setAmountDisplay] = useState("");
  const [currentLimit, setCurrentLimit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(`${referenceMonth}-01`),
  );

  useEffect(() => {
    const loadLimit = async () => {
      if (!token || !userId) return;
      try {
        const data = await financeApi.listMonthlyLimitsByUser(token, userId);
        const found = (data || []).find((item) =>
          String(item.referenceMonth || "").startsWith(referenceMonth),
        );
        setCurrentLimit(found || null);
      } catch (error) {
        setCurrentLimit(null);
      }
    };

    if (isAuthenticated) {
      loadLimit();
    }
  }, [isAuthenticated, token, userId, referenceMonth]);

  useEffect(() => {
    setSelectedDate(new Date(`${referenceMonth}-01`));
  }, [referenceMonth]);

  function formatMonthYear(isoMonth) {
    try {
      const d = new Date(`${isoMonth}-01`);
      const formatted = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
      }).format(d);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return isoMonth;
    }
  }

  function formatCurrencyDisplay(raw) {
    if (!raw) return "";
    const num = Number(
      String(raw)
        .replace(/[^0-9\-.,]/g, "")
        .replace(",", "."),
    );
    if (Number.isNaN(num)) return raw;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const onChangeAmount = (text) => {
    const cleaned = text.replace(/[^0-9,\.]/g, "");
    setAmount(cleaned);
    setAmountDisplay(formatCurrencyDisplay(cleaned));
  };

  const onChangeDate = (event, date) => {
    setShowDatePicker(false);
    if (!date) return;
    setSelectedDate(date);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    setReferenceMonth(`${yyyy}-${mm}`);
  };

  const saveLimit = async () => {
    if (!amount) {
      Alert.alert("Validação", "Informe O Valor Do Limite.");
      return;
    }

    try {
      setSubmitting(true);
      await financeApi.createMonthlyLimit(token, {
        userId: Number(userId),
        referenceMonth: `${referenceMonth}-01`,
        amount: Number(amount.replace(",", ".")),
      });
      setCurrentLimit({
        referenceMonth: `${referenceMonth}-01`,
        amount: Number(amount.replace(",", ".")),
      });
      Alert.alert("Sucesso", "Limite Mensal Salvo Com Sucesso.");
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
      <Text style={styles.title}>Limite Mensal</Text>
      <Text style={styles.subtitle}>
        Cadastre O Valor Que Quer Usar Como Referência Para O Mês.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registrar Limite</Text>
        <TouchableOpacity
          style={[styles.input, styles.pickerTouchable]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: referenceMonth ? "#111" : "#888" }}>
            {formatMonthYear(referenceMonth)}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={onChangeDate}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Valor Do Limite"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={onChangeAmount}
        />
        {amountDisplay && (
          <Text style={styles.displayValue}>{amountDisplay}</Text>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={saveLimit}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Salvando..." : "Salvar Limite"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Limite Atual</Text>
        <Text style={styles.value}>
          {currentLimit
            ? money(currentLimit.amount)
            : "Nenhum Limite Cadastrado"}
        </Text>
      </View>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.navy,
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.indigo,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 12,
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
  primaryButton: {
    marginTop: 6,
    backgroundColor: COLORS.indigo,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "700" },
  displayValue: {
    color: COLORS.indigo,
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
    fontWeight: "500",
  },
  value: { color: COLORS.navy, fontSize: 15 },
});
