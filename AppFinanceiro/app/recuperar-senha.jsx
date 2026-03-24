import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function RecuperarSenhaScreen() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Validação", "Informe o email.");
      return;
    }

    try {
      setSubmitting(true);
      await forgotPassword(email.trim());
      Alert.alert("Sucesso", "Se o email existir, enviaremos as instruções de redefinição.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedScreen scroll={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar senha</Text>
        <Text style={styles.subtitle}>Informe seu email para receber o link de recuperação.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? "Enviando..." : "Enviar"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>Voltar ao login</Text>
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
  title: { fontSize: 28, fontWeight: "800", color: COLORS.navy, marginBottom: 8 },
  subtitle: { color: COLORS.indigo, marginBottom: 20 },
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
