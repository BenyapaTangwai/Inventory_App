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
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import {
  AddIcon,
  AlertIcon,
  CartIcon,
  CategoriesIcon,
  GamepadIcon,
  HomeIcon,
  ProductsIcon,
} from "@/components/tab-icons";
import AddProductScreen from "@/components/add-product-screen";
import EditProductScreen from "@/components/edit-product-screen";
import ProductsScreen from "@/components/products-screen";

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

// API URL to use remote server
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
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  } as ViewStyle,
  imageArea: {
    width: "100%",
    height: 165,
    backgroundColor: "#0c0507",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1e0b0e",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  } as ViewStyle,
  image: {
    width: "92%",
    height: "92%",
  } as ImageStyle,
  noImgInner: {
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  badgeOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#052e16",
    borderColor: "#14532d",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
  } as ViewStyle,
  badgeText: {
    color: "#22c55e",
    fontSize: 10,
    fontWeight: "700",
  } as TextStyle,
  infoTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  } as ViewStyle,
  typePill: {
    backgroundColor: "#1e1e1e",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  } as ViewStyle,
  typeText: {
    fontSize: 10,
    fontWeight: "600",
    color: C.textSecondary,
  } as TextStyle,
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 4,
  } as ViewStyle,
  nameBoxLeft: {
    flex: 1,
    marginRight: 12,
  } as ViewStyle,
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 22,
  } as TextStyle,
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
    color: "#4fc3f7",
    letterSpacing: 0.5,
  } as TextStyle,
});

const SkinCard = ({ skin }: { skin: any }) => {
  const imgUri = skin._image_url || normalizeImageUrl(skin.image_url || skin.image);
  const [imgError, setImgError] = useState(false);
  const skinName = skin.name || skin.title || 'Unknown Skin';
  const skinCategory = skin.category_name || skin.type || skin.category || 'Skin';
  const vpPrice = skin.vp_price ?? skin.vp ?? 0;
  const thbPrice = skin.price_thb ?? skin.price ?? 0;
  const badgeText = skin.badge || skin.badge_status || 'Active';

  return (
    <View style={card.wrapper}>
      {/* 1. Large Banner Image Box */}
      <View style={card.imageArea}>
        {imgUri && !imgError ? (
          <Image
            source={{ uri: imgUri }}
            style={card.image}
            resizeMode="contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={card.noImgInner}>
            <Text style={{ color: C.accent, fontWeight: '700', fontSize: 12 }}>No Image</Text>
          </View>
        )}

        {/* Status Overlay Badge at Top-Right */}
        <View style={card.badgeOverlay}>
          <Text style={card.badgeText}>{badgeText}</Text>
        </View>
      </View>

      {/* 2. Middle Tags Row */}
      <View style={card.infoTagsRow}>
        <View style={card.typePill}>
          <Text style={card.typeText}>{skinCategory}</Text>
        </View>
        <View style={[card.typePill, { backgroundColor: '#2a0a0e' }]}>
          <Text style={[card.typeText, { color: '#ff6b77' }]}>Stock: {skin.stock ?? 12}</Text>
        </View>
      </View>

      {/* 3. Bottom Row: Name on Left, VP & Price (THB) on Right */}
      <View style={card.bottomRow}>
        {/* Left Side: Product Name */}
        <View style={card.nameBoxLeft}>
          <Text style={card.name} numberOfLines={2}>
            {skinName}
          </Text>
        </View>

        {/* Right Side: VP Points & THB Price */}
        <View style={card.priceBoxRight}>
          <Text style={card.thbTextLarge}>
            ฿{thbPrice ? thbPrice.toLocaleString() : '625'}
          </Text>
          <Text style={card.vpTextSmall}>
            {vpPrice ? vpPrice.toLocaleString() : '2,175'}{' '}
            <Text style={card.vpUnitText}>VP</Text>
          </Text>
        </View>
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
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accent: string;
}) => (
  <View style={[ov.card, { borderTopColor: accent }]}>
    <View style={ov.iconContainer}>{icon}</View>
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
  iconContainer: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
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
  const [activeTab, setActiveTab] = useState<"Home" | "Add" | "Products" | "Categories" | "Edit">("Home");
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [authToken] = useState<string | null>(null); // ตั้ง token ตรงนี้ถ้ามี login
  const [skins, setSkins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const cardWidth = isDesktop ? "32.2%" : isTablet ? "48.8%" : "100%";

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

  // Add product handler
  const handleAddProduct = async (newProduct: any) => {
    try {
      try {
        await apiCall('/products', {
          method: 'POST',
          body: JSON.stringify(newProduct),
        });
      } catch (e) {
        console.warn('API POST skipped or failed, updating local state:', e);
      }

      const createdItem = {
        id: Date.now(),
        ...newProduct,
        _image_url: newProduct.image_url,
      };

      setSkins((prev) => [createdItem, ...prev]);
    } catch (err: any) {
      console.error('handleAddProduct error:', err);
      throw err;
    }
  };

  // Edit product handler
  const handleEditProduct = async (id: number | string, updatedProduct: any) => {
    try {
      try {
        await apiCall(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updatedProduct),
        });
      } catch (e) {
        console.warn('API PUT skipped or failed, updating local state:', e);
      }

      setSkins((prev) => 
        prev.map(skin => 
          (skin.id === id || skin._id === id) 
            ? { ...skin, ...updatedProduct, _image_url: updatedProduct.image_url } 
            : skin
        )
      );
    } catch (err: any) {
      console.error('handleEditProduct error:', err);
      throw err;
    }
  };

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

      {/* ── Dynamic Tab Content ── */}
      {activeTab === "Add" ? (
        <AddProductScreen
          onBack={() => setActiveTab("Home")}
          onAddProduct={handleAddProduct}
        />
      ) : activeTab === "Edit" && editingProduct ? (
        <EditProductScreen
          onBack={() => setActiveTab("Products")}
          onEditProduct={handleEditProduct}
          initialData={editingProduct}
        />
      ) : activeTab === "Products" ? (
        <ProductsScreen
          skins={skins}
          loading={loading}
          error={error}
          onRefresh={fetchProducts}
          onGoToAdd={() => setActiveTab("Add")}
          onEditProduct={(product) => {
            setEditingProduct(product);
            setActiveTab("Edit");
          }}
        />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Overview */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewRow}>
            <OverviewCard
              icon={<GamepadIcon color="#ff4655" size={26} />}
              value={skins.length || 0}
              label="Total Skins"
              accent="#ff4655"
            />
            <OverviewCard
              icon={<CartIcon color="#4fc3f7" size={26} />}
              value={12}
              label="New Orders"
              accent="#4fc3f7"
            />
            <OverviewCard
              icon={<AlertIcon color="#f97316" size={26} />}
              value={skins.filter(s => s.stock != null && Number(s.stock) < 5).length}
              label="Low Stock"
              accent="#f97316"
            />
          </View>

          {/* Trending Section */}
          <View style={styles.trendingHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === "Categories" ? "Categories" : `Products (${skins.length})`}
            </Text>
            {activeTab === "Home" && (
              <TouchableOpacity activeOpacity={0.6} onPress={() => setActiveTab("Products")}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Skin Cards */}
          {loading ? (
            <Text style={styles.loadingText}>กำลังโหลดข้อมูลจาก API...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : skins.length === 0 ? (
            <Text style={styles.loadingText}>ไม่พบรายการสินค้า</Text>
          ) : (
            <View style={styles.skinListGrid}>
              {skins.map((skin, index) => (
                <View key={skin.id || skin._id || index} style={{ width: cardWidth as any }}>
                  <SkinCard skin={skin} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Bottom Navigation ── */}
      <View style={styles.bottomNav}>
        {(["Home", "Add", "Products", "Categories"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const iconColor = isActive ? C.navActive : C.navInactive;

          const IconComponent = () => {
            if (tab === "Home") return <HomeIcon color={iconColor} size={26} />;
            if (tab === "Add") return <AddIcon color={iconColor} size={26} />;
            if (tab === "Products") return <ProductsIcon color={iconColor} size={26} />;
            if (tab === "Categories") return <CategoriesIcon color={iconColor} size={26} />;
            return null;
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
                <IconComponent />
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
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
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
  skinListGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    width: "100%",
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
  navLabel: {
    fontSize: 10,
    fontWeight: "600",
  } as TextStyle,
});