// app/index.jsx
import { View, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-fundo">
      <TouchableOpacity
        className="bg-primaria px-8 py-4 rounded-2xl"
        onPress={() => router.push('/gastos')}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-base">Ver Gastos</Text>
      </TouchableOpacity>
    </View>
  );
}
