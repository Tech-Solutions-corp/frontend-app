import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function RedefinirSenhaScreen() {
  const params = useLocalSearchParams();
  const tokenFromUrl = useMemo(() => {
    if (Array.isArray(params.token)) {
      return params.token[0] || "";
    }
    return params.token || "";
  }, [params.token]);

  const { resetPassword } = useAuth();
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token || !newPassword) {
      Alert.alert("Validação", "Informe token e nova senha.");
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword({ token, newPassword });
      Alert.alert("Sucesso", "Senha redefinida com sucesso.");
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
        <Text style={styles.title}>Redefinir senha</Text>

        <TextInput style={styles.input} placeholder="Token" value={token} onChangeText={setToken} />
        <TextInput
          style={styles.input}
          placeholder="Nova senha forte"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.primaryButtonText}>{submitting ? "Enviando..." : "Redefinir"}</Text>
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
});
