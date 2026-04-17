import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ArcoPercent from './ArcoPercent';

const CardLimite = ({ percent, aoVerGastos }) => {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.titulo}>Limite de gastos{'\n'}para o mês</Text>
        <TouchableOpacity style={styles.botao} onPress={aoVerGastos}>
          <Text style={styles.botaoTexto}>Ver gastos</Text>
        </TouchableOpacity>
      </View>

      <ArcoPercent percent={percent} size={90} cor="#FFFFFF" corTexto="#FFFFFF" />

      <TouchableOpacity style={styles.menu}>
        <Text style={{ color: '#fff', fontSize: 18, letterSpacing: 2 }}>···</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#6C47FF',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 130,
    position: 'relative',
  },
  titulo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  botaoTexto: {
    color: '#6C47FF',
    fontWeight: '700',
    fontSize: 13,
  },
  menu: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
});

export default CardLimite;