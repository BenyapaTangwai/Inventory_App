import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppTheme } from "@/theme/theme-context";
import {
  DeluxeIcon,
  ExclusiveIcon,
  PremiumIcon,
  StandardIcon,
  UltraIcon,
  VctIcon,
  CategoriesIcon,
} from "@/components/tab-icons";

const DARK_C = {
  bg: "#0a0a0c",
  surface: "#121215",
  surfaceCard: "#16161b",
  surfaceHover: "#1c1c24",
  border: "#24242e",
  borderLight: "#2e2e3a",
  accent: "#ff4655",
  textPrimary: "#ffffff",
  textSecondary: "#a0a0b0",
  textMuted: "#6e6e80",
  lastUpdate: "#5a5a6c",
};

const LIGHT_C = {
  bg: "#f2f2f5",
  surface: "#ffffff",
  surfaceCard: "#ffffff",
  surfaceHover: "#f6f6f9",
  border: "#e2e2e8",
  borderLight: "#d8d8e0",
  accent: "#ff4655",
  textPrimary: "#111111",
  textSecondary: "#555566",
  textMuted: "#888899",
  lastUpdate: "#9999aa",
};

type Palette = typeof DARK_C;

interface CategoryItem {
  id: string;
  name: string;
  itemCount: number;
  vpTier: string;
  description: string;
  iconBg: string;
  iconColor: string;
  icon: (color: string, size: number) => React.ReactNode;
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: "deluxe",
    name: "Deluxe",
    itemCount: 12,
    vpTier: "1,275 VP",
    description: "Custom models and subtle visual improvements",
    iconBg: "rgba(56, 189, 248, 0.14)",
    iconColor: "#38bdf8",
    icon: (color, size) => <DeluxeIcon color={color} size={size} />,
  },
  {
    id: "exclusive",
    name: "Exclusive",
    itemCount: 18,
    vpTier: "2,175 - 2,675 VP",
    description: "Top-tier skin lines with finishers, custom animations & sounds",
    iconBg: "rgba(255, 70, 85, 0.14)",
    iconColor: "#ff4655",
    icon: (color, size) => <ExclusiveIcon color={color} size={size} />,
  },
  {
    id: "premium",
    name: "Premium",
    itemCount: 24,
    vpTier: "1,775 VP",
    description: "Iconic designs with custom reload animations and VFX",
    iconBg: "rgba(236, 72, 153, 0.14)",
    iconColor: "#ec4899",
    icon: (color, size) => <PremiumIcon color={color} size={size} />,
  },
  {
    id: "standard",
    name: "Standard",
    itemCount: 15,
    vpTier: "875 VP",
    description: "Clean standard weapon skins and classic colorways",
    iconBg: "rgba(34, 197, 94, 0.14)",
    iconColor: "#22c55e",
    icon: (color, size) => <StandardIcon color={color} size={size} />,
  },
  {
    id: "ultra",
    name: "Ultra",
    itemCount: 6,
    vpTier: "2,475+ VP",
    description: "Legendary skins with reactive elements & transformative VFX",
    iconBg: "rgba(245, 158, 11, 0.14)",
    iconColor: "#f59e0b",
    icon: (color, size) => <UltraIcon color={color} size={size} />,
  },
  {
    id: "vct",
    name: "VCT",
    itemCount: 4,
    vpTier: "Champions Edition",
    description: "Exclusive esports commemorative collections & Lock//In knives",
    iconBg: "rgba(168, 85, 247, 0.14)",
    iconColor: "#a855f7",
    icon: (color, size) => <VctIcon color={color} size={size} />,
  },
];

interface CategoriesScreenProps {
  onBack?: () => void;
}

export default function CategoriesScreen({ onBack }: CategoriesScreenProps) {
  const { mode } = useAppTheme();
  const C = mode === "dark" ? DARK_C : LIGHT_C;
  const styles = getStyles(C);

  const totalItems = CATEGORIES_DATA.reduce((sum, cat) => sum + cat.itemCount, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Row ── */}
        <View style={styles.headerRow}>
          <View>
            <View style={styles.titleWithIcon}>
              <CategoriesIcon color={C.accent} size={24} />
              <Text style={styles.headerTitle}>Categories</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Valorant skin editions and tier classification
            </Text>
          </View>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{CATEGORIES_DATA.length} Tiers</Text>
          </View>
        </View>

        {/* ── Category Cards List (Matching Image 3 Reference) ── */}
        <View style={styles.categoryList}>
          {CATEGORIES_DATA.map((cat) => (
            <View key={cat.id} style={styles.categoryCard}>
              {/* Left Icon Square */}
              <View style={[styles.iconBox, { backgroundColor: cat.iconBg }]}>
                {cat.icon(cat.iconColor, 26)}
              </View>

              {/* Center Content: Name & Items Count */}
              <View style={styles.categoryCenter}>
                <Text style={styles.categoryName}>{cat.name}</Text>
                <Text style={styles.categoryCount}>{cat.itemCount} items</Text>
              </View>

              {/* Right Tag: Tier / VP */}
              <View style={[styles.vpBadge, { borderColor: cat.iconColor + "55" }]}>
                <Text style={[styles.vpBadgeText, { color: cat.iconColor }]}>
                  {cat.vpTier}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Footer Timestamp (Matching Image 3) ── */}
        <View style={styles.footerContainer}>
          <Text style={styles.lastUpdateText}>
            Last update August 27, 2026 at 00:20
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (C: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: C.bg,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    titleWithIcon: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: C.textPrimary,
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 13,
      color: C.textMuted,
      marginTop: 2,
    },
    badgeCount: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      backgroundColor: C.surfaceCard,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: C.border,
    },
    badgeCountText: {
      fontSize: 12,
      fontWeight: "700",
      color: C.accent,
    },
    categoryList: {
      gap: 12,
    },
    categoryCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: C.surfaceCard,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: C.border,
    },
    iconBox: {
      width: 54,
      height: 54,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    categoryCenter: {
      flex: 1,
      justifyContent: "center",
      gap: 3,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "700",
      color: C.textPrimary,
      letterSpacing: 0.3,
    },
    categoryCount: {
      fontSize: 13,
      color: C.textMuted,
      fontWeight: "500",
    },
    vpBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    vpBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.2,
    },
    footerContainer: {
      marginTop: 28,
      alignItems: "center",
      paddingVertical: 12,
    },
    lastUpdateText: {
      fontSize: 12,
      color: C.lastUpdate,
      fontWeight: "500",
    },
  });
