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
import { INSIGHTS, CATEGORIAS_GASTOS } from "../constants/mockData";
import SinoIcon from "../assets/sino-icon.png";

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const [abaAtiva, setAbaAtiva] = useState("insights");
  const [insightSelecionado, setInsightSelecionado] = useState(null);

  const getInsightDetalhado = (insightId) => {
    const detalhes = {
      "1": {
        recomendacoes: [
          "Reduza compras de itens supérfluos",
          "Planeje suas refeições para economizar",
          "Compare preços antes de comprar",
        ],
      },
      "2": {
        recomendacoes: [
          "Seu gasto com transporte é consistente",
          "Considere usar transporte público mais",
          "Compartilhe caronas para economizar",
        ],
      },
      "3": {
        recomendacoes: [
          "Defina um limite de gastos com lazer",
          "Procure atividades gratuitas",
          "Reserve um orçamento mensal para lazer",
        ],
      },
      "4": {
        recomendacoes: [
          "Mantenha esse ritmo de economia",
          "Considere investir essa quantia",
          "Defina novas metas de economia",
        ],
      },
    };
    return detalhes[insightId] || { recomendacoes: [] };
  };

  const obterCoresInsight = (tipo) => {
    switch (tipo) {
      case "economia":
        return { bg: "#FEF3C7", border: "#F59E0B", icon: "💡" };
      case "padrão":
        return { bg: "#DBEAFE", border: "#3B82F6", icon: "📊" };
      case "alerta":
        return { bg: "#FEE2E2", border: "#EF4444", icon: "⚠️" };
      case "meta":
        return { bg: "#DCFCE7", border: "#10B981", icon: "🎯" };
      default:
        return { bg: "#E0D9FF", border: "#6C47FF", icon: "💡" };
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>INSIGHTS IA</Text>
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
          {/* Card de Resumo */}
          <View style={styles.cardResumo}>
            <View style={styles.resumoHeader}>
              <Text style={styles.resumoTitulo}>Resumo do Mês</Text>
              <Text style={styles.resumoMes}>Maio 2024</Text>
            </View>

            <View style={styles.resumoStats}>
              <View style={styles.resumoStat}>
                <Text style={styles.resumoStatIcone}>📈</Text>
                <View>
                  <Text style={styles.resumoStatLabel}>Renda Total</Text>
                  <Text style={styles.resumoStatValor}>R$ 4.500,00</Text>
                </View>
              </View>

              <View style={styles.resumoStat}>
                <Text style={styles.resumoStatIcone}>📉</Text>
                <View>
                  <Text style={styles.resumoStatLabel}>Gastos Totais</Text>
                  <Text style={styles.resumoStatValor}>R$ 3.980,00</Text>
                </View>
              </View>

              <View style={styles.resumoStat}>
                <Text style={styles.resumoStatIcone}>💰</Text>
                <View>
                  <Text style={styles.resumoStatLabel}>Saldo</Text>
                  <Text style={[styles.resumoStatValor, { color: "#10B981" }]}>
                    R$ 520,00
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Seção de Insights */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Insights Inteligentes</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{INSIGHTS.length}</Text>
            </View>
          </View>

          {INSIGHTS.map((insight) => {
            const cores = obterCoresInsight(insight.tipo);
            const estaExpandido = insightSelecionado === insight.id;

            return (
              <View key={insight.id}>
                <TouchableOpacity
                  style={[
                    styles.cardInsight,
                    { backgroundColor: cores.bg },
                    { borderLeftColor: cores.border },
                  ]}
                  onPress={() =>
                    setInsightSelecionado(
                      estaExpandido ? null : insight.id
                    )
                  }
                >
                  <Text style={styles.insightIcone}>{insight.icone}</Text>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitulo}>
                      {insight.titulo}
                    </Text>
                    <Text style={styles.insightDescricao}>
                      {insight.descricao}
                    </Text>
                  </View>
                  <Text style={styles.expandirIcone}>
                    {estaExpandido ? "▼" : "›"}
                  </Text>
                </TouchableOpacity>

                {/* Seção Expandida */}
                {estaExpandido && (
                  <View style={styles.insightExpandido}>
                    <Text style={styles.recomendacoesTitulo}>
                      Recomendações
                    </Text>
                    {getInsightDetalhado(insight.id).recomendacoes.map(
                      (rec, idx) => (
                        <View key={idx} style={styles.recomendacao}>
                          <Text style={styles.recomendacaoNumero}>
                            {idx + 1}
                          </Text>
                          <Text style={styles.recomendacaoTexto}>
                            {rec}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}
              </View>
            );
          })}

          {/* Seção de Análise por Categoria */}
          <View style={[styles.secaoHeader, { marginTop: 28 }]}>
            <Text style={styles.secaoTitulo}>Por Categoria</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{CATEGORIAS_GASTOS.length}</Text>
            </View>
          </View>

          {CATEGORIAS_GASTOS.map((cat) => (
            <View key={cat.id} style={styles.analiseCategoria}>
              <View style={styles.analiseCategoriaHeader}>
                <View style={styles.analiseCategoriaLabel}>
                  <Text
                    style={[
                      styles.analiseCategoriaIcone,
                      { color: cat.cor },
                    ]}
                  >
                    {cat.icone}
                  </Text>
                  <View>
                    <Text style={styles.analiseCategoriaName}>{cat.nome}</Text>
                    <Text style={styles.analiseCategoriaQtd}>
                      {cat.qtd} transações
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.analiseCategoriaPercent,
                    { color: cat.cor },
                  ]}
                >
                  {cat.percent}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${cat.percent}%`, backgroundColor: cat.cor },
                  ]}
                />
              </View>
            </View>
          ))}

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
  cardResumo: {
    backgroundColor: "linear-gradient(135deg, #6C47FF 0%, #9B59B6 100%)",
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  resumoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resumoTitulo: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  resumoMes: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  resumoStats: {
    gap: 12,
  },
  resumoStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 12,
  },
  resumoStatIcone: {
    fontSize: 24,
  },
  resumoStatLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
  resumoStatValor: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  secaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
    marginBottom: 14,
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
  cardInsight: {
    backgroundColor: "#FEF3C7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  insightIcone: {
    fontSize: 24,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  insightDescricao: {
    fontSize: 13,
    color: "#6B5B3C",
    marginTop: 4,
    lineHeight: 18,
  },
  expandirIcone: {
    fontSize: 18,
    color: "#8E8E93",
    fontWeight: "300",
    marginTop: 2,
  },
  insightExpandido: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E0D9FF",
  },
  recomendacoesTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  recomendacao: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  recomendacaoNumero: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0D9FF",
    color: "#6C47FF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
  },
  recomendacaoTexto: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A2E",
    lineHeight: 20,
  },
  analiseCategoria: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  analiseCategoriaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  analiseCategoriaLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  analiseCategoriaIcone: {
    fontSize: 20,
  },
  analiseCategoriaName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  analiseCategoriaQtd: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  analiseCategoriaPercent: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
});
