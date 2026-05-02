import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function AlterarEmailScreen() {
  const { loading: authLoading, isAuthenticated, userEmail } = useRequireAuth();
  const { changeEmail, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newEmail) {
      Alert.alert("Validacao", "Preencha todos os campos.");
      return;
    }

    if (newEmail === userEmail) {
      Alert.alert("Validacao", "Novo email deve ser diferente do email atual.");
      return;
    }

    try {
      setSubmitting(true);
      await changeEmail({ currentPassword, newEmail });
      Alert.alert(
        "Sucesso",
        "Email alterado com sucesso. Você será redirecionado para fazer login novamente.",
      );
      await logout();
      router.replace("/login");
    } catch (error) {
      // Erro ja foi exibido pelo apiClient
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen scroll={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Alterar Email</Text>
        <Text style={styles.subtitle}>
          Informe sua senha e defina o novo email.
        </Text>

        <Text style={styles.label}>Email Atual</Text>
        <Text style={styles.email}>{userEmail}</Text>

        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Novo Email"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={newEmail}
          onChangeText={setNewEmail}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Salvando..." : "Salvar Novo Email"}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.purple,
    ...SHADOW,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.navy,
    marginBottom: 8,
  },
  subtitle: { color: COLORS.indigo, marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.indigo,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.navy,
    marginBottom: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.purple,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: COLORS.indigo,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: { color: COLORS.white, fontWeight: "700", fontSize: 15 },
});
