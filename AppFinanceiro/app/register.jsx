import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      Alert.alert("Validação", "Preencha nome, email e senha.");
      return;
    }

    try {
      setSubmitting(true);
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace("/");
    } catch (error) {
      Alert.alert("Falha no cadastro", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedScreen scroll={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar conta</Text>

        <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha forte"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? "Criando..." : "Criar conta"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Já tenho conta</Text>
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
  title: { fontSize: 28, fontWeight: "800", color: COLORS.navy, marginBottom: 20 },
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
  link: { textAlign: "center", marginTop: 14, color: COLORS.purple, fontWeight: "700" },
});
