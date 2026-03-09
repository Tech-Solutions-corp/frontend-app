// app/perfil.jsx
import React, { useState } from "react";
import ImgPerfil from "../assets/perfil-icon.png";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";

import BarraDeNavegacao from "../components/BarraDeNavegacao";

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const [abaAtiva, setAbaAtiva] = useState("perfil");

  // Mock do usuário
  const usuario = {
    nome: "Livia Vaccaro",
    email: "livia@email.com",
    avatar: ImgPerfil,
  };

  // Opções do menu de perfil
  const opcoesMenu = [
    {
      id: 1,
      icone: ImgPerfil,
      titulo: "Meus dados",
      subtitulo: "Editar informações pessoais",
    },
    {
      id: 2,
      icone: "🔔",
      titulo: "Notificações",
      subtitulo: "Configurar alertas",
    },
    {
      id: 3,
      icone: "🎨",
      titulo: "Aparência",
      subtitulo: "Tema e personalização",
    },
    {
      id: 4,
      icone: "🔒",
      titulo: "Segurança",
      subtitulo: "Senha e privacidade",
    },
    { id: 5, icone: "❓", titulo: "Ajuda", subtitulo: "FAQ e suporte" },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2FF" />

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>PERFIL</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerIcone}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO PRINCIPAL */}
        <ScrollView
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaConteudo}
        >
          {/* Card do usuário */}
          <View style={styles.cardUsuario}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarTexto}>{usuario.avatar}</Text>
            </View>
            <View style={styles.usuarioInfo}>
              <Text style={styles.usuarioNome}>{usuario.nome}</Text>
              <Text style={styles.usuarioEmail}>{usuario.email}</Text>
            </View>
            <TouchableOpacity style={styles.editarBtn}>
              <Text style={styles.editarTexto}>Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Menu de opções */}
          <View style={styles.menuContainer}>
            {opcoesMenu.map((opcao) => (
              <TouchableOpacity key={opcao.id} style={styles.menuItem}>
                <View style={styles.menuIconeContainer}>
                  <Text style={styles.menuIcone}>{opcao.icone}</Text>
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuTitulo}>{opcao.titulo}</Text>
                  <Text style={styles.menuSubtitulo}>{opcao.subtitulo}</Text>
                </View>
                <Text style={styles.menuSeta}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão de logout */}
          <TouchableOpacity style={styles.logoutBtn}>
            <Text style={styles.logoutTexto}>Sair da conta</Text>
          </TouchableOpacity>

          {/* Indicador de placeholder */}
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderSubtitulo}>
              Molde para teste de navegação
            </Text>
          </View>
        </ScrollView>

        {/* BARRA DE NAVEGAÇÃO */}
        <View style={{ paddingBottom: insets.bottom }}>
          <BarraDeNavegacao abaAtiva={abaAtiva} aoTocarAba={setAbaAtiva} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F2FF",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerIcone: {
    fontSize: 18,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  lista: {
    flex: 1,
  },
  listaConteudo: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardUsuario: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0D9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: {
    fontSize: 28,
  },
  usuarioInfo: {
    flex: 1,
    marginLeft: 16,
  },
  usuarioNome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  usuarioEmail: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  editarBtn: {
    backgroundColor: "#6C47FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editarTexto: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginTop: 24,
    overflow: "hidden",
    shadowColor: "#6C47FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F4F2FF",
  },
  menuIconeContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcone: {
    fontSize: 18,
  },
  menuInfo: {
    flex: 1,
    marginLeft: 12,
  },
  menuTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  menuSubtitulo: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  menuSeta: {
    fontSize: 24,
    color: "#C7C7CC",
    fontWeight: "300",
  },
  logoutBtn: {
    backgroundColor: "#FFF0F0",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    alignItems: "center",
  },
  logoutTexto: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholderContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  placeholderSubtitulo: {
    fontSize: 14,
    color: "#8E8E93",
  },
});
