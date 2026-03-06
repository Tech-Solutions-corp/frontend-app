// components/CartaoDeGasto.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CartaoDeGasto = ({ loja, descricao, horario, valor, icone, corIcone }) => {
  return (
    <View style={styles.card}>

      {/* Linha superior: loja + ícone */}
      <View style={styles.linha}>
        <Text style={styles.loja}>{loja}</Text>
        <View style={[styles.iconeContainer, { backgroundColor: corIcone }]}>
          <Text style={styles.icone}>{icone}</Text>
        </View>
      </View>

      {/* Descrição */}
      <Text style={styles.descricao}>{descricao}</Text>

      {/* Linha inferior: horário + valor */}
      <View style={styles.linha}>
        <View style={styles.horarioContainer}>
          <Text style={styles.relogio}>🕐</Text>
          <Text style={styles.horario}>{horario}</Text>
        </View>
        <Text style={styles.valor}>{valor}</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#6C47FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loja: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  iconeContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icone: {
    fontSize: 18,
  },
  descricao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginVertical: 6,
  },
  horarioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relogio: {
    fontSize: 12,
  },
  horario: {
    fontSize: 12,
    color: '#6C47FF',
    fontWeight: '500',
  },
  valor: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
  },
});

export default CartaoDeGasto;
