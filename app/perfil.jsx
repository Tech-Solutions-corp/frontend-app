import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { financeApi } from "../services/financeApi";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { formatDateTime } from "../utils/dateFormatter";

export default function PerfilScreen() {
  const { loading: authLoading, isAuthenticated } = useRequireAuth();
  const { token, userEmail, userId, userName, logout } = useAuth();
  const { t, language, changeLanguage } = useI18n();
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
      <Text style={styles.title}>{t("profile")}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{t("name")}</Text>
        <Text style={styles.value}>
          {profile?.name || userName || t("not_informed")}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>{t("email")}</Text>
        <Text style={styles.value}>
          {profile?.email || userEmail || t("not_informed")}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>{t("user_id")}</Text>
        <Text style={styles.value}>{profile?.id || userId || "-"}</Text>

        <Text style={[styles.label, { marginTop: 10 }]}>{t("created_at")}</Text>
        <Text style={styles.value}>
          {profile?.createdAt ? formatDateTime(profile.createdAt) : "-"}
        </Text>

        <Text style={[styles.label, { marginTop: 10 }]}>{t("updated_at")}</Text>
        <Text style={styles.value}>
          {profile?.updatedAt ? formatDateTime(profile.updatedAt) : "-"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/alterar-email")}
      >
        <Text style={styles.secondaryButtonText}>{t("alter_email")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/alterar-senha")}
      >
        <Text style={styles.secondaryButtonText}>{t("alter_password")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/importacoes")}
      >
        <Text style={styles.secondaryButtonText}>{t("importing_history")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/contas")}
      >
        <Text style={styles.secondaryButtonText}>{t("my_accounts")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/categorias")}
      >
        <Text style={styles.secondaryButtonText}>{t("my_categories")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/limite-mensal")}
      >
        <Text style={styles.secondaryButtonText}>{t("monthly_limit_page")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/agenda")}
      >
        <Text style={styles.secondaryButtonText}>{t("financial_agenda")}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/insights")}
      >
        <Text style={styles.secondaryButtonText}>{t("insights_ai")}</Text>
      </TouchableOpacity>

      <View style={styles.languageSection}>
        <Text style={styles.languageTitle}>{t("language")}</Text>
        <View style={styles.languageButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "pt-BR" && styles.languageButtonActive,
            ]}
            onPress={() => changeLanguage("pt-BR")}
          >
            <Text
              style={[
                styles.languageButtonText,
                language === "pt-BR" && styles.languageButtonTextActive,
              ]}
            >
              🇧🇷 {t("portuguese")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageButton,
              language === "en" && styles.languageButtonActive,
            ]}
            onPress={() => changeLanguage("en")}
          >
            <Text
              style={[
                styles.languageButtonText,
                language === "en" && styles.languageButtonTextActive,
              ]}
            >
              🇺🇸 {t("english")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>{t("logout")}</Text>
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
  languageSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    padding: 14,
    marginBottom: 12,
    ...SHADOW,
  },
  languageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.indigo,
    marginBottom: 12,
  },
  languageButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  languageButtonActive: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.indigo,
  },
  languageButtonText: {
    color: COLORS.navy,
    fontWeight: "600",
    fontSize: 13,
  },
  languageButtonTextActive: {
    color: COLORS.white,
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: COLORS.pink,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutButtonText: { color: COLORS.navy, fontWeight: "700" },
});
