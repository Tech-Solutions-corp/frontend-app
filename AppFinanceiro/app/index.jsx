// app/index.jsx
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => router.push("/gastos")}
        >
          <Text style={styles.botaoTexto}>Ver Gastos</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F2FF",
  },
  botao: {
    backgroundColor: "#6C47FF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
