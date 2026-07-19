import { useState } from "react";
import {
  Image,
  ImageStyle,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const C = {
  bg: "#0a0a0a",
  surface: "#151515",
  border: "#222222",
  accent: "#ff4655",
  accentDim: "#cc2233",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted: "#666666",
  cardBg: "#1a1a1a",
  tagBg: "#2a0a0e",
  tagText: "#ff6b77",
  vpBg: "#0d1a2a",
  vpText: "#4fc3f7",
  navBg: "#111111",
  navActive: "#ff4655",
  navInactive: "#666666",
};

const SKINS = require('../../products.json') as Array<any>;

const VPIcon = () => (
  <View style={vpStyles.diamond}>
    <Text style={vpStyles.text}>VP</Text>
  </View>
);

const vpStyles = StyleSheet.create({
  diamond: {
    width: 18,
    height: 18,
    backgroundColor: "#4fc3f7",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "45deg" }],
  } as ViewStyle,
  text: {
    fontSize: 6,
    fontWeight: "700",
    color: "#0a1a2a",
    transform: [{ rotate: "-45deg" }],
  } as TextStyle,
});

const SkinCard = ({ skin }: { skin: any }) => (
  <View style={card.wrapper}>
    {/* Product Image */}
    <View style={[card.imageBox, { backgroundColor: C.tagBg }]}>
      <Image source={{ uri: skin.image_url }} style={card.image} resizeMode="contain" />
    </View>

    {/* Info */}
    <View style={card.info}>
      <Text style={card.name} numberOfLines={1}>
        {skin.name}
      </Text>
      <View style={[card.typePill, { backgroundColor: C.tagBg }]}>
        <Text style={[card.typeText, { color: C.tagText }]}>
          {skin.category || skin.badge_status}
        </Text>
      </View>

      {/* Stock / Location row */}
      <View style={card.vpRow}>
        <Text style={card.vpText}>{skin.stock_text || `${skin.stock ?? 0} in stock`}</Text>
        <Text style={[card.vpText, { marginLeft: 8, fontSize: 11, color: C.textSecondary }]}>
          {skin.location_text || ''}
        </Text>
      </View>
    </View>

    {/* Action / Badge */}
    <View style={card.priceBox}>
      <Text style={[card.price, { fontSize: 12, color: C.textSecondary }]}>{skin.badge_status || ''}</Text>
      <TouchableOpacity style={card.buyBtn} activeOpacity={0.75}>
        <Text style={card.buyText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const card = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    marginBottom: 12,
  } as ViewStyle,
  imageBox: {
    width: 100,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  } as ViewStyle,
  image: {
    width: "100%",
    height: "100%",
  } as ImageStyle,
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    justifyContent: "center",
  } as ViewStyle,
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
  } as TextStyle,
  typePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  } as ViewStyle,
  typeText: {
    fontSize: 10,
    fontWeight: "600",
  } as TextStyle,
  vpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  } as ViewStyle,
  vpText: {
    fontSize: 11,
    color: "#4fc3f7",
    fontWeight: "600",
  } as TextStyle,
  priceBox: {
    paddingRight: 12,
    alignItems: "flex-end",
    gap: 6,
    justifyContent: "center",
  } as ViewStyle,
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: C.accent,
  } as TextStyle,
  buyBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  } as ViewStyle,
  buyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  } as TextStyle,
});

const OverviewCard = ({
  icon,
  value,
  label,
  accent,
}: {
  icon: string;
  value: string | number;
  label: string;
  accent: string;
}) => (
  <View style={[ov.card, { borderTopColor: accent }]}>
    <Text style={ov.icon}>{icon}</Text>
    <Text style={[ov.value, { color: accent }]}>{value}</Text>
    <Text style={ov.label}>{label}</Text>
  </View>
);

const ov = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    borderTopWidth: 3,
    padding: 12,
    alignItems: "center",
    gap: 4,
  } as ViewStyle,
  icon: {
    fontSize: 20,
  } as TextStyle,
  value: {
    fontSize: 22,
    fontWeight: "800",
  } as TextStyle,
  label: {
    fontSize: 10,
    color: C.textSecondary,
    textAlign: "center",
  } as TextStyle,
});

export default function OwenShopHome() {
  const [activeTab, setActiveTab] = useState<"Home" | "Add" | "Products" | "Categories">("Home");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Top Header ── */}
      <View style={styles.header}>
        {/* Logo */}
        <Image
          source={require("@/assets/images/owen-shop-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Shop Name */}
        <View style={styles.shopNameBox}>
          <Text style={styles.shopName}>Owen Shop</Text>
          <Text style={styles.shopSub}>Valorant Skins Store</Text>
        </View>

        {/* Admin Avatar */}
        <TouchableOpacity style={styles.avatar} activeOpacity={0.8}>
          <Text style={styles.avatarText}>AD</Text>
        </TouchableOpacity>
      </View>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.overviewRow}>
          <OverviewCard icon="🎮" value={156} label="Total Skins" accent="#ff4655" />
          <OverviewCard icon="🛒" value={34} label="New Orders" accent="#4fc3f7" />
          <OverviewCard icon="⚠️" value={2} label="Low Stock" accent="#f97316" />
        </View>

        {/* Trending Section */}
        <View style={styles.trendingHeader}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Skin Cards */}
        <View style={styles.skinList}>
          {SKINS.map((skin) => (
            <SkinCard key={skin.id} skin={skin} />
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom Navigation ── */}
      <View style={styles.bottomNav}>
        {(["Home", "Add", "Products", "Categories"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const icons: Record<string, string> = {
            Home: "🏠",
            Add: "➕",
            Products: "📦",
            Categories: "🏷️",
          };
          return (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.65}
            >
              <View
                style={[
                  styles.navIconCircle,
                  tab === "Add" && styles.navAddCircle,
                  tab === "Add" && isActive && styles.navAddCircleActive,
                ]}
              >
                <Text
                  style={[
                    styles.navIcon,
                    { color: isActive ? C.navActive : C.navInactive },
                    tab === "Add" && styles.navAddIcon,
                  ]}
                >
                  {icons[tab]}
                </Text>
              </View>
              <Text
                style={[
                  styles.navLabel,
                  { color: isActive ? C.navActive : C.navInactive },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  } as ViewStyle,

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.navBg,
    gap: 10,
  } as ViewStyle,
  logo: {
    width: 44,
    height: 44,
    borderRadius: 8,
  } as ImageStyle,
  shopNameBox: {
    flex: 1,
  } as ViewStyle,
  shopName: {
    fontSize: 18,
    fontWeight: "800",
    color: C.accent,
    letterSpacing: 0.5,
  } as TextStyle,
  shopSub: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "500",
  } as TextStyle,
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: C.accentDim,
  } as ViewStyle,
  avatarText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  } as TextStyle,

  divider: {
    height: 1,
    backgroundColor: C.border,
  } as ViewStyle,

  // Scroll
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // clear bottom nav
  } as ViewStyle,

  // Section titles
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
    marginBottom: 12,
  } as TextStyle,

  // Overview
  overviewRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  } as ViewStyle,

  // Trending
  trendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  } as ViewStyle,
  seeAll: {
    fontSize: 13,
    color: C.accent,
    fontWeight: "600",
  } as TextStyle,

  // Skin list
  skinList: {
    gap: 0,
  } as ViewStyle,

  // Bottom Nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: C.navBg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    height: 64,
    alignItems: "center",
  } as ViewStyle,
  navItem: {
    flex: 1,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  } as ViewStyle,
  navIconCircle: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  } as ViewStyle,
  navAddCircle: {
    width: 36,
    height: 36,
    backgroundColor: "#1e1e1e",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
  } as ViewStyle,
  navAddCircleActive: {
    backgroundColor: "#2a0a0e",
    borderColor: C.accent,
  } as ViewStyle,
  navIcon: {
    fontSize: 18,
  } as TextStyle,
  navAddIcon: {
    fontSize: 16,
  } as TextStyle,
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
  } as TextStyle,
});
