import React, { useMemo, useState } from "react";
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
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const isPasswordStrongEnough = useMemo(() => {
    const score = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^a-zA-Z0-9]/.test(password),
    ].filter(Boolean).length;

    return password.length > 0 && score >= 5;
  }, [password]);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validação", "Preencha Nome, E-mail E Senha.");
      return;
    }

    if (!passwordsMatch) {
      Alert.alert("Validação", "As senhas precisam ser iguais.");
      return;
    }

    if (!isPasswordStrongEnough) {
      Alert.alert("Validação", "A senha precisa ser forte o suficiente.");
      return;
    }

    try {
      setSubmitting(true);
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace("/");
    } catch (error) {
      // Erro já foi exibido pelo apiClient
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedScreen scroll={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <PasswordStrengthIndicator password={password} />

        {confirmPassword.length > 0 && !passwordsMatch ? (
          <Text style={styles.errorText}>As senhas não coincidem.</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? "Criando..." : "Criar conta"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Já Tenho Conta</Text>
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
    marginBottom: 20,
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
  link: {
    textAlign: "center",
    marginTop: 14,
    color: COLORS.purple,
    fontWeight: "700",
  },
  errorText: {
    color: "#E11D48",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 10,
  },
});
