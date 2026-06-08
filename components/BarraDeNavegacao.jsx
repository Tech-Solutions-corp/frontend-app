import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImgCalendario from "../assets/calendario-icon.png";
import ImgHome from "../assets/home-icon.png";
import ImgDocumento from "../assets/documento-icon.png";
import ImgPerfil from "../assets/perfil-icon.png";
import ImgDashboard from "../assets/dashboard.png";
import { useRouter, useSegments } from "expo-router";

const ABAS = [
  { id: "home", icone: ImgHome },
  { id: "agenda", icone: ImgCalendario },
  { id: "dashboard", icone: ImgDashboard },
  { id: "historico", icone: ImgDocumento },
  { id: "perfil", icone: ImgPerfil },
];
const FAB_SIZE = 56;

const BarraDeNavegacao = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segmentos = useSegments();

  const abaAtiva = segmentos.length > 0 ? segmentos[0] : "home";

  const ROTAS = {
    home: "/",
    agenda: "/agenda",
    dashboard: "/dashboard",
    gastos: "/gastos",
    perfil: "/perfil",
    historico: "/historico"
  };

  return (
    <View style={[styles.container, insets.bottom ]}>
      {ABAS.map((aba) => {
        const estaAtiva = aba.id === abaAtiva;
        return (
          <TouchableOpacity
            key={aba.id}
            style={styles.aba}
            onPress={() => router.replace(ROTAS[aba.id])}
            activeOpacity={0.7}
          >
            <Image
              style={[styles.icone, estaAtiva && styles.iconeAtivo]}
              source={aba.icone}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    overflow: "visible",
    zIndex: 50,
  },
  aba: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  icone: {
    width: 20,
    height: 23,
    opacity: 0.6,
  },
  iconeAtivo: {
    opacity: 1,
  }
});

export default BarraDeNavegacao;
