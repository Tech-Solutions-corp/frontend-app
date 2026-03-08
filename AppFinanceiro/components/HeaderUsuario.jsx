import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const HeaderUsuario = ({ nome, avatar }) => {
  return (
    <View style={styles.container}>
      <View style={styles.esquerda}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.ola}>Olá!</Text>
          <Text style={styles.nome}>{nome}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.sinoBotao}>
        <Text style={{ fontSize: 20 }}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  esquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  ola: {
    fontSize: 13,
    color: '#888',
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  sinoBotao: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HeaderUsuario;