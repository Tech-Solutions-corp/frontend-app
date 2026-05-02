import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ArcoPercent from "./ArcoPercent";

const CardLimite = ({
  title = "Limite de Gastos Para o Mês",
  subtitle,
  percent,
  metric,
  aoVerGastos,
  aoRegistrarLimite,
}) => {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>{title}</Text>
        {subtitle ? <Text style={styles.subtitulo}>{subtitle}</Text> : null}
        {metric ? <Text style={styles.metric}>{metric}</Text> : null}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.botao} onPress={aoVerGastos}>
            <Text style={styles.botaoTexto}>Ver Gastos</Text>
          </TouchableOpacity>
          {aoRegistrarLimite ? (
            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={aoRegistrarLimite}
            >
              <Text style={styles.botaoSecundarioTexto}>Registrar Limite</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ArcoPercent percent={percent} size={90} corTexto="#FFFFFF" />

      <TouchableOpacity style={styles.menu}>
        <Text style={{ color: "#fff", fontSize: 18, letterSpacing: 2 }}>
          ···
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#6C47FF",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 130,
    position: "relative",
  },
  titulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 8,
  },
  subtitulo: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 8,
  },
  metric: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  botao: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  botaoTexto: {
    color: "#6C47FF",
    fontWeight: "700",
    fontSize: 13,
  },
  botaoSecundario: {
    borderColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  botaoSecundarioTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  menu: {
    position: "absolute",
    top: 12,
    right: 16,
  },
});

export default CardLimite;
