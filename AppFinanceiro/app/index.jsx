import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import HeaderUsuario from '../components/HeaderUsuario';
import CardLimite from '../components/CardLimite';
import CardCategoria from '../components/CardCategoria';
import BarraDeNavegacao from '../components/BarraDeNavegacao';

const USUARIO = {
  nome: 'Livia Vaccaro',
  avatar: 'https://i.pravatar.cc/150?img=47',
  limitePercent: 85,
};

const CATEGORIAS_GASTOS = [
  { id: '1', nome: 'Alimentação', qtd: 23, percent: 70, icone: '🛍️', cor: '#FF6B8A' },
  { id: '2', nome: 'Lazer',       qtd: 30, percent: 52, icone: '👤', cor: '#A78BFA' },
  { id: '3', nome: 'Faculdade',   qtd: 30, percent: 87, icone: '📖', cor: '#F97316' },
  { id: '4', nome: 'Transporte',  qtd: 3,  percent: 87, icone: '📖', cor: '#FBBF24' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <HeaderUsuario nome={USUARIO.nome} avatar={USUARIO.avatar} />

        <CardLimite
          percent={USUARIO.limitePercent}
          aoVerGastos={() => router.push('/gastos')}
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
        <Text style={{ color: '#fff', fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>

      <BarraDeNavegacao abaAtiva="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F2FF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  badge: {
    backgroundColor: '#E0D9FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeTexto: {
    color: '#6C47FF',
    fontSize: 12,
    fontWeight: '700',
  },
  botaoAdicionar: {
    position: 'absolute',
    bottom: 72,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C47FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C47FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});