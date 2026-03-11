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
import { CONTAS, USUARIO } from "../constants/mockData";
import SinoIcon from "../assets/sino-icon.png";

export default function ContasScreen() {
  const insets = useSafeAreaInsets();
  const [abaAtiva, setAbaAtiva] = useState("contas");

  const totalSaldo = CONTAS.reduce((acc, conta) => {
    if (conta.tipo === "CREDIT_CARD") {
      return acc - Math.abs(conta.saldo);
    }
    return acc + conta.saldo;
  }, 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>CONTAS</Text>
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
          {/* Card de Saldo Total */}
          <View style={styles.cardSaldoTotal}>
            <Text style={styles.labelSaldo}>Saldo Total</Text>
            <Text style={styles.totalSaldo}>
              R$ {totalSaldo.toFixed(2).replace(".", ",")}
            </Text>
            <View style={styles.acoesBotoes}>
              <TouchableOpacity style={styles.botaoAcao}>
                <Text style={styles.botaoAcaoIcone}>➕</Text>
                <Text style={styles.botaoAcaoTexto}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoAcao}>
                <Text style={styles.botaoAcaoIcone}>💸</Text>
                <Text style={styles.botaoAcaoTexto}>Transferir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Seção de Contas */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Minhas Contas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{CONTAS.length}</Text>
            </View>
          </View>

          {/* Lista de Contas */}
          {CONTAS.map((conta) => (
            <TouchableOpacity key={conta.id} style={styles.cardConta}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: conta.cor + "20" },
                ]}
              >
                <Text style={styles.contaIcone}>{conta.icone}</Text>
              </View>
              <View style={styles.contaInfo}>
                <Text style={styles.contaNome}>{conta.nome}</Text>
                <Text style={styles.contaTipo}>
                  {conta.tipo === "WALLET"
                    ? "Carteira"
                    : conta.tipo === "BANK"
                    ? "Banco"
                    : conta.tipo === "SAVINGS"
                    ? "Poupança"
                    : "Cartão de Crédito"}
                </Text>
              </View>
              <View style={styles.contaSaldo}>
                <Text
                  style={[
                    styles.contaSaldoValor,
                    {
                      color:
                        conta.tipo === "CREDIT_CARD"
                          ? "#FF6B8A"
                          : "#6C47FF",
                    },
                  ]}
                >
                  R$ {Math.abs(conta.saldo).toFixed(2).replace(".", ",")}
                </Text>
                {conta.ativa && (
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusTexto}>Ativa</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Card de Limite Cartão */}
          {CONTAS.filter((c) => c.tipo === "CREDIT_CARD").map((cartao) => (
            <View key={cartao.id} style={styles.cardLimiteCreditoInfo}>
              <View style={styles.limitoHeader}>
                <Text style={styles.limitoTitulo}>{cartao.nome}</Text>
                <Text style={styles.limitoValor}>
                  R$ {cartao.limite.toFixed(2).replace(".", ",")}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        ((cartao.limite - Math.abs(cartao.saldo)) /
                          cartao.limite) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={styles.progressTexto}
              >{`${(
                ((cartao.limite - Math.abs(cartao.saldo)) / cartao.limite) *
                100
              ).toFixed(0)}% disponível`}</Text>
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
  cardSaldoTotal: {
    backgroundColor: "#6C47FF",
    borderRadius: 20,
    padding: 24,
    marginVertical: 16,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  labelSaldo: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  totalSaldo: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
    marginVertical: 12,
  },
  acoesBotoes: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  botaoAcao: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  botaoAcaoIcone: {
    fontSize: 20,
    marginBottom: 4,
  },
  botaoAcaoTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
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
  cardConta: {
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
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contaIcone: {
    fontSize: 24,
  },
  contaInfo: {
    flex: 1,
  },
  contaNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  contaTipo: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  contaSaldo: {
    alignItems: "flex-end",
  },
  contaSaldoValor: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusTexto: {
    fontSize: 10,
    color: "#10B981",
    fontWeight: "600",
  },
  cardLimiteCreditoInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  limitoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  limitoTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  limitoValor: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6C47FF",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0D9FF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6C47FF",
  },
  progressTexto: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 8,
  },
});
