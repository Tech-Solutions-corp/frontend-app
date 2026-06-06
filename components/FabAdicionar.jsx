import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const FAB_SIZE = 56;
const NAVBAR_HEIGHT = 70; // altura aproximada da barra

const FabAdicionar = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { bottom: NAVBAR_HEIGHT + insets.bottom + 8 },
      ]}
      activeOpacity={0.85}
      onPress={() => router.replace("/gastos")}
    >
      <Text style={styles.fabIcone}>＋</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    alignSelf: "center",
    left: "50%",
    marginLeft: -(FAB_SIZE / 2),
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
    elevation: 10,
    zIndex: 999,
  },
  fabIcone: {
    fontSize: 28,
    color: "#FFFFFF",
    lineHeight: 32,
  },
});

export default FabAdicionar;