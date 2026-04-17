// components/FiltroDeCategorias.jsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const FiltroDeCategorias = ({ categorias = [], categoriaSelecionada, aoSelecionar }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {categorias.map((cat) => {
        const estaSelecionada = cat === categoriaSelecionada;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, estaSelecionada && styles.chipSelecionado]}
            onPress={() => aoSelecionar?.(cat)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipTexto, estaSelecionada && styles.chipTextoSelecionado]}>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDD5FF',
    backgroundColor: 'transparent',
  },
  chipSelecionado: {
    backgroundColor: '#6C47FF',
    borderColor: '#6C47FF',
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C47FF',
  },
  chipTextoSelecionado: {
    color: '#FFFFFF',
  },
});

export default FiltroDeCategorias;
