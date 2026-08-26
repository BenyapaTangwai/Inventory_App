import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppTheme } from "@/theme/theme-context";

const DARK_C = {
  bg: "#0a0a0a",
  surface: "#141414",
  surfaceCard: "#181818",
  revenueCardBg: "#131316",
  border: "#242424",
  borderHighlight: "rgba(168, 85, 247, 0.35)",
  purple: "#a855f7",
  purpleLight: "#c084fc",
  purpleBg: "rgba(168, 85, 247, 0.12)",
  purpleBadgeBg: "#2e1065",
  textPrimary: "#ffffff",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  success: "#22c55e",
  successBg: "rgba(34, 197, 94, 0.15)",
  baseline: "#3f3f46",
};

const LIGHT_C = {
  bg: "#f2f2f5",
  surface: "#ffffff",
  surfaceCard: "#f9f7fc",
  revenueCardBg: "#fbfaff",
  border: "#e5e0ec",
  borderHighlight: "rgba(124, 58, 237, 0.30)",
  purple: "#a855f7",
  purpleLight: "#7c3aed",
  purpleBg: "rgba(168, 85, 247, 0.10)",
  purpleBadgeBg: "#f3e8ff",
  textPrimary: "#111111",
  textSecondary: "#5c5c66",
  textMuted: "#8a8a94",
  success: "#16a34a",
  successBg: "rgba(22, 163, 74, 0.12)",
  baseline: "#d8d5e0",
};

type Palette = typeof DARK_C;

const CATEGORY_COLORS = {
  vandal: "#c084fc",
  phantom: "#a855f7",
  melee: "#eab308",
  operator: "#6d28d9",
  sheriff: "#52796f",
};

interface FinancesScreenProps {
  onBack?: () => void;
  currency?: "THB" | "USD";
}

export default function FinancesScreen({ onBack, currency = "USD" }: FinancesScreenProps) {
  const { mode } = useAppTheme();
  const C = mode === "dark" ? DARK_C : LIGHT_C;
  const styles = mode === "dark" ? stylesByMode.dark : stylesByMode.light;

  const [selectedRangeIndex, setSelectedRangeIndex] = useState(0);
  const [showRangePicker, setShowRangePicker] = useState(false);

  const dateRanges = [
    "February 2025 - March 2025",
    "January 2025 - February 2025",
    "Last 30 Days",
    "Q1 2025",
    "All Time (2025)",
  ];

  const netSalesBars = [
    { height: "28%", opacity: 0.35 },
    { height: "52%", opacity: 0.8 },
    { height: "44%", opacity: 0.6 },
    { height: "38%", opacity: 0.4 },
    { height: "40%", opacity: 0.4 },
    { height: "50%", opacity: 0.7 },
    { height: "36%", opacity: 0.35 },
    { height: "85%", opacity: 1 },
    { height: "78%", opacity: 0.95 },
    { height: "92%", opacity: 1 },
    { height: "64%", opacity: 0.85 },
    { height: "64%", opacity: 0.85 },
  ];

  const grossProfitBars = [
    { height: "24%", opacity: 0.35 },
    { height: "48%", opacity: 0.8 },
    { height: "40%", opacity: 0.6 },
    { height: "34%", opacity: 0.4 },
    { height: "36%", opacity: 0.4 },
    { height: "45%", opacity: 0.7 },
    { height: "32%", opacity: 0.35 },
    { height: "76%", opacity: 1 },
    { height: "70%", opacity: 0.95 },
    { height: "82%", opacity: 1 },
    { height: "58%", opacity: 0.85 },
    { height: "58%", opacity: 0.85 },
  ];


  const revenueStackedBars = [
    { vandal: "4%", phantom: "8%", melee: "6%", operator: "24%", sheriff: "0%" },
    { vandal: "5%", phantom: "10%", melee: "7%", operator: "28%", sheriff: "28%" },
    { vandal: "6%", phantom: "12%", melee: "7%", operator: "20%", sheriff: "18%" },
    { vandal: "5%", phantom: "10%", melee: "7%", operator: "22%", sheriff: "28%" },
    { vandal: "7%", phantom: "14%", melee: "8%", operator: "34%", sheriff: "28%" },
    { vandal: "5%", phantom: "12%", melee: "8%", operator: "18%", sheriff: "18%" },
    { vandal: "6%", phantom: "14%", melee: "8%", operator: "24%", sheriff: "28%" },
    { vandal: "5%", phantom: "10%", melee: "7%", operator: "18%", sheriff: "18%" },
    { vandal: "8%", phantom: "16%", melee: "9%", operator: "40%", sheriff: "18%" },
    { vandal: "6%", phantom: "12%", melee: "8%", operator: "24%", sheriff: "38%" },
    { vandal: "7%", phantom: "15%", melee: "9%", operator: "28%", sheriff: "30%" },
    { vandal: "7%", phantom: "14%", melee: "8%", operator: "30%", sheriff: "30%" },
  ];


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sub Header */}
      <View style={styles.subHeader}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleBox}>
          <Text style={styles.headerTitle}>Finances</Text>
          <Text style={styles.headerSub}>Revenue, profit, and sales analytics for Owen Shop</Text>
        </View>
      </View>

      {/* View Range Selector */}
      <View style={styles.viewRangeContainer}>
        <TouchableOpacity
          style={styles.viewRangeButton}
          onPress={() => setShowRangePicker(!showRangePicker)}
          activeOpacity={0.8}
        >
          <Text style={styles.viewRangeText}>View range</Text>
          <Text style={styles.viewRangeChevron}>{showRangePicker ? "▲" : "▼"}</Text>
        </TouchableOpacity>
        <Text style={styles.viewRangeLabel}>{dateRanges[selectedRangeIndex]}</Text>
      </View>

      {/* Range Dropdown */}
      {showRangePicker && (
        <View style={styles.rangeDropdown}>
          {dateRanges.map((range, idx) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeItem,
                selectedRangeIndex === idx && styles.rangeItemActive,
              ]}
              onPress={() => {
                setSelectedRangeIndex(idx);
                setShowRangePicker(false);
              }}
            >
              <Text
                style={[
                  styles.rangeItemText,
                  selectedRangeIndex === idx && styles.rangeItemTextActive,
                ]}
              >
                {range}
              </Text>
              {selectedRangeIndex === idx && (
                <Text style={styles.rangeCheckIcon}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Card 1: Net Sales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Net sales</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricAmount}>
            {currency === "THB" ? "฿148,250" : "$4,103"}
          </Text>
          <View style={styles.changeBadge}>
            <Text style={styles.changeBadgeText}>+2.12%</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartGrid}>
            <View style={styles.barsRow}>
              {netSalesBars.map((bar, i) => (
                <View key={i} style={styles.barColumn}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: bar.height as any,
                        backgroundColor: C.purple,
                        opacity: bar.opacity,
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.baseline} />
          </View>
        </View>
      </View>

      {/* Card 2: Gross Profit */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gross profit</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricAmount}>
            {currency === "THB" ? "฿132,450" : "$3,819"}
          </Text>
          <View style={styles.changeBadge}>
            <Text style={styles.changeBadgeText}>+1.40%</Text>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartGrid}>
            <View style={styles.barsRow}>
              {grossProfitBars.map((bar, i) => (
                <View key={i} style={styles.barColumn}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: bar.height as any,
                        backgroundColor: C.purple,
                        opacity: bar.opacity,
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.baseline} />
          </View>
        </View>
      </View>

      {/* Card 3: Margin */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Margin</Text>
        <View style={styles.emptyChartBox}>
          <Text style={styles.emptyChartText}>Not enough data</Text>
          <Text style={styles.emptyChartText}>to show the chart.</Text>
        </View>
      </View>

      {/* Card 4: Revenue (Stacked Bar Chart) */}
      <View style={[styles.card, styles.revenueCard]}>
        <Text style={styles.cardTitle}>Revenue</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartGrid}>
            <View style={styles.barsRow}>
              {revenueStackedBars.map((item, i) => (
                <View key={i} style={styles.stackedBarColumn}>
                  {item.sheriff !== "0%" && (
                    <View
                      style={[
                        styles.stackedSegment,
                        {
                          height: item.sheriff as any,
                          backgroundColor: CATEGORY_COLORS.sheriff,
                          borderTopLeftRadius: 4,
                          borderTopRightRadius: 4,
                        },
                      ]}
                    />
                  )}
                  {item.operator !== "0%" && (
                    <View
                      style={[
                        styles.stackedSegment,
                        {
                          height: item.operator as any,
                          backgroundColor: CATEGORY_COLORS.operator,
                          borderTopLeftRadius: item.sheriff === "0%" ? 4 : 0,
                          borderTopRightRadius: item.sheriff === "0%" ? 4 : 0,
                        },
                      ]}
                    />
                  )}
                  {item.phantom !== "0%" && (
                    <View
                      style={[
                        styles.stackedSegment,
                        {
                          height: item.phantom as any,
                          backgroundColor: CATEGORY_COLORS.phantom,
                        },
                      ]}
                    />
                  )}
                  {item.melee !== "0%" && (
                    <View
                      style={[
                        styles.stackedSegment,
                        {
                          height: item.melee as any,
                          backgroundColor: CATEGORY_COLORS.melee,
                        },
                      ]}
                    />
                  )}
                  {item.vandal !== "0%" && (
                    <View
                      style={[
                        styles.stackedSegment,
                        {
                          height: item.vandal as any,
                          backgroundColor: CATEGORY_COLORS.vandal,
                          borderBottomLeftRadius: 4,
                          borderBottomRightRadius: 4,
                        },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
            <View style={styles.baseline} />
          </View>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS.vandal }]} />
            <Text style={styles.legendText}>Vandal</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS.phantom }]} />
            <Text style={styles.legendText}>Phantom</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS.melee }]} />
            <Text style={styles.legendText}>Melee</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS.operator }]} />
            <Text style={styles.legendText}>Operator</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CATEGORY_COLORS.sheriff }]} />
            <Text style={styles.legendText}>Sheriff</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const buildStyles = (C: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 48,
    maxWidth: 680,
    alignSelf: "center",
    width: "100%",
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.surfaceCard,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    color: C.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  titleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 2,
  },
  viewRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
    flexWrap: "wrap",
  },
  viewRangeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.purpleBadgeBg,
    borderColor: C.borderHighlight,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  viewRangeText: {
    color: C.purpleLight,
    fontSize: 14,
    fontWeight: "600",
  },
  viewRangeChevron: {
    color: C.purpleLight,
    fontSize: 10,
  },
  viewRangeLabel: {
    color: C.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  rangeDropdown: {
    backgroundColor: C.surfaceCard,
    borderColor: C.purple,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    padding: 6,
  },
  rangeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  rangeItemActive: {
    backgroundColor: C.purpleBg,
  },
  rangeItemText: {
    color: C.textSecondary,
    fontSize: 13,
  },
  rangeItemTextActive: {
    color: C.purpleLight,
    fontWeight: "700",
  },
  rangeCheckIcon: {
    color: C.purpleLight,
    fontWeight: "900",
    fontSize: 14,
  },
  card: {
    backgroundColor: C.surface,
    borderColor: C.borderHighlight,
    borderWidth: 1.2,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
  },
  revenueCard: {
    backgroundColor: C.revenueCardBg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 8,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 16,
  },
  metricAmount: {
    fontSize: 26,
    fontWeight: "800",
    color: C.purpleLight,
    letterSpacing: 0.5,
  },
  changeBadge: {
    backgroundColor: C.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.success,
  },
  chartContainer: {
    height: 140,
    marginTop: 8,
    marginBottom: 8,
  },
  chartGrid: {
    flex: 1,
    justifyContent: "flex-end",
  },
  barsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  barColumn: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 3,
  },
  barFill: {
    width: "70%",
    borderRadius: 5,
    minHeight: 8,
  },
  baseline: {
    height: 1.5,
    backgroundColor: C.baseline,
    width: "100%",
    marginTop: 4,
  },
  stackedBarColumn: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 3,
  },
  stackedSegment: {
    width: "75%",
  },
  emptyChartBox: {
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyChartText: {
    fontSize: 14,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendText: {
    fontSize: 12,
    color: C.textSecondary,
    fontWeight: "500",
  },
});

const stylesByMode = { dark: buildStyles(DARK_C), light: buildStyles(LIGHT_C) };
