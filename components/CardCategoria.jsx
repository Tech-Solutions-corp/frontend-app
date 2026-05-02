import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ArcoPercent from "./ArcoPercent";

function toTitleCase(value = "") {
  return String(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const CardCategoria = ({ nome, qtd, percent, icone, cor }) => {
  const nomeFormatado = toTitleCase(nome);
  return (
    <View style={styles.card}>
      <View style={[styles.iconeContainer, { backgroundColor: cor + "22" }]}>
        <Text style={{ fontSize: 20 }}>{icone}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome}>{nomeFormatado}</Text>
        <Text style={styles.qtd}>
          {qtd} {qtd === 1 ? "Gasto" : "Gastos"}
        </Text>
      </View>
      <ArcoPercent percent={percent} cor={cor} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nome: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  qtd: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
});

export default CardCategoria;
