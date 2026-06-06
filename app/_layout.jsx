// app/_layout.jsx
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ErrorProvider } from "../context/ErrorContext";
import { I18nProvider } from "../context/I18nContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import GlobalAlert from "../components/GlobalAlert";
import FabAdicionar from "../components/FabAdicionar";


function LayoutContent() {
  const { isAuthenticated } = useAuth();
  return (
    <View
      style={[
        styles.container
      ]}
    >
      <Stack screenOptions={{ headerShown: false }} />
      {isAuthenticated && <BarraDeNavegacao />}
      {isAuthenticated && <FabAdicionar />}
      <GlobalAlert />
    </View>
  );
}

export default function Layout() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <I18nProvider>
          <SafeAreaProvider>
            <LayoutContent />
          </SafeAreaProvider>
        </I18nProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
