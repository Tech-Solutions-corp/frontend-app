import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import SinoIcon from "../assets/sino-icon.png";

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
      <TouchableOpacity style={styles.headerBtn}>
        <Image style={styles.btn} source={SinoIcon}/>
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
    paddingTop: 16,
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    width: 23,
    height: 23
  },
});

export default HeaderUsuario;