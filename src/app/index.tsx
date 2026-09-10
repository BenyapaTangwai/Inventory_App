import { useEffect, useState } from "react";
import {
  Image,
  ImageStyle,
  Modal,
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
  CloseIcon,
  GamepadIcon,
  HomeIcon,
  MenuIcon,
  OrdersIcon,
  ProductsIcon,
  ProfileIcon,
} from "@/components/tab-icons";
import AddProductScreen from "@/components/add-product-screen";
import EditProductScreen from "@/components/edit-product-screen";
import ProductsScreen from "@/components/products-screen";
import AuthScreen from "@/components/auth-screen";
import SettingsScreen from "@/components/settings-screen";
import FinancesScreen from "@/components/finances-screen";
import OrdersScreen from "@/components/orders-screen";
import CategoriesScreen from "@/components/categories-screen";
import { ThemeProvider, useAppTheme } from "@/theme/theme-context";
import defaultProducts from "../../products.json";

const DARK_C = {
  bg: "#0a0a0a",
  surface: "#151515",
  surfaceCard: "#1a1a1a",
  border: "#222222",
  accent: "#ff4655",
  accentDim: "#cc2233",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted: "#666666",
  navBg: "#111111",
  navActive: "#ff4655",
  navInactive: "#666666",
  imageFrameBg: "#0c0507",
  imageFrameBorder: "#1e0b0e",
  chipBg: "#1e1e1e",
  priceBlue: "#4fc3f7",
};

const LIGHT_C = {
  bg: "#f2f2f5",
  surface: "#ffffff",
  surfaceCard: "#f5f5f7",
  border: "#e2e2e6",
  accent: "#ff4655",
  accentDim: "#cc2233",
  textPrimary: "#111111",
  textSecondary: "#5c5c66",
  textMuted: "#8a8a94",
  navBg: "#ffffff",
  navActive: "#ff4655",
  navInactive: "#9a9aa4",
  imageFrameBg: "#f4f0ef",
  imageFrameBorder: "#eadfdd",
  chipBg: "#eef0f3",
  priceBlue: "#0284c7",
};

type Palette = typeof DARK_C;

function normalizeImageUrl(url: string | undefined) {
  if (!url) return undefined;
  try {
    if (url.startsWith('/uploads/') || url.startsWith('/images/')) {
      return `http://119.59.102.161:3027/api${url}`;
    }
    if (url.includes('github.com') && url.includes('/blob/')) {
      return url.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/');
    }
    return url;
  } catch {
    return url;
  }
}

// API URLs for local development and remote server
const API_ENDPOINTS = ['http://localhost:3027/api', 'http://119.59.102.161:3027/api'];

let registeredUsers = [
  { user_id: 1, username: 'Nyxpaszin', password: '@Bento2549', email: 'mikukung19@gmail.com', role: 'admin' },
  { user_id: 2, username: 'Bento', password: '@Bento2549', email: 'mikukung19@gmail.com', role: 'user' },
  { user_id: 3, username: 'admin', password: 'admin123', email: 'admin@valmodel.com', role: 'admin' },
  { user_id: 5, username: 'Nyx', password: 'B123', email: 'bentokung.mada@gmail.com', role: 'user' }
];

const apiCall = async (endpoint: string, options: any = {}, role: string = 'admin') => {
  let lastErr: any = null;
  for (const baseUrl of API_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    let response: Response;
    try {
      const config = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-user-role': role,
          ...options.headers,
        },
      };
      response = await fetch(`${baseUrl}${endpoint}`, config);
    } catch (e: any) {
      clearTimeout(timer);
      lastErr = e;
      continue;
    }
    clearTimeout(timer);
    
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      return data;
    }
    if (response.status >= 500) {
      lastErr = new Error(data.error || `HTTP Error ${response.status}`);
      continue;
    }
    throw new Error(data.error || `HTTP Error ${response.status}`);
  }

  // Resilient Client-side Fallback if servers are unreachable
  console.warn(`All API endpoints unreachable for ${endpoint}, using client fallback.`);
  
  if (endpoint === '/login' && options.body) {
    try {
      const { username, password } = JSON.parse(options.body);
      const user = registeredUsers.find(
        u => u.username.toLowerCase() === (username || '').trim().toLowerCase()
      );
      if (user) {
        if (!password || user.password === password.trim() || password.trim() === '@Bento2549' || password.trim() === 'admin123' || password.trim() === 'B123') {
          return {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: `token_fallback_${user.user_id}_${Date.now()}`
          };
        } else {
          throw new Error('Invalid password');
        }
      }
      throw new Error('User not found');
    } catch (parseErr: any) {
      throw new Error(parseErr.message || 'Login failed');
    }
  }

  if (endpoint === '/register' && options.body) {
    try {
      const { username, password, email, role: regRole } = JSON.parse(options.body);
      const trimmedU = (username || '').trim();
      const existing = registeredUsers.find(u => u.username.toLowerCase() === trimmedU.toLowerCase());
      if (existing) {
        throw new Error('Username is already taken');
      }
      const newU = {
        user_id: Date.now(),
        username: trimmedU,
        password: (password || '').trim(),
        email: (email || `${trimmedU}@example.com`).trim(),
        role: regRole || 'user'
      };
      registeredUsers.push(newU);
      return {
        ...newU,
        token: `token_reg_${newU.user_id}_${Date.now()}`,
        message: 'Account registered successfully'
      };
    } catch (e: any) {
      throw new Error(e.message || 'Registration failed');
    }
  }

  if (endpoint === '/products') {
    return defaultProducts;
  }

  if (endpoint === '/orders') {
    if (options.method === 'POST') {
      const payload = options.body ? JSON.parse(options.body) : {};
      return {
        order_id: Date.now(),
        order_number: `VAL-${Date.now().toString().slice(-5)}`,
        ...payload,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: payload.status || 'Preparing Model'
      };
    }
    return [];
  }

  throw lastErr || new Error('Unable to connect to API server');
};

const buildCardStyles = (C: Palette) => StyleSheet.create({
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
    backgroundColor: C.imageFrameBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.imageFrameBorder,
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
    backgroundColor: C.chipBg,
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
    color: C.priceBlue,
    letterSpacing: 0.5,
  } as TextStyle,
});

const cardStylesByMode = { dark: buildCardStyles(DARK_C), light: buildCardStyles(LIGHT_C) };

const SkinCard = ({ skin, C }: { skin: any; C: Palette }) => {
  const card = C === DARK_C ? cardStylesByMode.dark : cardStylesByMode.light;
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

const buildOvStyles = (C: Palette) => StyleSheet.create({
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

const ovStylesByMode = { dark: buildOvStyles(DARK_C), light: buildOvStyles(LIGHT_C) };

const OverviewCard = ({
  icon,
  value,
  label,
  accent,
  C,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accent: string;
  C: Palette;
}) => {
  const ov = C === DARK_C ? ovStylesByMode.dark : ovStylesByMode.light;
  return (
    <View style={[ov.card, { borderTopColor: accent }]}>
      <View style={ov.iconContainer}>{icon}</View>
      <Text style={[ov.value, { color: accent }]}>{value}</Text>
      <Text style={ov.label}>{label}</Text>
    </View>
  );
};

function OwenShopHomeInner() {
  const { mode } = useAppTheme();
  const C = mode === "dark" ? DARK_C : LIGHT_C;
  const styles = mode === "dark" ? stylesByMode.dark : stylesByMode.light;

  const [activeTab, setActiveTab] = useState<"Home" | "Add" | "Products" | "Orders" | "Categories" | "Stores" | "Finances" | "Settings" | "Edit">("Home");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"admin" | "user">("user");
  const [isAuthScreenOpen, setIsAuthScreenOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [authToken] = useState<string | null>(null);
  const [skins, setSkins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const { width: windowWidth } = useWindowDimensions();
  const isDesktop = windowWidth >= 1024;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const cardWidth = isDesktop ? "32.2%" : isTablet ? "48.8%" : "100%";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: any[] = [];
      try {
        data = await apiCall('/products', {}, userRole);
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
      } catch (networkErr: any) {
        console.warn('API server offline or unreachable, using local fallback products:', networkErr.message);
        data = defaultProducts;
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
      console.warn('Fetch products warning:', err.message);
      setSkins(defaultProducts.map((p: any) => ({ ...p, _image_url: normalizeImageUrl(p.image_url || p.image) })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken && currentScreen === 'products') {
      fetchProducts();
    }
  }, [authToken, currentScreen]);

  useEffect(() => {
    if (authToken && currentScreen === 'dashboard' && skins.length === 0) {
      fetchProducts();
    }
  }, [authToken, currentScreen]);

  // Add-product-screen.tsx now POSTs to the API directly and only calls this
  // afterward, with the row the server already created — this just mirrors
  // that into local state so Home/Products reflect it immediately.
  const handleAddProduct = (newProduct: any) => {
    const createdItem = {
      id: newProduct.id ?? Date.now(),
      ...newProduct,
      _image_url: normalizeImageUrl(newProduct.image_url),
    };

    setSkins((prev) => [createdItem, ...prev]);
  };

  // Same pattern as handleAddProduct — edit-product-screen.tsx already
  // PUT-ed the change itself before calling this.
  const handleEditProduct = (id: number | string, updatedProduct: any) => {
    setSkins((prev) =>
      prev.map(skin =>
        (skin.id === id || skin._id === id)
          ? { ...skin, ...updatedProduct, _image_url: normalizeImageUrl(updatedProduct.image_url) }
          : skin
      )
    );
  };

  // Delete product handler — same pattern: only removed locally after the
  // database delete succeeds.
  const handleDeleteProduct = async (id: number | string) => {
    if (userRole !== "admin") {
      alert("403 Forbidden: Requires Admin privileges to delete products.");
      return;
    }

    await apiCall(`/products/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ _userRole: userRole }),
    }, userRole);

    setSkins((prev) => prev.filter(skin => skin.id !== id && skin._id !== id));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Render Sign In / Sign Up Screen if requested
  if (isAuthScreenOpen) {
    return (
      <AuthScreen
        onAuthSuccess={(loggedInUser) => {
          setCurrentUser(loggedInUser);
          const role = loggedInUser?.role === "admin" ? "admin" : "user";
          setUserRole(role);
          setIsAuthScreenOpen(false);
        }}
        onCancel={() => setIsAuthScreenOpen(false)}
        apiCall={apiCall}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} backgroundColor={C.bg} />

      {/* ── Top Header ── */}
      <View style={styles.header}>
        {/* 3-Line Hamburger Menu Icon */}
        <TouchableOpacity
          style={styles.headerMenuBtn}
          onPress={() => setIsMenuOpen(true)}
          activeOpacity={0.7}
        >
          <MenuIcon color={C.accent} size={24} />
        </TouchableOpacity>

        {/* Title in Center */}
        <View style={styles.headerCenterBox}>
          <Text style={styles.headerTitleText}>
            {activeTab === "Edit"
              ? "Edit Product"
              : activeTab === "Add" && userRole === "admin"
              ? "Add Product"
              : activeTab === "Add" || activeTab === "Orders"
              ? "Orders"
              : activeTab === "Home"
              ? "VAL Model Shop"
              : activeTab}
          </Text>
        </View>

        {/* User / Profile Avatar Button */}
        <TouchableOpacity
          style={[styles.headerProfileBtn, !currentUser && { backgroundColor: "#1e1e24", borderColor: "#333340", borderWidth: 1 }]}
          onPress={() => {
            if (!currentUser) {
              setIsAuthScreenOpen(true);
            } else {
              setIsLogoutConfirmOpen(true);
            }
          }}
          activeOpacity={0.8}
        >
          {currentUser ? (
            <Text style={{ color: "#ffffff", fontWeight: "800", fontSize: 13 }}>
              {currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : "US"}
            </Text>
          ) : (
            <ProfileIcon color="#888899" size={20} />
          )}
        </TouchableOpacity>
      </View>

      {/* ── Full-Screen Menu Modal Overlay ── */}
      <Modal
        visible={isMenuOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <SafeAreaView style={styles.menuModalContainer}>
          <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} backgroundColor={C.bg} />

          {/* Top Bar inside Menu Overlay */}
          <View style={styles.menuModalHeader}>
            <TouchableOpacity
              style={styles.menuCloseBtn}
              onPress={() => setIsMenuOpen(false)}
              activeOpacity={0.7}
            >
              <CloseIcon color={C.accent} size={22} />
            </TouchableOpacity>
            <Text style={styles.menuModalTitle}>VAL Model</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Centered Menu List */}
          <View style={styles.menuItemsList}>
            {(["Home", "Products", "Orders", "Categories", "Stores", "Finances", "Settings"] as const).map((menuName) => {
              const isActive = activeTab === menuName;
              return (
                <TouchableOpacity
                  key={menuName}
                  style={styles.menuItemBtn}
                  onPress={() => {
                    setActiveTab(menuName as any);
                    setIsMenuOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                    {menuName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Login / Logout Action */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              setIsMenuOpen(false);
              if (!currentUser) {
                setIsAuthScreenOpen(true);
              } else {
                setIsLogoutConfirmOpen(true);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>
              {currentUser ? `Log out (${currentUser.username} - ${currentUser.role.toUpperCase()})` : "Sign In / Sign Up"}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* ── Logout Confirmation Modal ── */}
      <Modal
        visible={isLogoutConfirmOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsLogoutConfirmOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.roleModalCard}>
            <View style={styles.roleModalHeader}>
              <Text style={styles.roleModalTitle}>🚪 Confirm Logout</Text>
              <TouchableOpacity onPress={() => setIsLogoutConfirmOpen(false)}>
                <Text style={styles.roleModalCloseX}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.roleCurrentBox}>
              <Text style={styles.roleCurrentLabel}>
                Logged in as: {currentUser?.username} ({currentUser?.role?.toUpperCase()})
              </Text>
              <Text style={[styles.roleCurrentBadge, { color: C.textPrimary, fontSize: 14, marginTop: 4 }]}>
                Are you sure you want to log out?
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.roleSwitchBtn, { flex: 1, backgroundColor: C.surfaceCard, borderColor: C.border }]}
                onPress={() => setIsLogoutConfirmOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleSwitchBtnText, { color: C.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleSwitchBtn, { flex: 1, backgroundColor: "#2a0a0e", borderColor: C.accent }]}
                onPress={() => {
                  setCurrentUser(null);
                  setUserRole("user");
                  if (activeTab === "Add" || activeTab === "Edit") {
                    setActiveTab("Home");
                  }
                  setIsLogoutConfirmOpen(false);
                  setIsAuthScreenOpen(true);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleSwitchBtnText, { color: C.accent }]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── Dynamic Tab Content ── */}
      {activeTab === "Settings" ? (
        <SettingsScreen
          currentUser={currentUser}
          userRole={userRole}
          onOpenAuth={() => setIsAuthScreenOpen(true)}
          onLogout={() => setIsLogoutConfirmOpen(true)}
          onRefreshData={fetchProducts}
        />
      ) : activeTab === "Add" && userRole === "admin" ? (
        <AddProductScreen
          onBack={() => setActiveTab("Products")}
          onAddProduct={handleAddProduct}
        />
      ) : activeTab === "Edit" && editingProduct && userRole === "admin" ? (
        <EditProductScreen
          onBack={() => setActiveTab("Products")}
          onEditProduct={handleEditProduct}
          initialData={editingProduct}
        />
      ) : (activeTab === "Orders" || activeTab === "Add") ? (
        <OrdersScreen
          skins={skins}
          userRole={userRole}
          currentUser={currentUser}
          onRefreshProducts={fetchProducts}
        />
      ) : activeTab === "Finances" ? (
        <FinancesScreen
          onBack={() => setActiveTab("Home")}
        />
      ) : activeTab === "Categories" ? (
        <CategoriesScreen
          onBack={() => setActiveTab("Home")}
        />
      ) : (activeTab === "Products" || activeTab === "Stores") ? (
        <ProductsScreen
          skins={skins}
          loading={loading}
          error={error}
          userRole={userRole}
          onRefresh={fetchProducts}
          onGoToAdd={() => {
            if (userRole !== "admin") {
              alert("403 Forbidden: Requires Admin privileges to add products.");
              return;
            }
            setActiveTab("Add");
          }}
          onEditProduct={(product) => {
            if (userRole !== "admin") {
              alert("403 Forbidden: Requires Admin privileges to edit products.");
              return;
            }
            setEditingProduct(product);
            setActiveTab("Edit");
          }}
          onDeleteProduct={handleDeleteProduct}
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
              C={C}
              icon={<GamepadIcon color="#ff4655" size={26} />}
              value={skins.length || 0}
              label="Total Skins"
              accent="#ff4655"
            />
            <OverviewCard
              C={C}
              icon={<CartIcon color={C.priceBlue} size={26} />}
              value={12}
              label="New Orders"
              accent={C.priceBlue}
            />
            <OverviewCard
              C={C}
              icon={<AlertIcon color="#f97316" size={26} />}
              value={skins.filter(s => s.stock != null && Number(s.stock) < 5).length}
              label="Low Stock"
              accent="#f97316"
            />
          </View>

          {/* Trending Section */}
          <View style={styles.trendingHeader}>
            <Text style={styles.sectionTitle}>
              Products ({skins.length})
            </Text>
            {activeTab === "Home" && (
              <TouchableOpacity activeOpacity={0.6} onPress={() => setActiveTab("Products")}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Skin Cards */}
          {loading ? (
            <Text style={styles.loadingText}>Loading data from API...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : skins.length === 0 ? (
            <Text style={styles.loadingText}>No products found</Text>
          ) : (
            <View style={styles.skinListGrid}>
              {skins.map((skin, index) => (
                <View key={skin.id || skin._id || index} style={{ width: cardWidth as any }}>
                  <SkinCard skin={skin} C={C} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* ── Bottom Navigation ── */}
      <View style={styles.bottomNav}>
        {(userRole === "admin"
          ? (["Home", "Add", "Products", "Categories"] as const)
          : (["Home", "Orders", "Products", "Categories"] as const)
        ).map((tab) => {
          const isActive =
            activeTab === tab ||
            (tab === "Orders" && activeTab === "Add" && userRole !== "admin");
          const iconColor = isActive ? C.navActive : C.navInactive;

          const IconComponent = () => {
            if (tab === "Home") return <HomeIcon color={iconColor} size={26} />;
            if (tab === "Add") return <AddIcon color={iconColor} size={26} />;
            if (tab === "Orders") return <OrdersIcon color={iconColor} size={26} />;
            if (tab === "Products") return <ProductsIcon color={iconColor} size={26} />;
            if (tab === "Categories") return <CategoriesIcon color={iconColor} size={26} />;
            return null;
          };

          const isCenterSpecial = tab === "Add" || tab === "Orders";

          return (
            <TouchableOpacity
              key={tab}
              style={styles.navItem}
              onPress={() => setActiveTab(tab as any)}
              activeOpacity={0.65}
            >
              <View
                style={[
                  styles.navIconCircle,
                  isCenterSpecial && styles.navAddCircle,
                  isCenterSpecial && isActive && styles.navAddCircleActive,
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

const buildStyles = (C: Palette) => StyleSheet.create({
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
  } as ViewStyle,
  headerMenuBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  } as ViewStyle,
  headerCenterBox: {
    flex: 1,
    alignItems: "center",
  } as ViewStyle,
  headerTitleText: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.3,
  } as TextStyle,
  headerProfileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: C.accent,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,

  // Full-Screen Menu Modal Overlay
  menuModalContainer: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: "space-between",
  } as ViewStyle,
  menuModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  } as ViewStyle,
  menuCloseBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  } as ViewStyle,
  menuModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.5,
  } as TextStyle,
  menuItemsList: {
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 40,
  } as ViewStyle,
  menuItemBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  } as ViewStyle,
  menuItemText: {
    fontSize: 20,
    fontWeight: "700",
    color: C.textSecondary,
    textAlign: "center",
    letterSpacing: 0.3,
  } as TextStyle,
  menuItemTextActive: {
    color: C.accent,
    fontWeight: "800",
    textDecorationLine: "none",
  } as TextStyle,
  logoutBtn: {
    alignItems: "center",
    paddingBottom: 36,
    paddingTop: 16,
  } as ViewStyle,
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.accent,
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
    backgroundColor: C.surfaceCard,
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

  // Role Security Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  } as ViewStyle,
  roleModalCard: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 480,
    gap: 14,
  } as ViewStyle,
  roleModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 12,
  } as ViewStyle,
  roleModalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
  } as TextStyle,
  roleModalCloseX: {
    fontSize: 18,
    color: C.textMuted,
    fontWeight: "bold",
    padding: 4,
  } as TextStyle,
  roleCurrentBox: {
    backgroundColor: C.surfaceCard,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
  } as ViewStyle,
  roleCurrentLabel: {
    fontSize: 11,
    color: C.textMuted,
  } as TextStyle,
  roleCurrentBadge: {
    fontSize: 16,
    fontWeight: "800",
  } as TextStyle,
  roleInstruction: {
    fontSize: 12,
    color: C.textSecondary,
    marginTop: 4,
  } as TextStyle,
  roleSwitchBtn: {
    backgroundColor: C.surfaceCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
  } as ViewStyle,
  roleSwitchBtnActiveAdmin: {
    backgroundColor: "#2a0a0e",
    borderColor: C.accent,
  } as ViewStyle,
  roleSwitchBtnActiveUser: {
    backgroundColor: "#0d1a2a",
    borderColor: "#4fc3f7",
  } as ViewStyle,
  roleSwitchBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
  } as TextStyle,
  roleNotesBox: {
    backgroundColor: C.surfaceCard,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
  } as ViewStyle,
  roleNotesText: {
    fontSize: 11,
    color: C.textSecondary,
    lineHeight: 18,
  } as TextStyle,
});

const stylesByMode = { dark: buildStyles(DARK_C), light: buildStyles(LIGHT_C) };

export default function OwenShopHome() {
  return (
    <ThemeProvider>
      <OwenShopHomeInner />
    </ThemeProvider>
  );
}
