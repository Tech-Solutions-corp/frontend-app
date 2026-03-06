// components/BarraDeNavegacao.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ABAS = [
  { id: 'home',    icone: '🏠' },
  { id: 'agenda',  icone: '📅' },
  { id: 'gastos',  icone: '📋' },
  { id: 'perfil',  icone: '👤' },
];

const BarraDeNavegacao = ({ abaAtiva = 'gastos', aoTocarAba }) => {
  return (
    <View style={styles.container}>
      {ABAS.map((aba) => {
        const estaAtiva = aba.id === abaAtiva;
        return (
          <TouchableOpacity
            key={aba.id}
            style={styles.aba}
            onPress={() => aoTocarAba?.(aba.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icone, estaAtiva && styles.iconeAtivo]}>
              {aba.icone}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#6C47FF',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  aba: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icone: {
    fontSize: 22,
    opacity: 0.4,
  },
  iconeAtivo: {
    opacity: 1,
  },
});

export default BarraDeNavegacao;
