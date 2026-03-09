// app/gastos.jsx
import React, { useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";

import SinoIcon from "../assets/sino-icon.png";

import BarraDeNavegacao from "../components/BarraDeNavegacao";

export default function GastosScreen() {
  const insets = useSafeAreaInsets();
  const [abaAtiva, setAbaAtiva] = useState("gastos");

  // Mock temporário para visualização
  const gastosExemplo = [
    { id: 1, titulo: "Supermercado", valor: 150.0, categoria: "Alimentação" },
    { id: 2, titulo: "Uber", valor: 25.5, categoria: "Transporte" },
    { id: 3, titulo: "Netflix", valor: 39.9, categoria: "Entretenimento" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>GASTOS</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Image style={styles.btn} source={SinoIcon}/>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaConteudo}
        >
          {/* Placeholder de filtros */}
          <View style={styles.filtrosPlaceholder}>
            <Text style={styles.placeholderTexto}>
              [ Filtros de categoria aqui ]
            </Text>
          </View>

          {/* Lista de gastos mock */}
          {gastosExemplo.map((gasto) => (
            <View key={gasto.id} style={styles.cardGasto}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitulo}>{gasto.titulo}</Text>
                <Text style={styles.cardCategoria}>{gasto.categoria}</Text>
              </View>
              <Text style={styles.cardValor}>
                R$ {gasto.valor.toFixed(2).replace(".", ",")}
              </Text>
            </View>
          ))}

          {/* Indicador de placeholder */}
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderEmoji}>📊</Text>
            <Text style={styles.placeholderTitulo}>Tela de Gastos</Text>
            <Text style={styles.placeholderSubtitulo}>
              Molde para teste de navegação
            </Text>
          </View>
        </ScrollView>

        {/* BARRA DE NAVEGAÇÃO */}
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
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    width: 23,
    height: 23
  },
  headerIcone: {
    fontSize: 18,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  filtrosPlaceholder: {
    backgroundColor: "#E0D9FF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: "center",
  },
  placeholderTexto: {
    color: "#6C47FF",
    fontSize: 14,
    fontWeight: "600",
  },
  cardGasto: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  cardCategoria: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
  },
  cardValor: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6C47FF",
  },
  placeholderContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  placeholderTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  placeholderSubtitulo: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
});
