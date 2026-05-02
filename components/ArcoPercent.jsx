import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

function corDoArco(percent) {
  if (percent >= 80) return "#EF4444";
  if (percent >= 50) return "#FB923C";
  return "#ffffff";
}

const ArcoPercent = ({ percent = 0, size = 52, cor, corTexto = "#1A1A2E" }) => {
  const stroke = cor || corDoArco(percent);
  const trackWidth = 5;
  const radius = (size - trackWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress =
    circumference - (Math.min(percent, 100) / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
        {/* Trilha de fundo */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ffffff50"
          strokeWidth={trackWidth}
          fill="none"
        />
        {/* Arco de progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={trackWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text
        style={{ fontSize: size * 0.25, fontWeight: "700", color: corTexto }}
      >
        {Math.round(percent)}%
      </Text>
    </View>
  );
};

export default ArcoPercent;
