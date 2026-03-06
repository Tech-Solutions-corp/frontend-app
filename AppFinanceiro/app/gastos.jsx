// app/gastos.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import BarraDeNavegacao   from '../components/BarraDeNavegacao';
import CarrosselDeDatas   from '../components/CarrosselDeDatas';
import FiltroDeCategorias from '../components/FiltroDeCategorias';
import CartaoDeGasto      from '../components/CartaoDeGasto';

import { DATAS, INDICE_DIA_SELECIONADO, CATEGORIAS, GASTOS } from '../constants/mockData';

export default function GastosScreen() {
  const [indiceDateSelecionado, setIndiceDateSelecionado] = useState(INDICE_DIA_SELECIONADO);
  const [categoriaSelecionada, setCategoriaSelecionada]   = useState('All');
  const [abaAtiva, setAbaAtiva]                           = useState('gastos');

  const gastosFiltrados =
    categoriaSelecionada === 'All'
      ? GASTOS
      : GASTOS.filter((g) => g.categoria === categoriaSelecionada);

  return (
    <SafeAreaView className="flex-1 bg-fundo">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1">

        {/* HEADER */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <TouchableOpacity className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
            <Text className="text-lg">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-titulo">Gastos</Text>
          <TouchableOpacity className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
            <Text className="text-lg">🔔</Text>
          </TouchableOpacity>
        </View>

        {/* CARROSSEL DE DATAS */}
        <CarrosselDeDatas
          datas={DATAS}
          indiceSelecionado={indiceDateSelecionado}
          aoSelecionarData={setIndiceDateSelecionado}
        />

        {/* FILTRO DE CATEGORIAS */}
        <View className="mt-2 mb-4">
          <FiltroDeCategorias
            categorias={CATEGORIAS}
            categoriaSelecionada={categoriaSelecionada}
            aoSelecionar={setCategoriaSelecionada}
          />
        </View>

        {/* LISTA DE GASTOS */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {gastosFiltrados.map((gasto) => (
            <CartaoDeGasto key={gasto.id} {...gasto} />
          ))}
        </ScrollView>

        {/* BOTÃO FLUTUANTE (FAB) */}
        <TouchableOpacity
          className="absolute bottom-20 self-center w-14 h-14 rounded-full bg-primaria items-center justify-center shadow-xl shadow-primaria"
          activeOpacity={0.85}
        >
          <Text className="text-white text-3xl leading-8">＋</Text>
        </TouchableOpacity>

        {/* BARRA DE NAVEGAÇÃO */}
        <BarraDeNavegacao
          abaAtiva={abaAtiva}
          aoTocarAba={setAbaAtiva}
        />

      </View>
    </SafeAreaView>
  );
}
