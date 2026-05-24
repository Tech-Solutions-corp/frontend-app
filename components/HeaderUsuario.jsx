import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import NotificationBell from "./NotificationBell";
import LanguageToggle from "./LanguageToggle";

const HeaderUsuario = ({ nome, avatar }) => {
  const initials = (nome || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={styles.container}>
      <View style={styles.esquerda}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>{initials || "U"}</Text>
          </View>
        )}
        <View>
          <Text style={styles.ola}>Olá!</Text>
          <Text style={styles.nome}>{nome}</Text>
        </View>
      </View>

      <View style={styles.direita}>
        <LanguageToggle />
        <NotificationBell />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  esquerda: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6C47FF",
  },
  avatarFallbackText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  ola: {
    fontSize: 13,
    color: "#888",
  },
  nome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  direita: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    width: 23,
    height: 23,
  },
});

export default HeaderUsuario;