import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { formatDateTime } from "../utils/dateFormatter";

export default function PerfilScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userEmail, userId, userName, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated || !token) {
        return;
      }

      try {
        const currentUser = await financeApi.getCurrentUser(token);
        setProfile(currentUser);
      } catch {
        setProfile(null);
      }
    };

    loadProfile();
  }, [isAuthenticated, token]);

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
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>
          {profile?.name || userName || "Não Informado"}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>E-mail</Text>
        <Text style={styles.value}>
          {profile?.email || userEmail || "Não Informado"}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>ID Do Usuário</Text>
        <Text style={styles.value}>{profile?.id || userId || "-"}</Text>

        <Text style={[styles.label, { marginTop: 10 }]}>Criado Em</Text>
        <Text style={styles.value}>
          {profile?.createdAt ? formatDateTime(profile.createdAt) : "-"}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>Atualizado Em</Text>
        <Text style={styles.value}>
          {profile?.updatedAt ? formatDateTime(profile.updatedAt) : "-"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/alterar-email")}
      >
        <Text style={styles.secondaryButtonText}>Alterar Email</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/alterar-senha")}
      >
        <Text style={styles.secondaryButtonText}>Alterar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/importacoes")}
      >
        <Text style={styles.secondaryButtonText}>Histórico De Importações</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/contas")}
      >
        <Text style={styles.secondaryButtonText}>Minhas Contas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/categorias")}
      >
        <Text style={styles.secondaryButtonText}>Minhas Categorias</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/limite-mensal")}
      >
        <Text style={styles.secondaryButtonText}>Limite Mensal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/agenda")}
      >
        <Text style={styles.secondaryButtonText}>Agenda Financeira</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/insights")}
      >
        <Text style={styles.secondaryButtonText}>Tela De Insights IA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sair Da Conta</Text>
      </TouchableOpacity>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.navy,
    marginBottom: 10,
  },
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
