// app/_layout.jsx
import { Stack } from 'expo-router';
import BarraDeNavegacao from '../components/BarraDeNavegacao';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
