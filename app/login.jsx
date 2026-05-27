import React, { useEffect, useState } from "react";
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
import { useI18n } from "../context/I18nContext";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";

export default function LoginScreen() {
  const { login, isAuthenticated, loading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [loading, isAuthenticated]);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(t("login_validation"), t("inform_email_password"));
      return;
    }

    try {
      setSubmitting(true);
      await login(email.trim(), password);
      router.replace("/");
    } catch (error) {
      Alert.alert(t("error"), error.message || t("login_error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedScreen scroll={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("enter")}</Text>
        <Text style={styles.subtitle}>
          {t("secure_access")}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={t("email")}
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder={t("password")}
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? t("logging_in") : t("enter")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/recuperar-senha")}>
          <Text style={styles.link}>{t("forgot_password")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>{t("create_account")}</Text>
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
  title: { fontSize: 30, fontWeight: "800", color: COLORS.navy },
  subtitle: {
    fontSize: 15,
    color: COLORS.indigo,
    marginBottom: 24,
    marginTop: 6,
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
});
