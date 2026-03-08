import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import HeaderUsuario from "../components/HeaderUsuario";
import CardLimite from "../components/CardLimite";
import CardCategoria from "../components/CardCategoria";
import BarraDeNavegacao from "../components/BarraDeNavegacao";
import { USUARIO, CATEGORIAS_GASTOS } from "../constants/mockData";

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
          aoVerGastos={() => router.push("/gastos")}
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

      <TouchableOpacity style={styles.botaoAdicionar}>
        <Text style={{ color: "#fff", fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>

      <BarraDeNavegacao abaAtiva="home" />
    </SafeAreaView>
  );
}
