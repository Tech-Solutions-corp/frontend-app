import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function PerfilScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { userEmail, userId, logout } = useAuth();

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <ThemedScreen contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userEmail || "Nao informado"}</Text>

          <Text style={[styles.label, { marginTop: 10 }]}>ID do usuario</Text>
          <Text style={styles.value}>{userId || "-"}</Text>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/recuperar-senha")}
        >
          <Text style={styles.secondaryButtonText}>Recuperar senha por email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/importacoes")}
        >
          <Text style={styles.secondaryButtonText}>Historico de importacoes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/insights")}
        >
          <Text style={styles.secondaryButtonText}>Tela de insights IA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutButtonText}>Sair da conta</Text>
        </TouchableOpacity>
      <BarraDeNavegacao abaAtiva="perfil" />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 110 },
  title: { fontSize: 27, fontWeight: "800", color: COLORS.navy, marginBottom: 10 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 14,
    marginBottom: 12,
    ...SHADOW,
  },
  label: { color: COLORS.indigo, fontSize: 12, fontWeight: "700" },
  value: { color: COLORS.navy, fontSize: 15, marginTop: 4 },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.purple,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  secondaryButtonText: { color: COLORS.navy, fontWeight: "600" },
  logoutButton: {
    marginTop: 12,
    backgroundColor: COLORS.pink,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutButtonText: { color: COLORS.navy, fontWeight: "700" },
});
