import React, { useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";

import BarraDeNavegacao from "../components/BarraDeNavegacao";
import CarrosselDeDatas from "../components/CarrosselDeDatas";
import FiltroDeCategorias from "../components/FiltroDeCategorias";
import CartaoDeGasto from "../components/CartaoDeGasto";

import {
  DATAS,
  INDICE_DIA_SELECIONADO,
  CATEGORIAS,
  GASTOS,
} from "../constants/mockData";

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();

  const [indiceDateSelecionado, setIndiceDateSelecionado] = useState(
    INDICE_DIA_SELECIONADO,
  );
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("All");
  const [abaAtiva, setAbaAtiva] = useState("agenda");

  const gastosFiltrados =
    categoriaSelecionada === "All"
      ? GASTOS
      : GASTOS.filter((g) => g.categoria === categoriaSelecionada);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>AGENDA</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerIcone}>🔔</Text>
          </TouchableOpacity>
        </View>

        <CarrosselDeDatas
          datas={DATAS}
          indiceSelecionado={indiceDateSelecionado}
          aoSelecionarData={setIndiceDateSelecionado}
        />

        <View style={styles.filtroWrapper}>
          <FiltroDeCategorias
            categorias={CATEGORIAS}
            categoriaSelecionada={categoriaSelecionada}
            aoSelecionar={setCategoriaSelecionada}
          />
        </View>

        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaConteudo}
        >
          {gastosFiltrados.map((gasto) => (
            <CartaoDeGasto key={gasto.id} {...gasto} />
          ))}
        </ScrollView>

        <View style={{ paddingBottom: insets.bottom }}>
          <BarraDeNavegacao abaAtiva={abaAtiva} aoTocarAba={setAbaAtiva} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F2FF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerIcone: {
    fontSize: 18,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  filtroWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingBottom: 100,
  },
});
