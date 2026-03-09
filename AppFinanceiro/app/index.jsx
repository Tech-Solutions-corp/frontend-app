import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import HeaderUsuario from "../components/HeaderUsuario";
import CardLimite from "../components/CardLimite";
import CardCategoria from "../components/CardCategoria";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { USUARIO, CATEGORIAS_GASTOS } from "../constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeaderUsuario nome={USUARIO.nome} avatar={USUARIO.avatar} />

        <CardLimite
          percent={USUARIO.limitePercent}
          aoVerGastos={() => router.push("/")}
        />

        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>Gastos por categoria</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{CATEGORIAS_GASTOS.length}</Text>
          </View>
        </View>

        {CATEGORIAS_GASTOS.map((cat) => (
          <CardCategoria key={cat.id} {...cat} />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BarraDeNavegacao abaAtiva="home" />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F2FF",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  secaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
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
  botaoAdicionar: {
    position: "absolute",
    bottom: 72,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6C47FF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
