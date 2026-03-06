// components/CarrosselDeDatas.jsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CarrosselDeDatas = ({ datas = [], indiceSelecionado = 0, aoSelecionarData }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {datas.map((item, index) => {
        const estaSelecionado = index === indiceSelecionado;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.item, estaSelecionado && styles.itemSelecionado]}
            onPress={() => aoSelecionarData?.(index)}
            activeOpacity={0.8}
          >
            <Text style={[styles.mes, estaSelecionado && styles.textoSelecionado]}>
              {item.mes}
            </Text>
            <Text style={[styles.dia, estaSelecionado && styles.textoSelecionado]}>
              {item.dia}
            </Text>
            <Text style={[styles.diaSemana, estaSelecionado && styles.textoSelecionado]}>
              {item.diaSemana}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  item: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    minWidth: 60,
  },
  itemSelecionado: {
    backgroundColor: '#6C47FF',
  },
  mes: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  dia: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  diaSemana: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  textoSelecionado: {
    color: '#FFFFFF',
  },
});

export default CarrosselDeDatas;
