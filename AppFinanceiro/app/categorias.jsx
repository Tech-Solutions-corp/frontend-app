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
  Image,
} from "react-native";

import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { CATEGORIAS_SISTEMA } from "../constants/mockData";
import SinoIcon from "../assets/sino-icon.png";

export default function CategoriasScreen() {
  const insets = useSafeAreaInsets();
  const [abaAtiva, setAbaAtiva] = useState("categorias");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);

  const categoriasRendas = CATEGORIAS_SISTEMA.filter(
    (c) => c.tipo === "INCOME"
  );
  const categoriasGastos = CATEGORIAS_SISTEMA.filter(
    (c) => c.tipo === "EXPENSE"
  );

  const renderCategoria = (categoria) => (
    <TouchableOpacity
      key={categoria.id}
      style={[
        styles.cardCategoria,
        categoriaSelecionada === categoria.id && styles.categoriaSelecionada,
      ]}
      onPress={() => setCategoriaSelecionada(categoria.id)}
    >
      <View
        style={[
          styles.categoriaIconContainer,
          { backgroundColor: categoria.cor + "20" },
        ]}
      >
        <Text style={styles.categoriaIcone}>{categoria.icone}</Text>
      </View>
      <View style={styles.categoriaInfo}>
        <Text style={styles.categoriaNome}>{categoria.nome}</Text>
      </View>
      <Text style={styles.categoriaEditar}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>CATEGORIAS</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Image style={styles.btn} source={SinoIcon} />
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaConteudo}
        >
          {/* Botão para Adicionar Categoria */}
          <TouchableOpacity style={styles.botaoAdicionarCategoria}>
            <Text style={styles.botaoAdicionarIcone}>＋</Text>
            <Text style={styles.botaoAdicionarTexto}>Nova Categoria</Text>
          </TouchableOpacity>

          {/* Seção de Categorias de Despesa */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Despesas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{categoriasGastos.length}</Text>
            </View>
          </View>

          {categoriasGastos.map((cat) => renderCategoria(cat))}

          {/* Seção de Categorias de Renda */}
          <View style={[styles.secaoHeader, { marginTop: 28 }]}>
            <Text style={styles.secaoTitulo}>Rendas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{categoriasRendas.length}</Text>
            </View>
          </View>

          {categoriasRendas.map((cat) => renderCategoria(cat))}

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcone}>💡</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitulo}>Dica de Organização</Text>
              <Text style={styles.infoTexto}>
                Organize suas categorias para melhor rastrear seus gastos e
                entender seus padrões de consumo.
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
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
    justifyContent: "center",
  },
  btn: {
    width: 23,
    height: 23,
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
  botaoAdicionarCategoria: {
    backgroundColor: "#6C47FF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  botaoAdicionarIcone: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  botaoAdicionarTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  badge: {
    backgroundColor: "#E0D9FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeTexto: {
    color: "#6C47FF",
    fontSize: 12,
    fontWeight: "700",
  },
  cardCategoria: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  categoriaSelecionada: {
    borderColor: "#6C47FF",
    backgroundColor: "#F9F7FF",
  },
  categoriaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoriaIcone: {
    fontSize: 24,
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  categoriaEditar: {
    fontSize: 24,
    color: "#C7C7CC",
    fontWeight: "300",
  },
  infoBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    marginVertical: 24,
    flexDirection: "row",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  infoIcone: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  infoTexto: {
    fontSize: 12,
    color: "#6B5B3C",
    marginTop: 4,
    lineHeight: 18,
  },
});
