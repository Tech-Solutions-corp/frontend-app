import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useI18n } from "../context/I18nContext";
import { COLORS } from "../constants/theme";

const FLAGS = {
  "pt-BR": { flag: "🇧🇷", label: "PT-BR" },
  en: { flag: "🇺🇸", label: "EN" },
};

export default function LanguageToggle() {
  const { language, changeLanguage } = useI18n();

  const next = language === "pt-BR" ? "en" : "pt-BR";
  const current = FLAGS[language];

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => changeLanguage(next)}
      activeOpacity={0.75}
    >
      <Text style={styles.flag}>{current.flag}</Text>
      <Text style={styles.label}>{current.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F0EBFF",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#D8CCFF",
  },
  flag: {
    fontSize: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.indigo,
    letterSpacing: 0.4,
  },
});
