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
import { IMPORTACOES, CONTAS } from "../constants/mockData";
import SinoIcon from "../assets/sino-icon.png";

export default function ImportacoesScreen() {
  const insets = useSafeAreaInsets();
  const [abaAtiva, setAbaAtiva] = useState("importacoes");
  const [importacaoSelecionada, setImportacaoSelecionada] = useState(null);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>IMPORTAÇÕES</Text>
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
          {/* Card de Importar Novo */}
          <View style={styles.cardImportarNovo}>
            <View style={styles.uploadIcone}>
              <Text style={styles.uploadTexto}>📁</Text>
            </View>
            <View style={styles.uploadContent}>
              <Text style={styles.uploadTitulo}>Importar Extrato</Text>
              <Text style={styles.uploadSubtitulo}>
                Selecione um arquivo CSV ou Excel
              </Text>
            </View>
            <TouchableOpacity style={styles.botaoImportar}>
              <Text style={styles.botaoImportarTexto}>Abrir</Text>
            </TouchableOpacity>
          </View>

          {/* Informação sobre Importação */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcone}>ℹ️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitulo}>Como Importar</Text>
              <Text style={styles.infoTexto}>
                1. Exporte seu extrato do banco{"\n"}
                2. Selecione o arquivo CSV{"\n"}
                3. Escolha a conta de destino{"\n"}
                4. Revise e confirme
              </Text>
            </View>
          </View>

          {/* Seção de Histórico de Importações */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Histórico</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{IMPORTACOES.length}</Text>
            </View>
          </View>

          {IMPORTACOES.map((imp) => (
            <TouchableOpacity
              key={imp.id}
              style={[
                styles.cardImportacao,
                importacaoSelecionada === imp.id &&
                  styles.importacaoSelecionada,
              ]}
              onPress={() => setImportacaoSelecionada(imp.id)}
            >
              <View style={styles.importacaoIconContainer}>
                <Text style={styles.importacaoIcone}>📄</Text>
              </View>

              <View style={styles.importacaoInfo}>
                <Text style={styles.importacaoArquivo}>{imp.arquivo}</Text>
                <View style={styles.importacaoDetalhes}>
                  <Text style={styles.importacaoDetalhe}>
                    📅 {new Date(imp.dataImport).toLocaleDateString("pt-BR")}
                  </Text>
                  <Text style={styles.importacaoDetalhe}>
                    📊 {imp.transacoes} transações
                  </Text>
                  <Text style={styles.importacaoDetalhe}>
                    🏦 {imp.conta}
                  </Text>
                </View>
              </View>

              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusIndicador,
                    {
                      backgroundColor:
                        imp.status === "Concluído" ? "#10B981" : "#F59E0B",
                    },
                  ]}
                />
                <Text style={styles.statusTexto}>{imp.status}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Card de Detalhes de Importação Selecionada */}
          {importacaoSelecionada && (
            <View style={styles.cardDetalhes}>
              <Text style={styles.detalhesTitle}>Detalhes da Importação</Text>
              {IMPORTACOES.map(
                (imp) =>
                  imp.id === importacaoSelecionada && (
                    <View key={imp.id}>
                      <View style={styles.detalheItem}>
                        <Text style={styles.detalheLabel}>Arquivo:</Text>
                        <Text style={styles.detalheValor}>{imp.arquivo}</Text>
                      </View>
                      <View style={styles.detalheItem}>
                        <Text style={styles.detalheLabel}>Data de Importação:</Text>
                        <Text style={styles.detalheValor}>
                          {new Date(imp.dataImport).toLocaleDateString(
                            "pt-BR"
                          )}
                        </Text>
                      </View>
                      <View style={styles.detalheItem}>
                        <Text style={styles.detalheLabel}>Transações:</Text>
                        <Text style={styles.detalheValor}>
                          {imp.transacoes}
                        </Text>
                      </View>
                      <View style={styles.detalheItem}>
                        <Text style={styles.detalheLabel}>Conta:</Text>
                        <Text style={styles.detalheValor}>{imp.conta}</Text>
                      </View>
                      <View style={styles.detalheItem}>
                        <Text style={styles.detalheLabel}>Status:</Text>
                        <Text
                          style={[
                            styles.detalheValor,
                            {
                              color:
                                imp.status === "Concluído"
                                  ? "#10B981"
                                  : "#F59E0B",
                            },
                          ]}
                        >
                          {imp.status}
                        </Text>
                      </View>

                      <TouchableOpacity style={styles.botaoExcluir}>
                        <Text style={styles.botaoExcluirTexto}>
                          Excluir Importação
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
              )}
            </View>
          )}

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
  cardImportarNovo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#6C47FF",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  uploadIcone: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E0D9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadTexto: {
    fontSize: 28,
  },
  uploadContent: {
    flex: 1,
  },
  uploadTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  uploadSubtitulo: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  botaoImportar: {
    backgroundColor: "#6C47FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  botaoImportarTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#DBEAFE",
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    flexDirection: "row",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
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
    color: "#075985",
    marginTop: 4,
    lineHeight: 18,
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
  cardImportacao: {
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
  importacaoSelecionada: {
    borderColor: "#6C47FF",
    backgroundColor: "#F9F7FF",
  },
  importacaoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E0D9FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  importacaoIcone: {
    fontSize: 24,
  },
  importacaoInfo: {
    flex: 1,
  },
  importacaoArquivo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  importacaoDetalhes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },
  importacaoDetalhe: {
    fontSize: 11,
    color: "#8E8E93",
  },
  statusContainer: {
    alignItems: "center",
    gap: 6,
  },
  statusIndicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  cardDetalhes: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  detalhesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  detalheItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  detalheLabel: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  detalheValor: {
    fontSize: 13,
    color: "#1A1A2E",
    fontWeight: "600",
  },
  botaoExcluir: {
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  botaoExcluirTexto: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
  },
});
