import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    useWindowDimensions,
    TouchableOpacity
} from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-gifted-charts";
import ThemedScreen from "../components/ThemedScreen";
import { COLORS, SHADOW } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { financeApi } from "../services/financeApi";

const Y_AXIS_WIDTH = 42;

const PIE_COLORS = [
    "#6C47FF", "#A78BFA", "#818CF8", "#38BDF8", "#34D399",
    "#FBBF24", "#F87171", "#C084FC", "#2DD4BF", "#FB923C",
];

let cachedInsights = null;

const formatYAxis = (value) => {
    if (value >= 1000) return `R$${(value / 1000).toFixed(1)}k`;
    return `R$${value}`;
};

const MONTH_LABELS = [
    "jan.",
    "fev.",
    "mar.",
    "abr.",
    "mai.",
    "jun.",
    "jul.",
    "ago.",
    "set.",
    "out.",
    "nov.",
    "dez.",
];

const formatMonthLabel = (year, month) => {
    const monthIndex = Number(month) - 1;
    const monthLabel = MONTH_LABELS[monthIndex] || String(month).padStart(2, "0") + ".";
    return `${monthLabel}${String(year).slice(-2)}`;
};

export default function DashboardScreen() {
    const { loading: authLoading } = useRequireAuth();
    const { token, userId } = useAuth();
    const { width } = useWindowDimensions();
    const SCREEN_WIDTH = width - 72 - Y_AXIS_WIDTH;

    const [expensesByCategory, setExpensesByCategory] = useState([]);
    const [balancePerMonth, setBalancePerMonth] = useState([]);
    const [loadingDashboard, setLoadingDashboard] = useState(true);
    const [insights, setInsights] = useState([]);
    const [loadingInsights, setLoadingInsights] = useState(!cachedInsights);

    useEffect(() => {
        if (!token || !userId) return;
        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoadingDashboard(true);
                const [categoryData, balanceData] = await Promise.all([
                    financeApi.getExpensesByCategory(token, userId),
                    financeApi.getBalancePerMonth(token, userId),
                ]);
                if (!cancelled) {
                    setExpensesByCategory(Array.isArray(categoryData) ? categoryData : []);
                    setBalancePerMonth(Array.isArray(balanceData) ? balanceData : []);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
                if (!cancelled) {
                    setExpensesByCategory([]);
                    setBalancePerMonth([]);
                }
            } finally {
                if (!cancelled) setLoadingDashboard(false);
            }
        };

        fetchData();
        return () => { cancelled = true; };
    }, [token, userId]);

    useEffect(() => {
        if (!token || cachedInsights) {
            setInsights(cachedInsights ?? []);
            return;
        }
        let cancelled = false;

        const fetchInsights = async () => {
            try {
                const data = await financeApi.getHistoricalInsights(token);
                if (!cancelled) {
                    cachedInsights = Array.isArray(data) ? data : [];
                    setInsights(cachedInsights);
                }
            } catch (error) {
                console.error("Erro ao buscar insights:", error);
                if (!cancelled) setInsights([]);
            } finally {
                if (!cancelled) setLoadingInsights(false);
            }
        };

        fetchInsights();
        return () => { cancelled = true; };
    }, [token]);

    const handleGenerateNewInsights = async () => {
        if (!token) return;
        try {
            setLoadingInsights(true);
            const data = await financeApi.getHistoricalInsights(token);
            cachedInsights = Array.isArray(data) ? data : [];
            setInsights(cachedInsights);
        } catch (error) {
            console.error("Erro ao gerar novos insights:", error);
        } finally {
            setLoadingInsights(false);
        }
    };

    const totalExpenses = useMemo(
        () => expensesByCategory.reduce((sum, i) => sum + i.totalAmount, 0),
        [expensesByCategory]
    );

    const pieData = useMemo(() =>
        (expensesByCategory ?? []).map((item, index) => ({
            value: item.totalAmount,
            color: PIE_COLORS[index % PIE_COLORS.length],
            label: item.category,
        })),
        [expensesByCategory]
    );

    const hasBalanceData = useMemo(() =>
        balancePerMonth.some((item) => item.income > 0 || item.expense > 0),
        [balancePerMonth]
    );

    const barData = useMemo(() =>
        balancePerMonth.flatMap((item) => [
            {
                value: item.income,
                frontColor: "#34D399",
                spacing: 4,
                labelComponent: () => (
                    <Text style={{
                        color: "#1E293B",
                        fontSize: 11,
                        width: 44,
                        fontWeight: "500",
                        textAlign: "center",
                        marginLeft: -8,
                        marginTop: 4,
                    }}>
                        {formatMonthLabel(item.year, item.month)}
                    </Text>
                ),
            },
            {
                value: item.expense,
                frontColor: "#FB923C",
                spacing: 16,
            },
        ]),
        [balancePerMonth]
    );

    const lineData = useMemo(() =>
        balancePerMonth.map((item) => ({
            value: item.income - item.expense,
            label: formatMonthLabel(item.year, item.month),
            dataPointColor: "#6C47FF",
        })),
        [balancePerMonth]
    );

    if (authLoading) return null;

    return (
        <ThemedScreen contentContainerStyle={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
                Aqui você encontra uma visão geral dos seus principais indicadores.
            </Text>

            {/* Gráfico de Pizza */}
            <View style={styles.cardLarge}>
                <Text style={styles.cardTitle}>Gastos por Categoria</Text>
                <Text style={styles.cardSubtitle}>
                    Mostra como suas despesas estão distribuídas entre as categorias mais significativas.
                </Text>
                {loadingDashboard ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.purple} />
                        <Text style={styles.loadingText}>Carregando dados...</Text>
                    </View>
                ) : pieData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma despesa registrada por categoria.</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.pieWrapper}>
                            <PieChart
                                data={pieData}
                                radius={90}
                                innerRadius={50}
                                centerLabelComponent={() => (
                                    <Text style={styles.pieCenter}>Gastos</Text>
                                )}
                            />
                        </View>
                        <View style={styles.legendContainer}>
                            {[...pieData]
                                .sort((a, b) => b.value - a.value)
                                .map((item, index) => (
                                    <View key={item.label} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendText} numberOfLines={2}>
                                            {item.label} ({((item.value / totalExpenses) * 100).toFixed(0)}%)
                                        </Text>
                                    </View>
                                ))}
                        </View>
                    </>
                )}
            </View>

            {/* Gráfico de Barras */}
            <View style={styles.cardLarge}>
                <Text style={styles.cardTitle}>Receitas x Despesas</Text>
                <Text style={styles.cardSubtitle}>
                    Compara seus ganhos e gastos mês a mês para ajudar a identificar tendências.
                </Text>
                {loadingDashboard ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.purple} />
                        <Text style={styles.loadingText}>Carregando...</Text>
                    </View>
                ) : !hasBalanceData ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Sem movimentações nos últimos 6 meses.</Text>
                    </View>
                ) : (
                    <>
                        <BarChart
                            data={barData}
                            barWidth={18}
                            roundedTop
                            hideRules
                            xAxisThickness={1}
                            yAxisThickness={0}
                            xAxisColor={COLORS.purple + "30"}
                            yAxisTextStyle={{ color: COLORS.navy, fontSize: 9, paddingRight: 4, fontWeight: "500", }}
                            formatYLabel={formatYAxis}
                            yAxisLabelWidth={Y_AXIS_WIDTH}
                            noOfSections={4}
                            width={SCREEN_WIDTH}
                            spacing={7}
                            isAnimated
                        />
                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: "#34D399" }]} />
                                <Text style={styles.legendText}>Receita</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: "#FB923C" }]} />
                                <Text style={styles.legendText}>Despesa</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Gráfico de Linha */}
            <View style={styles.cardLarge}>
                <Text style={styles.cardTitle}>Saldo Mensal</Text>
                <Text style={styles.cardSubtitle}>
                    Mostra a evolução do seu saldo após receitas e despesas ao longo dos meses.
                </Text>
                {loadingDashboard ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.purple} />
                        <Text style={styles.loadingText}>Carregando...</Text>
                    </View>
                ) : !hasBalanceData ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Sem movimentações nos últimos 6 meses.</Text>
                    </View>
                ) : (
                    <>
                        <LineChart
                            data={lineData}
                            width={SCREEN_WIDTH}
                            hideRules
                            xAxisThickness={1}
                            yAxisThickness={0}
                            xAxisColor={COLORS.purple + "30"}
                            yAxisTextStyle={{ color: COLORS.navy, fontSize: 9, paddingRight: 4, fontWeight: "500" }}
                            xAxisLabelTextStyle={{
                                color: COLORS.navy,
                                fontSize: 11,
                                fontWeight: "500",
                                width: 64,
                                textAlign: "center",
                            }}
                            formatYLabel={formatYAxis}
                            yAxisLabelWidth={Y_AXIS_WIDTH}
                            noOfSections={4}
                            color="#6C47FF"
                            thickness={2}
                            dataPointsColor="#6C47FF"
                            dataPointsRadius={4}
                            curved
                            isAnimated
                            areaChart
                            startFillColor="#6C47FF"
                            startOpacity={0.15}
                            endOpacity={0.01}
                        />
                        <View style={styles.legendContainer}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: "#6C47FF" }]} />
                                <Text style={styles.legendText}>Saldo (Receita - Despesa)</Text>
                            </View>
                        </View>
                    </>
                )}
            </View>

            {/* Insights de IA */}
            <Text style={styles.sectionTitle}>Insights de IA</Text>
            <Text style={styles.cardSubtitle}>
                Dicas e conselhos gerados a partir de dados históricos e tendências gerais, para ajudar você a planejar melhor suas finanças.
            </Text>
            {loadingInsights ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.purple} />
                    <Text style={styles.loadingText}>Gerando insights...</Text>
                </View>
            ) : insights.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum insight disponível no momento.</Text>
                </View>
            ) : (
                <>
                    {insights.map((insight, index) => (
                        <View key={index} style={styles.insightCard}>
                            <Text style={styles.insightTitle}>{insight.title}</Text>
                            <Text style={styles.insightContent}>{insight.description}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.generateButton} onPress={handleGenerateNewInsights}>
                        <Text style={styles.generateButtonText}>Gerar novos insights</Text>
                    </TouchableOpacity>
                </>
            )}
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingHorizontal: 18,
        paddingBottom: 140,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: COLORS.navy,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.navy,
        opacity: 0.8,
        marginBottom: 22,
    },
    cardLarge: {
        width: "100%",
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.purple,
        padding: 18,
        marginBottom: 16,
        ...SHADOW,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.navy,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 13,
        color: COLORS.indigo,
        opacity: 0.8,
        lineHeight: 20,
        marginBottom: 12,
    },
    pieWrapper: {
        alignItems: "center",
        marginBottom: 16,
    },
    pieCenter: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.navy,
        textAlign: "center",
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        paddingVertical: 40,
    },
    loadingText: {
        color: COLORS.indigo,
        fontSize: 13,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyText: {
        color: COLORS.indigo,
        opacity: 0.7,
        fontSize: 13,
        textAlign: "center",
        lineHeight: 20,
    },
    legendContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 14,
        paddingHorizontal: 2,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        width: "48%",
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 3,
    },
    legendText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.navy,
        lineHeight: 17,
        flexShrink: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.navy,
        marginTop: 4,
        marginBottom: 12,
    },
    insightCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.purple,
        padding: 16,
        marginBottom: 12,
        ...SHADOW,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.navy,
        marginBottom: 8,
    },
    insightContent: {
        color: COLORS.indigo,
        opacity: 0.85,
        lineHeight: 20,
    },
    generateButton: {
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.purple,
        marginBottom: 12,
    },
    generateButtonText: {
        color: COLORS.purple,
        fontWeight: "700",
        fontSize: 14,
    },
});