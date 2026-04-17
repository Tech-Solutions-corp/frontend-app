import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

const ACCOUNT_TYPES = ["WALLET", "BANK", "SAVINGS", "CREDIT_CARD", "INVESTMENT"];

function money(value) {
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

export default function ContasScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userId } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("WALLET");
  const [balance, setBalance] = useState("0");
  const [submitting, setSubmitting] = useState(false);

  const loadAccounts = async () => {
    try {
      const data = await financeApi.listAccountsByUser(token, userId);
      setAccounts(data || []);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAccounts();
    }
  }, [isAuthenticated, token, userId]);

  const total = useMemo(
    () => accounts.reduce((acc, account) => acc + Number(account.balance || 0), 0),
    [accounts]
  );

  const createAccount = async () => {
    if (!name) {
      Alert.alert("Validação", "Informe o nome da conta.");
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
      setBalance("0");
      await loadAccounts();
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
        <Text style={styles.title}>Contas</Text>
        <Text style={styles.total}>Saldo total: {money(total)}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nova conta</Text>
          <TextInput style={styles.input} placeholder="Nome da conta" value={name} onChangeText={setName} />
          <TextInput
            style={styles.input}
            placeholder="Saldo inicial"
            keyboardType="decimal-pad"
            value={balance}
            onChangeText={setBalance}
          />

          <View style={styles.types}>
            {ACCOUNT_TYPES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.tag, type === item && styles.tagActive]}
                onPress={() => setType(item)}
              >
                <Text style={styles.tagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={createAccount} disabled={submitting}>
            <Text style={styles.primaryButtonText}>{submitting ? "Criando..." : "Criar conta"}</Text>
          </TouchableOpacity>
        </View>

        {accounts.map((account) => (
          <View key={String(account.id)} style={styles.accountItem}>
            <View>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountMeta}>{account.type}</Text>
            </View>
            <Text style={styles.accountBalance}>{money(account.balance)}</Text>
          </View>
        ))}
      <BarraDeNavegacao abaAtiva="agenda" />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 110 },
  title: { fontSize: 27, fontWeight: "800", color: COLORS.navy },
  total: { marginTop: 6, color: COLORS.indigo, marginBottom: 12, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 12,
    marginBottom: 14,
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
  types: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  tag: { backgroundColor: "#F3E8FF", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 8 },
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
  accountName: { color: COLORS.navy, fontWeight: "600" },
  accountMeta: { marginTop: 2, color: COLORS.indigo, fontSize: 12 },
  accountBalance: { color: COLORS.navy, fontWeight: "700" },
});
