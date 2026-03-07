import React from 'react';
import { View, Text } from 'react-native';

function corDoArco(percent) {
  if (percent >= 80) return '#F97316';
  if (percent >= 50) return '#A78BFA';
  return '#6C47FF';
}

const ArcoPercent = ({ percent, size = 52, cor, corTexto = '#1A1A2E' }) => {
  const stroke = cor || corDoArco(percent);
  const rotacao = (percent / 100) * 360;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Trilha cinza */}
      <View style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.25)',
      }} />
      {/* Arco colorido */}
      <View style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
      }}>
        <View style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: stroke,
          borderBottomColor: 'transparent',
          borderLeftColor: percent > 50 ? stroke : 'transparent',
          transform: [{ rotate: `${rotacao - 90}deg` }],
        }} />
      </View>
      <Text style={{ fontSize: size * 0.2, fontWeight: '700', color: corTexto }}>
        {percent}%
      </Text>
    </View>
  );
};

export default ArcoPercent;