import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";

function getPasswordStrength(password = "") {
  const score = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;

  if (password.length === 0) {
    return { label: "Digite Uma Senha", color: COLORS.indigo, width: "0%" };
  }

  if (score <= 2) {
    return { label: "Senha Fraca", color: "#E11D48", width: "33%" };
  }

  if (score === 3 || score === 4) {
    return { label: "Senha Média", color: "#F59E0B", width: "66%" };
  }

  return { label: "Senha Forte", color: "#16A34A", width: "100%" };
}

export default function PasswordStrengthIndicator({ password }) {
  const strength = getPasswordStrength(password);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Força Da Senha</Text>
        <Text style={[styles.status, { color: strength.color }]}>
          {strength.label}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: strength.width, backgroundColor: strength.color },
          ]}
        />
      </View>
      <Text style={styles.helpText}>
        Use 8+ Caracteres, Letras Maiúsculas, Minúsculas, Números E Símbolos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    color: COLORS.indigo,
    fontSize: 12,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  helpText: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 11,
  },
});
