import { useEffect, useState } from "react";
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

// API URL to use cloud server
const API_BASE_URL = 'http://119.59.102.161:3027/api';

function normalizeImageUrl(url: string | undefined) {
  if (!url) return undefined;
  try {
    // กรณีที่รูปถูกเก็บไว้ใน server ตัวเอง
    if (url.startsWith('/uploads/') || url.startsWith('/images/')) {
      return `${API_BASE_URL}${url}`;
    }
    // convert GitHub blob urls to raw.githubusercontent URLs
    if (url.includes('github.com') && url.includes('/blob/')) {
      return url.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/');
    }
    return url;
  } catch {
    return url;
  }
}

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
    width: 130,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  } as ViewStyle,
  imageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  } as ViewStyle,
  image: {
    width: "100%",
    height: "100%",
    alignSelf: 'center',
    borderRadius: 8,
  } as ImageStyle,
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    justifyContent: "center",
  } as ViewStyle,
  name: {
    fontSize: 14,
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
    paddingVertical: 6,
    borderRadius: 6,
  } as ViewStyle,
  buyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  } as TextStyle,
});

const SkinCard = ({ skin }: { skin: any }) => {
  const imgUri = skin._image_url || normalizeImageUrl(skin.image_url || skin.image);
  const [imgError, setImgError] = useState(false);
  const tagBg = skin.tagBg || C.tagBg;
  const tagText = skin.tagText || C.tagText;
  const skinName = skin.name || skin.title || 'Unknown Skin';
  const skinCategory = skin.category_name || skin.type || skin.category || 'Skin';
  const vpPrice = skin.vp_price ?? skin.vp ?? 0;
  const thbPrice = skin.price_thb ?? skin.price ?? 0;
  const badgeText = skin.badge || skin.badge_status || '';

  return (
    <View style={card.wrapper}>
      {/* Product Image */}
      {imgUri && !imgError ? (
        <View style={card.imageBox}>
          <View style={[card.imageInner, { backgroundColor: '#140606' }]}>
            <Image
              source={{ uri: imgUri }}
              style={card.image}
              resizeMode="contain"
              onError={() => setImgError(true)}
            />
          </View>
        </View>
      ) : (
        <View style={card.imageBox}>
          <View style={[card.imageInner, { backgroundColor: '#1a0a0d', justifyContent: 'center' }]}>
            <Text style={{ color: '#ff6b77', fontWeight: '700', fontSize: 11 }}>No Image</Text>
          </View>
        </View>
      )}

      {/* Info */}
      <View style={card.info}>
        <Text style={card.name} numberOfLines={1}>
          {skinName}
        </Text>

        <View style={{ marginTop: 4 }}>
          <View style={[card.typePill, { backgroundColor: tagBg, marginBottom: 4 }]}>
            <Text style={[card.typeText, { color: tagText }]}>{skinCategory}</Text>
          </View>

          <Text style={[card.vpText, { fontSize: 11, color: C.textSecondary, marginBottom: 2 }]}>
            VP: {vpPrice ? vpPrice.toLocaleString() : '0'}
          </Text>
          <Text style={[card.vpText, { fontSize: 11, color: C.accent, fontWeight: '700' }]}>
            ฿{thbPrice ? thbPrice.toLocaleString() : '0'}
          </Text>
        </View>
      </View>

      {/* Action / Badge */}
      <View style={card.priceBox}>
        {badgeText ? (
          <Text style={[card.price, { fontSize: 11, color: C.textSecondary }]}>{badgeText}</Text>
        ) : null}
        <TouchableOpacity style={card.buyBtn} activeOpacity={0.75}>
          <Text style={card.buyText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

// Enhanced API Call Function with better error handling for cloud
const apiCall = async (endpoint: string, options: any = {}) => {
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ไม่สามารถดึงข้อมูลได้`);
  return response.json();
};

export default function OwenShopHome() {
  const [activeTab, setActiveTab] = useState<"Home" | "Add" | "Products" | "Categories">("Home");
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [authToken] = useState<string | null>(null); // ตั้ง token ตรงนี้ถ้ามี login
  const [skins, setSkins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This is a function that "retrieves products" directly from the API.
  // It calls /products via the apiCall() method declared above.
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiCall('/products');

      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      const parsedData = data.map((product: any) => ({
        ...product,
        storeAvailability: typeof product.storeAvailability === 'string'
          ? JSON.parse(product.storeAvailability || '[]')
          : product.storeAvailability || [],
        _image_url: normalizeImageUrl(product.image_url || product.image),
      }));

      setSkins(parsedData);
      console.log(`Loaded ${parsedData.length} products`);
    } catch (err: any) {
      console.error('Fetch products error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // When you login and go to the Products screen → fetch products
  useEffect(() => {
    if (authToken && currentScreen === 'products') {
      fetchProducts();
    }
  }, [authToken, currentScreen]);

  // Auto-fetch products when accessing dashboard
  useEffect(() => {
    if (authToken && currentScreen === 'dashboard' && skins.length === 0) {
      fetchProducts();
    }
  }, [authToken, currentScreen]);

  // If you don't have login function you can just use this
  useEffect(() => {
    fetchProducts();
  }, []);

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
          <OverviewCard icon="🎮" value={skins.length || 0} label="Total Skins" accent="#ff4655" />
          <OverviewCard icon="🛒" value={34} label="New Orders" accent="#4fc3f7" />
          <OverviewCard icon="⚠️" value={2} label="Low Stock" accent="#f97316" />
        </View>

        {/* Trending Section */}
        <View style={styles.trendingHeader}>
          <Text style={styles.sectionTitle}>Products ({skins.length})</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Skin Cards */}
        <View style={styles.skinList}>
          {loading ? (
            <Text style={styles.loadingText}>กำลังโหลดข้อมูลจาก API...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : skins.length === 0 ? (
            <Text style={styles.loadingText}>ไม่พบรายการสินค้า</Text>
          ) : (
            skins.map((skin, index) => (
              <SkinCard key={skin.id || skin._id || index} skin={skin} />
            ))
          )}
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
  loadingText: {
    color: C.textSecondary,
    textAlign: "center",
    marginVertical: 20,
  } as TextStyle,
  errorText: {
    color: C.accent,
    textAlign: "center",
    marginVertical: 20,
  } as TextStyle,

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