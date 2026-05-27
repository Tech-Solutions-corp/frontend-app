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
import { useI18n } from "../context/I18nContext";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { t } = useI18n();
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
      Alert.alert(t("validation"), t("fill_all_fields"));
      return;
    }

    if (!passwordsMatch) {
      Alert.alert(t("validation"), t("passwords_must_match"));
      return;
    }

    if (!isPasswordStrongEnough) {
      Alert.alert(t("validation"), t("password_must_be_strong"));
      return;
    }

    try {
      setSubmitting(true);
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace("/");
    } catch (error) {
      Alert.alert(t("error"), error.message || t("error_creating_account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemedScreen scroll={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("register")}</Text>

        <TextInput
          style={styles.input}
          placeholder={t("name")}
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder={t("confirm_password")}
          placeholderTextColor="rgba(26, 26, 46, 0.55)"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <PasswordStrengthIndicator password={password} />

        {confirmPassword.length > 0 && !passwordsMatch ? (
          <Text style={styles.errorText}>{t("passwords_must_match")}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.primaryButtonText}>
            {submitting ? t("creating") : t("register")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>{t("already_have_account")}</Text>
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
