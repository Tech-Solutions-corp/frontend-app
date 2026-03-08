// constants/mockData.js

export const DATAS = [
  { dia: 23, diaSemana: 'Sexta',   mes: 'Maio' },
  { dia: 24, diaSemana: 'Sábado',  mes: 'Maio' },
  { dia: 25, diaSemana: 'Domingo', mes: 'Maio' },
  { dia: 26, diaSemana: 'Segunda', mes: 'Maio' },
  { dia: 27, diaSemana: 'Terça',   mes: 'Maio' },
];

export const INDICE_DIA_SELECIONADO = 2;

export const CATEGORIAS = ['All', 'Lazer', 'Transporte', 'Alimentação'];

export const GASTOS = [
  {
    id: '1',
    loja: 'Centauro',
    descricao: 'Tênis novo',
    horario: '10:00',
    valor: 'R$250,00',
    categoria: 'Lazer',
    icone: '👟',
    corIcone: '#FFE5E5',
  },
  {
    id: '2',
    loja: 'Valorant',
    descricao: 'Valorant Points',
    horario: '12:00',
    valor: 'R$250,00',
    categoria: 'Lazer',
    icone: '🎮',
    corIcone: '#E5E5FF',
  },
  {
    id: '3',
    loja: 'Uber',
    descricao: 'Uber para o trabalho',
    horario: '07:00',
    valor: 'R$18,30',
    categoria: 'Transporte',
    icone: '🚗',
    corIcone: '#E5E5FF',
  },
];

export const USUARIO = {
  nome: "Livia Vaccaro",
  avatar: "https://i.pravatar.cc/150?img=47",
  limitePercent: 85,
};

export const CATEGORIAS_GASTOS = [
  { id: '1', nome: 'Alimentação', qtd: 23, percent: 70, icone: '🛍️', cor: '#FF6B8A' },
  { id: '2', nome: 'Lazer',       qtd: 30, percent: 52, icone: '👤', cor: '#A78BFA' },
  { id: '3', nome: 'Faculdade',   qtd: 30, percent: 87, icone: '📖', cor: '#F97316' },
  { id: '4', nome: 'Transporte',  qtd: 3,  percent: 87, icone: '📖', cor: '#FBBF24' },
];