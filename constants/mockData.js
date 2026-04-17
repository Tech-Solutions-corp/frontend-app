// constants/mockData.js

export const DATAS = [
  { dia: 23, diaSemana: 'Sexta',   mes: 'Maio' },
  { dia: 24, diaSemana: 'Sábado',  mes: 'Maio' },
  { dia: 25, diaSemana: 'Domingo', mes: 'Maio' },
  { dia: 26, diaSemana: 'Segunda', mes: 'Maio' },
  { dia: 27, diaSemana: 'Terça',   mes: 'Maio' },
  { dia: 28, diaSemana: 'Quarta',   mes: 'Maio' },
  { dia: 29, diaSemana: 'Quinta',   mes: 'Maio' },
];

export const INDICE_DIA_SELECIONADO = 2;

export const CATEGORIAS = ['All', 'Lazer', 'Transporte', 'Alimentação', 'Saúde', 'Educação'];

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
  id: '1',
  nome: "Livia Vaccaro",
  email: "livia@email.com",
  avatar: "https://i.pravatar.cc/150?img=47",
  limitePercent: 85,
  telefone: '+55 11 98765-4321',
  endereco: 'São Paulo, SP',
};

export const CATEGORIAS_GASTOS = [
  { id: '1', nome: 'Alimentação', qtd: 23, percent: 70, icone: '🍕', cor: '#FF6B8A' },
  { id: '2', nome: 'Lazer',       qtd: 30, percent: 52, icone: '🎮', cor: '#A78BFA' },
  { id: '3', nome: 'Educação',   qtd: 30, percent: 87, icone: '📖', cor: '#F97316' },
  { id: '4', nome: 'Transporte',  qtd: 3,  percent: 87, icone: '🚗', cor: '#FBBF24' },
  { id: '5', nome: 'Saúde',       qtd: 8,  percent: 45, icone: '🏥', cor: '#FF6B9D' },
  { id: '6', nome: 'Utilities',   qtd: 4,  percent: 92, icone: '⚡', cor: '#34D399' },
];

// Contas do usuário
export const CONTAS = [
  {
    id: '1',
    nome: 'Carteira',
    tipo: 'WALLET',
    saldo: 1250.50,
    icone: '👛',
    cor: '#6C47FF',
    ativa: true,
  },
  {
    id: '2',
    nome: 'Banco Nubank',
    tipo: 'BANK',
    saldo: 5430.75,
    icone: '🏦',
    cor: '#9B59B6',
    ativa: true,
  },
  {
    id: '3',
    nome: 'Poupança Itaú',
    tipo: 'SAVINGS',
    saldo: 15000.00,
    icone: '💰',
    cor: '#3498DB',
    ativa: true,
  },
  {
    id: '4',
    nome: 'Crédito Bradesco',
    tipo: 'CREDIT_CARD',
    saldo: -2150.30,
    limite: 5000,
    icone: '💳',
    cor: '#E74C3C',
    ativa: true,
  },
];

// Transações detalhadas
export const TRANSACOES = [
  {
    id: '1',
    descricao: 'Supermercado Pão de Açúcar',
    valor: 187.50,
    tipo: 'EXPENSE',
    categoria: 'Alimentação',
    data: '2024-05-25',
    hora: '15:30',
    conta: 'Carteira',
    icone: '🛒',
  },
  {
    id: '2',
    descricao: 'Salário',
    valor: 4500.00,
    tipo: 'INCOME',
    categoria: 'Rendimentos',
    data: '2024-05-20',
    hora: '08:00',
    conta: 'Banco Nubank',
    icone: '💵',
  },
  {
    id: '3',
    descricao: 'Uber Eats',
    valor: 45.90,
    tipo: 'EXPENSE',
    categoria: 'Alimentação',
    data: '2024-05-24',
    hora: '19:45',
    conta: 'Carteira',
    icone: '🍕',
  },
  {
    id: '4',
    descricao: 'Netflix',
    valor: 45.90,
    tipo: 'EXPENSE',
    categoria: 'Lazer',
    data: '2024-05-22',
    hora: '10:15',
    conta: 'Crédito Bradesco',
    icone: '🎬',
  },
  {
    id: '5',
    descricao: 'Academia Virtual',
    valor: 79.90,
    tipo: 'EXPENSE',
    categoria: 'Saúde',
    data: '2024-05-21',
    hora: '09:00',
    conta: 'Banco Nubank',
    icone: '🏋️',
  },
  {
    id: '6',
    descricao: 'Uber',
    valor: 28.50,
    tipo: 'EXPENSE',
    categoria: 'Transporte',
    data: '2024-05-23',
    hora: '07:20',
    conta: 'Carteira',
    icone: '🚗',
  },
];

// Categorias de transação
export const CATEGORIAS_SISTEMA = [
  { id: '1', nome: 'Alimentação', tipo: 'EXPENSE', icone: '🍕', cor: '#FF6B8A' },
  { id: '2', nome: 'Transporte', tipo: 'EXPENSE', icone: '🚗', cor: '#FBBF24' },
  { id: '3', nome: 'Saúde', tipo: 'EXPENSE', icone: '🏥', cor: '#FF6B9D' },
  { id: '4', nome: 'Educação', tipo: 'EXPENSE', icone: '📖', cor: '#F97316' },
  { id: '5', nome: 'Lazer', tipo: 'EXPENSE', icone: '🎮', cor: '#A78BFA' },
  { id: '6', nome: 'Utilities', tipo: 'EXPENSE', icone: '⚡', cor: '#34D399' },
  { id: '7', nome: 'Salário', tipo: 'INCOME', icone: '💵', cor: '#10B981' },
  { id: '8', nome: 'Freelance', tipo: 'INCOME', icone: '💼', cor: '#059669' },
  { id: '9', nome: 'Investimentos', tipo: 'INCOME', icone: '📈', cor: '#0D9488' },
];

// Importações
export const IMPORTACOES = [
  {
    id: '1',
    arquivo: 'extrato_maio_2024.csv',
    dataImport: '2024-05-28',
    transacoes: 45,
    status: 'Concluído',
    conta: 'Banco Nubank',
  },
  {
    id: '2',
    arquivo: 'extrato_abril_2024.csv',
    dataImport: '2024-04-30',
    transacoes: 52,
    status: 'Concluído',
    conta: 'Banco Nubank',
  },
];

// Insights de IA
export const INSIGHTS = [
  {
    id: '1',
    tipo: 'economia',
    titulo: 'Oportunidade de Economia',
    descricao: 'Seus gastos com alimentação eram 23% maiores no mês passado',
    icone: '💡',
    cor: '#F59E0B',
  },
  {
    id: '2',
    tipo: 'padrão',
    titulo: 'Padrão Detectado',
    descricao: 'Você gasta em média R$85 por semana em transporte',
    icone: '📊',
    cor: '#3B82F6',
  },
  {
    id: '3',
    tipo: 'alerta',
    titulo: 'Alerta de Gasto',
    descricao: 'Seus gastos com lazer ultrapassaram 40% do orçamento',
    icone: '⚠️',
    cor: '#EF4444',
  },
  {
    id: '4',
    tipo: 'meta',
    titulo: 'Meta de Economia',
    descricao: 'Você economizou R$520 este mês! Continue assim!',
    icone: '🎯',
    cor: '#10B981',
  },
];