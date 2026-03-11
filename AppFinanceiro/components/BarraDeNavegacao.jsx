import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import ImgCalendario from "../assets/calendario-icon.png";
import ImgHome from "../assets/home-icon.png";
import ImgDocumento from "../assets/documento-icon.png";
import ImgPerfil from "../assets/perfil-icon.png";
import { useRouter } from "expo-router";

const ABA_ESQUERDA = [
  { id: "home", icone: ImgHome },
  { id: "agenda", icone: ImgCalendario },
];

const ABA_DIREITA = [
  { id: "gastos", icone: ImgDocumento },
  { id: "perfil", icone: ImgPerfil },
];

const FAB_SIZE = 56;

const BarraDeNavegacao = ({ abaAtiva = "home" }) => {
  const router = useRouter();
  const [larguraContainer, setLarguraContainer] = useState(0);

  const ROTAS = {
    home: "/",
    agenda: "/agenda",
    gastos: "/gastos",
    perfil: "/perfil",
  };

  const handlePress = (abaId) => {
    console.log("Navegando para:", abaId, ROTAS[abaId]);
    router.push(ROTAS[abaId]);
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => setLarguraContainer(e.nativeEvent.layout.width)}
    >
      {ABA_ESQUERDA.map((aba) => {
        const estaAtiva = aba.id === abaAtiva;
        return (
          <TouchableOpacity
            key={aba.id}
            style={styles.aba}
            onPress={() => handlePress(aba.id)}
            activeOpacity={0.7}
          >
            <Image
              style={[styles.icone, estaAtiva && styles.iconeAtivo]}
              source={aba.icone}
            />
          </TouchableOpacity>
        );
      })}

      <View style={styles.espacoFab} />

      {/* FAB centralizado com base na largura real do container */}
      {larguraContainer > 0 && (
        <TouchableOpacity
          style={[styles.fab, { left: larguraContainer / 2 - FAB_SIZE / 2 }]}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcone}>＋</Text>
        </TouchableOpacity>
      )}

      {ABA_DIREITA.map((aba) => {
        const estaAtiva = aba.id === abaAtiva;
        return (
          <TouchableOpacity
            key={aba.id}
            style={styles.aba}
            onPress={() => handlePress(aba.id)}
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
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    overflow: "visible",
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
  },
  espacoFab: {
    width: 72,
  },
  fab: {
    position: "absolute",
    top: -30,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: "#6C47FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  fabIcone: {
    fontSize: 28,
    color: "#FFFFFF",
    lineHeight: 32,
  },
});

export default BarraDeNavegacao;
