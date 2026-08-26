import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

import { SearchIcon, EditIcon } from "./tab-icons";
import DeleteProductButton from "./delete-product-button";
import { useAppTheme } from "@/theme/theme-context";

const DARK_C = {
  bg: "#0a0a0a",
  surface: "#151515",
  surfaceCard: "#1a1a1a",
  border: "#222222",
  accent: "#ff4655",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted: "#666666",
  badgeBg: "#052e16",
  badgeText: "#22c55e",
  badgeBorder: "#14532d",
  btnBg: "#ff4655",
  refreshBg: "#1e1e1e",
  vpBlue: "#4fc3f7",
  imageFrameBg: "#0c0507",
  imageFrameBorder: "#1e0b0e",
  chipBg: "#1e1e1e",
};

const LIGHT_C = {
  bg: "#f2f2f5",
  surface: "#ffffff",
  surfaceCard: "#f5f5f7",
  border: "#e2e2e6",
  accent: "#ff4655",
  textPrimary: "#111111",
  textSecondary: "#5c5c66",
  textMuted: "#8a8a94",
  badgeBg: "#dcfce7",
  badgeText: "#15803d",
  badgeBorder: "#86efac",
  btnBg: "#ff4655",
  refreshBg: "#eef0f3",
  vpBlue: "#0284c7",
  imageFrameBg: "#f4f0ef",
  imageFrameBorder: "#eadfdd",
  chipBg: "#eef0f3",
};

type Palette = typeof DARK_C;

interface ProductsScreenProps {
  skins: any[];
  loading: boolean;
  error: string | null;
  userRole?: string;
  onRefresh: () => Promise<void> | void;
  onGoToAdd: () => void;
  onEditProduct: (product: any) => void;
  onDeleteProduct: (id: string | number) => Promise<void> | void;
}

export default function ProductsScreen({
  skins,
  loading,
  error,
  userRole = "admin",
  onRefresh,
  onGoToAdd,
  onEditProduct,
  onDeleteProduct
}: ProductsScreenProps) {
  const { mode } = useAppTheme();
  const C = mode === "dark" ? DARK_C : LIGHT_C;
  const styles = mode === "dark" ? stylesByMode.dark : stylesByMode.light;

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const isAdmin = userRole === "admin";

  // Responsive Grid Calculation
  // Desktop >= 1024px: 3 columns (32.2%)
  // Tablet >= 640px: 2 columns (48.8%)
  // Mobile < 640px: 1 column (100%)
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const cardWidth = isDesktop ? "32.2%" : isTablet ? "48.8%" : "100%";

  const handleRefreshClick = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  // Filter products by search query
  const filteredSkins = skins.filter((skin) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const name = (skin.name || skin.title || "").toLowerCase();
    const type = (skin.type || skin.category_name || skin.category || "").toLowerCase();
    const brand = (skin.brand || "").toLowerCase();
    return name.includes(query) || type.includes(query) || brand.includes(query);
  });

  return (
    <View style={styles.container}>
      <View style={styles.centeredWrapper}>
        {/* ── Sub Header / Title ── */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Products</Text>
          <Text style={styles.headerCount}>({filteredSkins.length} items)</Text>
        </View>

        {/* ── Top Action Bar (Search + Add + Refresh) ── */}
        <View style={styles.actionsBar}>
          {/* Search Bar */}
          <View style={styles.searchBox}>
            <View style={styles.searchIcon}>
              <SearchIcon size={16} color={C.textMuted} />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products or price..."
              placeholderTextColor={C.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text style={styles.clearSearch}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* + Add Button (Admin Only) */}
          {isAdmin && (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={onGoToAdd}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Add</Text>
            </TouchableOpacity>
          )}

          {/* Refresh Button */}
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={handleRefreshClick}
            disabled={refreshing}
            activeOpacity={0.7}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={C.accent} />
            ) : (
              <Text style={styles.refreshBtnText}>Refresh</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Product Cards Grid ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color={C.accent} />
              <Text style={styles.statusText}>Loading product inventory...</Text>
            </View>
          ) : error ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : filteredSkins.length === 0 ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>
                {searchQuery ? `No products found matching "${searchQuery}"` : "No products available"}
              </Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {filteredSkins.map((skin, index) => (
                <ProductCard
                  key={skin.id || skin._id || index}
                  skin={skin}
                  cardWidth={cardWidth}
                  isAdmin={isAdmin}
                  C={C}
                  styles={styles}
                  onEdit={() => onEditProduct(skin)}
                  onDelete={() => onDeleteProduct(skin.id || skin._id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// Extracted component to handle local image error state
const ProductCard = ({
  skin,
  cardWidth,
  isAdmin = true,
  C,
  styles,
  onEdit,
  onDelete
}: {
  skin: any,
  cardWidth: number | string,
  isAdmin?: boolean,
  C: Palette,
  styles: ReturnType<typeof buildStyles>,
  onEdit: () => void,
  onDelete: () => Promise<void> | void
}) => {
  const [imgError, setImgError] = useState(false);
  const imgUri = skin._image_url || skin.image_url || skin.image;
  const name = skin.name || skin.title || "Unknown Skin";
  const category = skin.category_name || skin.type || skin.category || "Vandal";
  const stock = skin.stock ?? 12;
  const brand = skin.brand || "Riot Games";
  const badge = skin.badge || skin.badge_status || "Active";
  const vpPrice = skin.vp ?? skin.vp_price ?? 2175;
  const thbPrice = skin.price ?? skin.price_thb ?? 625;

  return (
    <View style={[styles.productCard, { width: cardWidth as any }]}>
      {/* 1. Large Banner Image Box */}
      <View style={styles.largeImageArea}>
        {imgUri && !imgError ? (
          <Image
            source={{ uri: imgUri }}
            style={styles.productImg}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.noImgBox}>
            <Text style={styles.noImgText}>No Image</Text>
          </View>
        )}

        {/* Status Overlay Badge at Top-Right */}
        <View style={styles.badgeOverlay}>
          <Text style={styles.badgeOverlayText}>{badge}</Text>
        </View>
      </View>

      {/* 2. Middle Tags Row */}
      <View style={styles.infoTagsRow}>
        <View style={styles.tagChip}>
          <Text style={styles.tagChipText}>{category}</Text>
        </View>
        <View style={[styles.tagChip, styles.stockChip]}>
          <Text style={styles.stockChipText}>{stock} in stock</Text>
        </View>
        {brand ? (
          <View style={styles.tagChip}>
            <Text style={styles.tagChipText}>{brand}</Text>
          </View>
        ) : null}
      </View>

      {/* 3. Bottom Row: Name on Left, VP & Price (THB) on Right */}
      <View style={styles.bottomRow}>
        {/* Left Side: Product Name */}
        <View style={styles.nameBoxLeft}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {name}
          </Text>
        </View>

        {/* Right Side: VP Points & THB Price */}
        <View style={styles.priceBoxRight}>
          {isAdmin && (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.editBtnInline}
                onPress={onEdit}
                activeOpacity={0.8}
              >
                <EditIcon color={C.textPrimary} size={12} />
                <Text style={styles.editBtnInlineText}>Edit</Text>
              </TouchableOpacity>
              <DeleteProductButton onDelete={onDelete} />
            </View>
          )}
          <Text style={styles.thbTextLarge}>
            ฿{thbPrice ? thbPrice.toLocaleString() : "625"}
          </Text>
          <Text style={styles.vpTextSmall}>
            {vpPrice ? vpPrice.toLocaleString() : "2,175"}{" "}
            <Text style={styles.vpUnitText}>VP</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const buildStyles = (C: Palette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  } as ViewStyle,
  centeredWrapper: {
    flex: 1,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  } as ViewStyle,

  // Header Row
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 8,
  } as ViewStyle,
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.3,
  } as TextStyle,
  headerCount: {
    fontSize: 12,
    color: C.textSecondary,
  } as TextStyle,

  // Action Bar (Search, Add, Refresh)
  actionsBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
    alignItems: "center",
  } as ViewStyle,
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
  } as ViewStyle,
  searchIcon: {
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  searchInput: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 13,
    padding: 0,
  } as TextStyle,
  clearSearch: {
    color: C.textMuted,
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 4,
  } as TextStyle,

  addBtn: {
    backgroundColor: C.btnBg,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  addBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  } as TextStyle,

  refreshBtn: {
    backgroundColor: C.refreshBg,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  refreshBtnText: {
    color: C.textSecondary,
    fontWeight: "600",
    fontSize: 12,
  } as TextStyle,

  // Scroll Content
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 85,
  } as ViewStyle,

  // Responsive Grid Container
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    width: "100%",
  } as ViewStyle,

  // Status / Loading / Empty State
  statusBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    width: "100%",
    gap: 10,
  } as ViewStyle,
  statusText: {
    color: C.textSecondary,
    fontSize: 14,
  } as TextStyle,
  errorText: {
    color: C.accent,
    fontSize: 14,
    textAlign: "center",
  } as TextStyle,
  retryBtn: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
  } as ViewStyle,
  retryText: {
    color: C.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  } as TextStyle,

  // Product Card - Big Image Banner Layout
  productCard: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    gap: 10,
  } as ViewStyle,

  // Large Image Banner
  largeImageArea: {
    width: "100%",
    height: 165,
    backgroundColor: C.imageFrameBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.imageFrameBorder,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  } as ViewStyle,
  productImg: {
    width: "92%",
    height: "92%",
  } as ImageStyle,
  noImgBox: {
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  noImgText: {
    color: C.accent,
    fontSize: 12,
    fontWeight: "700",
  } as TextStyle,

  badgeOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: C.badgeBg,
    borderColor: C.badgeBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  } as ViewStyle,
  actionButtonsRow: {
    flexDirection: "row",
    gap: 4,
  } as ViewStyle,
  editBtnInline: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(128, 128, 128, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.textPrimary,
    marginBottom: 4,
    gap: 4,
  } as ViewStyle,
  editBtnInlineText: {
    color: C.textPrimary,
    fontSize: 10,
    fontWeight: "700",
  } as TextStyle,
  badgeOverlayText: {
    color: C.badgeText,
    fontSize: 10,
    fontWeight: "700",
  } as TextStyle,

  // Middle Tags Row
  infoTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  } as ViewStyle,
  tagChip: {
    backgroundColor: C.chipBg,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  } as ViewStyle,
  tagChipText: {
    fontSize: 10,
    color: C.textSecondary,
    fontWeight: "600",
  } as TextStyle,
  stockChip: {
    backgroundColor: "#2a0a0e",
  } as ViewStyle,
  stockChipText: {
    fontSize: 10,
    color: "#ff6b77",
    fontWeight: "600",
  } as TextStyle,

  // Bottom Row: Name (Left) + Prices (Right)
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 4,
  } as ViewStyle,

  // Name on Left
  nameBoxLeft: {
    flex: 1,
    marginRight: 12,
  } as ViewStyle,
  productTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 22,
  } as TextStyle,

  // Price Box on Right (VP & THB)
  priceBoxRight: {
    alignItems: "flex-end",
    gap: 2,
  } as ViewStyle,
  vpTextSmall: {
    fontSize: 13,
    fontWeight: "700",
    color: C.accent,
  } as TextStyle,
  vpUnitText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.textSecondary,
  } as TextStyle,
  thbTextLarge: {
    fontSize: 18,
    fontWeight: "900",
    color: C.vpBlue,
    letterSpacing: 0.5,
  } as TextStyle,
});

const stylesByMode = { dark: buildStyles(DARK_C), light: buildStyles(LIGHT_C) };
