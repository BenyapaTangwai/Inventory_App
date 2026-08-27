import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useAppTheme } from "@/theme/theme-context";
import { OrdersIcon, CartIcon, CheckIcon, SearchIcon } from "@/components/tab-icons";

const DARK_C = {
  bg: "#0a0a0c",
  surface: "#121215",
  surfaceCard: "#18181c",
  surfaceInput: "#1c1c22",
  border: "#24242e",
  borderLight: "#32323e",
  accent: "#ff4655",
  accentDim: "#cc2233",
  accentBg: "rgba(255, 70, 85, 0.12)",
  cyan: "#38bdf8",
  cyanBg: "rgba(56, 189, 248, 0.12)",
  green: "#22c55e",
  greenBg: "rgba(34, 197, 94, 0.14)",
  amber: "#f59e0b",
  amberBg: "rgba(245, 158, 11, 0.14)",
  purple: "#a855f7",
  purpleBg: "rgba(168, 85, 247, 0.12)",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted: "#777788",
  placeholder: "#555566",
  shadow: "#000000",
};

const LIGHT_C = {
  bg: "#f2f2f5",
  surface: "#ffffff",
  surfaceCard: "#f8f9fa",
  surfaceInput: "#f0f2f5",
  border: "#e2e2e8",
  borderLight: "#d0d0d8",
  accent: "#ff4655",
  accentDim: "#cc2233",
  accentBg: "rgba(255, 70, 85, 0.08)",
  cyan: "#0284c7",
  cyanBg: "rgba(2, 132, 199, 0.10)",
  green: "#16a34a",
  greenBg: "rgba(22, 163, 74, 0.10)",
  amber: "#d97706",
  amberBg: "rgba(217, 119, 6, 0.10)",
  purple: "#7c3aed",
  purpleBg: "rgba(124, 58, 237, 0.10)",
  textPrimary: "#111111",
  textSecondary: "#5c5c66",
  textMuted: "#8a8a94",
  placeholder: "#9a9aa4",
  shadow: "#d0d0d8",
};

type Palette = typeof DARK_C;

export interface OrderItem {
  id: number;
  name: string;
  type?: string;
  vp?: number;
  price: number;
  quantity: number;
  image_url?: string;
}

export type OrderStatus = "Preparing Model" | "Shipping" | "Completed" | "Cancelled";

export interface Order {
  order_id: number;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  payment_method: string;
  total_amount: number;
  total_vp: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
}

interface OrdersScreenProps {
  skins: any[];
  userRole?: string;
  currentUser?: any;
  apiCall: (endpoint: string, options?: any, role?: string) => Promise<any>;
  onRefreshProducts?: () => void;
}

const SAMPLE_ORDERS: Order[] = [
  {
    order_id: 101,
    order_number: "VAL-89421",
    customer_name: "Nyxpaszin",
    customer_email: "mikukung19@gmail.com",
    shipping_address: "Asia Pacific (AP) - Nyx#BENTO",
    payment_method: "PromptPay QR",
    total_amount: 625,
    total_vp: 2375,
    status: "Preparing Model",
    created_at: "2026-08-26 21:35:00",
    items: [
      {
        id: 4,
        name: "Kuronami Vandal",
        type: "Vandal",
        vp: 2375,
        price: 625,
        quantity: 1,
        image_url:
          "https://static.wikia.nocookie.net/valorant/images/2/2e/Kuronami_Vandal.png/revision/latest?cb=20240109154323",
      },
    ],
  },
  {
    order_id: 102,
    order_number: "VAL-74190",
    customer_name: "Bento",
    customer_email: "bento.val@gmail.com",
    shipping_address: "Thailand - Bento#2549",
    payment_method: "Credit Card",
    total_amount: 1125,
    total_vp: 3650,
    status: "Shipping",
    created_at: "2026-08-26 22:10:00",
    items: [
      {
        id: 2,
        name: "Reaver Vandal",
        type: "Vandal",
        vp: 1175,
        price: 500,
        quantity: 1,
        image_url:
          "https://github.com/BenyapaTangwai/Inventory_App/raw/main/image_Product/Reaver_Vandal.webp",
      },
      {
        id: 5,
        name: "Neo Frontier Phantom",
        type: "Phantom",
        vp: 2175,
        price: 625,
        quantity: 1,
        image_url:
          "https://media.valorant-api.com/weaponskinlevels/814fb822-4585-c9fe-85b4-bf8157646ae7/displayicon.png",
      },
    ],
  },
];

const PAYMENT_METHODS = [
  { id: "PromptPay", label: "PromptPay QR", fee: "0%" },
  { id: "CreditCard", label: "Credit Card", fee: "0%" },
  { id: "TrueMoney", label: "TrueMoney Wallet", fee: "0%" },
  { id: "VPWallet", label: "VP Direct Pay", fee: "0%" },
];

export default function OrdersScreen({
  skins,
  userRole = "user",
  currentUser,
  apiCall,
  onRefreshProducts,
}: OrdersScreenProps) {
  const { mode } = useAppTheme();
  const C = mode === "dark" ? DARK_C : LIGHT_C;
  const styles = getStyles(C);

  const [activeSubTab, setActiveSubTab] = useState<"placeOrder" | "history">(
    userRole === "admin" ? "history" : "placeOrder"
  );

  // Sync if role changes
  useEffect(() => {
    if (userRole === "admin") {
      setActiveSubTab("history");
    }
  }, [userRole]);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Cart State for Placing Order
  const [cart, setCart] = useState<{ [productId: number]: number }>({});
  const [customerName, setCustomerName] = useState<string>(
    currentUser?.username || "Nyxpaszin"
  );
  const [customerEmail, setCustomerEmail] = useState<string>(
    currentUser?.email || "mikukung19@gmail.com"
  );
  const [customerIGN, setCustomerIGN] = useState<string>("Chonburi,Thailand");
  const [paymentMethod, setPaymentMethod] = useState<string>("PromptPay");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Fetch orders from server
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await apiCall("/orders", {}, userRole);
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (e: any) {
      console.warn("Could not fetch remote orders, using local state:", e.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sync user info if changed
  useEffect(() => {
    if (currentUser?.username) {
      setCustomerName(currentUser.username);
    }
    if (currentUser?.email) {
      setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Cart operations
  const handleAddToCart = (product: any) => {
    const currentQty = cart[product.id] || 0;
    const availableStock = Number(product.stock || 0);
    if (availableStock <= 0) {
      alert("This item is currently out of stock.");
      return;
    }
    if (currentQty >= availableStock) {
      alert(`Cannot add more. Only ${availableStock} in stock.`);
      return;
    }
    setCart((prev) => ({
      ...prev,
      [product.id]: currentQty + 1,
    }));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] > 1) {
        updated[productId] -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Selected Cart Items calculation
  const cartItems: OrderItem[] = Object.keys(cart).reduce<OrderItem[]>((acc, idStr) => {
    const id = Number(idStr);
    const product = skins.find((s) => s.id === id);
    if (product) {
      acc.push({
        id: product.id,
        name: product.name,
        type: product.type || product.category_name || "Skin",
        vp: Number(product.vp || 0),
        price: Number(product.price || 0),
        quantity: cart[id],
        image_url: product.image_url || product.image || "",
      });
    }
    return acc;
  }, []);

  const cartTotalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartTotalVP = cartItems.reduce(
    (sum, item) => sum + (item.vp || 0) * item.quantity,
    0
  );
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Submit Order (Checkout All Cart Items)
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setErrorMsg("Please add at least one product to your cart.");
      return;
    }
    if (!customerName.trim()) {
      setErrorMsg("Please enter Customer Name / Riot IGN.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const orderPayload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim() || undefined,
        shipping_address: customerIGN.trim() || "In-Game Direct Delivery",
        payment_method: paymentMethod,
        total_amount: cartTotalAmount,
        total_vp: cartTotalVP,
        status: "Preparing Model" as OrderStatus,
        items: cartItems,
      };

      let createdOrder: any = null;
      try {
        createdOrder = await apiCall(
          "/orders",
          {
            method: "POST",
            body: JSON.stringify(orderPayload),
          },
          userRole
        );
      } catch (err: any) {
        console.warn("Server order failed, using local order:", err.message);
        createdOrder = {
          order_id: Date.now(),
          order_number: `VAL-${Date.now().toString().slice(-5)}`,
          ...orderPayload,
          created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
        };
      }

      const newOrderObj: Order = {
        order_id: createdOrder.order_id || Date.now(),
        order_number: createdOrder.order_number || `VAL-${Date.now().toString().slice(-5)}`,
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        shipping_address: customerIGN.trim(),
        payment_method: paymentMethod,
        total_amount: cartTotalAmount,
        total_vp: cartTotalVP,
        status: "Preparing Model",
        items: cartItems,
        created_at: createdOrder.created_at || new Date().toISOString().replace("T", " ").substring(0, 19),
      };

      setOrders((prev) => [newOrderObj, ...prev]);
      setCart({});
      setSuccessToast(`Order #${newOrderObj.order_number} Placed Successfully!`);

      if (onRefreshProducts) {
        onRefreshProducts();
      }

      setTimeout(() => {
        setSuccessToast(null);
        setActiveSubTab("history");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Admin status update (Preparing Model -> Shipping -> Completed -> Cancelled)
  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await apiCall(
        `/orders/${orderId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        userRole
      ).catch(() => {});

      setOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e: any) {
      console.warn("Failed to update status:", e.message);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const currentUsername = currentUser?.username?.toLowerCase();
    
    // Status Filter
    let matchesStatus = true;
    if (statusFilter === "My Orders" && currentUsername) {
      matchesStatus = o.customer_name.toLowerCase() === currentUsername;
    } else if (statusFilter !== "All") {
      matchesStatus = o.status.toLowerCase() === statusFilter.toLowerCase();
    }

    // Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.order_number.toLowerCase().includes(query) ||
      o.customer_name.toLowerCase().includes(query) ||
      (o.shipping_address && o.shipping_address.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  const totalSpentAll = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  // Helper for status colors
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Completed":
        return { text: C.green, bg: C.greenBg, label: "Delivered / Completed" };
      case "Shipping":
        return { text: C.cyan, bg: C.cyanBg, label: "In Delivery / Shipping" };
      case "Preparing Model":
        return { text: C.amber, bg: C.amberBg, label: "Preparing Model" };
      case "Cancelled":
        return { text: C.accent, bg: C.accentBg, label: "Cancelled" };
      default:
        return { text: C.textMuted, bg: C.surfaceInput, label: status };
    }
  };

  // Helper for tracking steps
  const getStepProgress = (status: OrderStatus) => {
    if (status === "Cancelled") return 0;
    if (status === "Preparing Model") return 1;
    if (status === "Shipping") return 2;
    if (status === "Completed") return 3;
    return 1;
  };

  return (
    <View style={styles.container}>
      {/* ── Success Toast Modal ── */}
      <Modal visible={!!successToast} transparent animationType="fade">
        <View style={styles.toastOverlay}>
          <View style={styles.toastCard}>
            <View style={styles.toastIconCircle}>
              <CheckIcon color="#22c55e" size={32} />
            </View>
            <Text style={styles.toastTitle}>Success!</Text>
            <Text style={styles.toastMessage}>{successToast}</Text>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Section ── */}
        <View style={styles.headerRow}>
          <View>
            <View style={styles.titleWithIcon}>
              <OrdersIcon color={C.accent} size={24} />
              <Text style={styles.headerTitle}>
                {userRole === "admin" ? "Orders Management" : "Orders & Checkout"}
              </Text>
            </View>
            <Text style={styles.headerSubtitle}>
              {userRole === "admin"
                ? "Check customer orders & update model crafting status"
                : "Order Valorant models, manage cart & track status live"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={fetchOrders}
            activeOpacity={0.7}
          >
            <Text style={styles.refreshBtnText}>↻ Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* ── Metric Summary Badges ── */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Orders</Text>
            <Text style={styles.metricValue}>{orders.length}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Volume</Text>
            <Text style={[styles.metricValue, { color: C.accent }]}>
              ฿{totalSpentAll.toLocaleString()}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              {userRole === "admin" ? "In Progress" : "Cart Items"}
            </Text>
            <Text style={[styles.metricValue, { color: C.cyan }]}>
              {userRole === "admin"
                ? orders.filter(
                    (o) =>
                      o.status === "Preparing Model" || o.status === "Shipping"
                  ).length
                : totalItemCount}
            </Text>
          </View>
        </View>

        {/* ── Sub Tabs Switcher: Only for Users (Admins directly see Order History) ── */}
        {userRole !== "admin" && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeSubTab === "placeOrder" && styles.tabBtnActive,
              ]}
              onPress={() => setActiveSubTab("placeOrder")}
              activeOpacity={0.8}
            >
              <CartIcon
                color={activeSubTab === "placeOrder" ? C.accent : C.textMuted}
                size={18}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeSubTab === "placeOrder" && styles.tabBtnTextActive,
                ]}
              >
                Order Now {totalItemCount > 0 ? `(${totalItemCount})` : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeSubTab === "history" && styles.tabBtnActive,
              ]}
              onPress={() => {
                setActiveSubTab("history");
                fetchOrders();
              }}
              activeOpacity={0.8}
            >
              <OrdersIcon
                color={activeSubTab === "history" ? C.accent : C.textMuted}
                size={18}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeSubTab === "history" && styles.tabBtnTextActive,
                ]}
              >
                Order History ({orders.length})
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── TAB 1: PLACE NEW ORDER & CART (USERS ONLY) ── */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {userRole !== "admin" && activeSubTab === "placeOrder" && (
          <View style={styles.sectionWrapper}>
            {/* 1. Available Products Catalog */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>1. Select Valorant Models</Text>
              <Text style={styles.sectionHeadingSub}>
                Tap [+ Add to Cart] to choose multiple items
              </Text>
            </View>

            <View style={styles.productsGrid}>
              {skins.map((skin) => {
                const inCartQty = cart[skin.id] || 0;
                const stock = Number(skin.stock || 0);
                const isOutOfStock = stock <= 0;

                return (
                  <View
                    key={skin.id}
                    style={[
                      styles.productCard,
                      inCartQty > 0 && styles.productCardSelected,
                    ]}
                  >
                    <View style={styles.imageContainer}>
                      {skin.image_url || skin.image ? (
                        <Image
                          source={{ uri: skin.image_url || skin.image }}
                          style={styles.skinImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Text style={styles.placeholderText}>NO IMAGE</Text>
                        </View>
                      )}
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>
                          {skin.type || skin.category_name || "Skin"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.productDetails}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {skin.name}
                      </Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.productPrice}>
                          ฿{Number(skin.price || 0).toLocaleString()}
                        </Text>
                        <Text style={styles.productVp}>{skin.vp || 0} VP</Text>
                      </View>

                      <View style={styles.stockRow}>
                        <Text
                          style={[
                            styles.stockText,
                            isOutOfStock && styles.outOfStockText,
                          ]}
                        >
                          {isOutOfStock ? "Out of Stock" : `Stock: ${stock}`}
                        </Text>
                      </View>

                      {/* Add to Cart / Stepper */}
                      {inCartQty === 0 ? (
                        <TouchableOpacity
                          style={[
                            styles.addToCartBtn,
                            isOutOfStock && styles.disabledBtn,
                          ]}
                          onPress={() => handleAddToCart(skin)}
                          disabled={isOutOfStock}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.addToCartBtnText}>
                            {isOutOfStock ? "Unavailable" : "+ Add to Cart"}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.quantityStepper}>
                          <TouchableOpacity
                            style={styles.stepperBtn}
                            onPress={() => handleRemoveFromCart(skin.id)}
                          >
                            <Text style={styles.stepperBtnText}>-</Text>
                          </TouchableOpacity>
                          <Text style={styles.stepperQtyText}>{inCartQty}</Text>
                          <TouchableOpacity
                            style={[
                              styles.stepperBtn,
                              inCartQty >= stock && styles.disabledStepperBtn,
                            ]}
                            onPress={() => handleAddToCart(skin)}
                            disabled={inCartQty >= stock}
                          >
                            <Text style={styles.stepperBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* 2. Customer & Delivery Information */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionHeading}>2. Delivery & Customer Details</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Customer / Account Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Bento"
                  placeholderTextColor={C.placeholder}
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. user@example.com"
                  placeholderTextColor={C.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Riot In-Game ID / Delivery Address *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. RiotID#AP1 or Shipping Address"
                  placeholderTextColor={C.placeholder}
                  value={customerIGN}
                  onChangeText={setCustomerIGN}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Payment Method</Text>
                <View style={styles.paymentGrid}>
                  {PAYMENT_METHODS.map((pm) => {
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <TouchableOpacity
                        key={pm.id}
                        style={[
                          styles.paymentMethodCard,
                          isSelected && styles.paymentMethodSelected,
                        ]}
                        onPress={() => setPaymentMethod(pm.id)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.paymentMethodText,
                            isSelected && styles.paymentMethodTextSelected,
                          ]}
                        >
                          {pm.label}
                        </Text>
                        <Text style={styles.paymentFeeText}>Fee: {pm.fee}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* 3. Order Summary & Checkout */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Text style={styles.sectionHeading}>3. Cart Summary ({totalItemCount} items)</Text>
              {cartItems.length > 0 && (
                <TouchableOpacity onPress={handleClearCart}>
                  <Text style={styles.clearCartText}>Clear Cart</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.summaryCard}>
              {cartItems.length === 0 ? (
                <View style={styles.emptyCartBox}>
                  <CartIcon color={C.textMuted} size={36} />
                  <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
                  <Text style={styles.emptyCartSub}>
                    Select weapon models from the catalog above to build your order.
                  </Text>
                </View>
              ) : (
                <View>
                  <View style={styles.cartItemsList}>
                    {cartItems.map((item) => (
                      <View key={item.id} style={styles.cartItemRow}>
                        <View style={styles.cartItemLeft}>
                          {item.image_url ? (
                            <Image
                              source={{ uri: item.image_url }}
                              style={styles.cartThumb}
                              resizeMode="contain"
                            />
                          ) : (
                            <View style={styles.cartThumbPlaceholder} />
                          )}
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cartItemName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.cartItemMeta}>
                              Qty: {item.quantity} × ฿{item.price.toLocaleString()} ({item.vp} VP)
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.cartItemTotal}>
                          ฿{(item.price * item.quantity).toLocaleString()}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.summaryDivider} />

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total VP Cost:</Text>
                    <Text style={styles.summaryValueVP}>
                      {cartTotalVP.toLocaleString()} VP
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Model Delivery:</Text>
                    <Text style={styles.freeDeliveryText}>FREE / DIRECT</Text>
                  </View>

                  <View style={[styles.summaryRow, { marginTop: 6 }]}>
                    <Text style={styles.totalLabel}>Grand Total (THB):</Text>
                    <Text style={styles.totalValue}>
                      ฿{cartTotalAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}

              {errorMsg && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.placeOrderBtn,
                  (cartItems.length === 0 || submitting) && styles.disabledBtn,
                ]}
                onPress={handlePlaceOrder}
                disabled={cartItems.length === 0 || submitting}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <View style={styles.btnContentRow}>
                    <CheckIcon color="#ffffff" size={20} />
                    <Text style={styles.placeOrderBtnText}>
                      Place Order for {totalItemCount} Items (฿{cartTotalAmount.toLocaleString()})
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* ── TAB 2: ORDER HISTORY & MANAGEMENT ── */}
        {/* ══════════════════════════════════════════════════════════════ */}
        {(userRole === "admin" || activeSubTab === "history") && (
          <View style={styles.sectionWrapper}>
            {/* Search & Filter Bar */}
            <View style={styles.filterRow}>
              <View style={styles.searchBar}>
                <SearchIcon color={C.textMuted} size={18} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by Order # or Customer..."
                  placeholderTextColor={C.placeholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Status Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
              contentContainerStyle={styles.chipContainer}
            >
              {[
                "All",
                ...(currentUser?.username ? ["My Orders"] : []),
                "Preparing Model",
                "Shipping",
                "Completed",
                "Cancelled",
              ].map((status) => {
                const isSelected = statusFilter === status;
                return (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      isSelected && styles.filterChipActive,
                    ]}
                    onPress={() => setStatusFilter(status)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Orders List */}
            {loadingOrders ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={C.accent} size="large" />
                <Text style={styles.loadingText}>Loading Orders...</Text>
              </View>
            ) : filteredOrders.length === 0 ? (
              <View style={styles.emptyOrdersBox}>
                <OrdersIcon color={C.textMuted} size={48} />
                <Text style={styles.emptyOrdersTitle}>No Orders Found</Text>
                <Text style={styles.emptyOrdersSub}>
                  No orders match your filter criteria.
                </Text>
                <TouchableOpacity
                  style={styles.goToOrderBtn}
                  onPress={() => setActiveSubTab("placeOrder")}
                >
                  <Text style={styles.goToOrderBtnText}>+ Place New Order</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusColor(order.status);
                  const stepIndex = getStepProgress(order.status);
                  const isMyOrder =
                    currentUser?.username &&
                    order.customer_name.toLowerCase() ===
                      currentUser.username.toLowerCase();

                  return (
                    <View key={order.order_id} style={styles.orderCard}>
                      {/* Order Card Header */}
                      <View style={styles.orderCardHeader}>
                        <View>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <Text style={styles.orderNumber}>
                              #{order.order_number}
                            </Text>
                            {isMyOrder && (
                              <View style={styles.myOrderBadge}>
                                <Text style={styles.myOrderBadgeText}>My Order</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.orderDate}>
                            {order.created_at || "Recent"}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusInfo.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: statusInfo.text },
                            ]}
                          >
                            {order.status}
                          </Text>
                        </View>
                      </View>

                      {/* Live Tracking Progress Bar */}
                      {order.status !== "Cancelled" && (
                        <View style={styles.trackingContainer}>
                          <View style={styles.trackingBarBackground}>
                            <View
                              style={[
                                styles.trackingBarProgress,
                                {
                                  width:
                                    stepIndex === 1
                                      ? "33%"
                                      : stepIndex === 2
                                      ? "66%"
                                      : "100%",
                                  backgroundColor:
                                    stepIndex === 3 ? C.green : C.amber,
                                },
                              ]}
                            />
                          </View>
                          <View style={styles.trackingStepsRow}>
                            <View style={styles.trackingStep}>
                              <View
                                style={[
                                  styles.stepDot,
                                  stepIndex >= 1 && styles.stepDotActive,
                                ]}
                              />
                              <Text
                                style={[
                                  styles.stepLabel,
                                  stepIndex >= 1 && styles.stepLabelActive,
                                ]}
                              >
                                Placed
                              </Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View
                                style={[
                                  styles.stepDot,
                                  stepIndex >= 1 && styles.stepDotActive,
                                ]}
                              />
                              <Text
                                style={[
                                  styles.stepLabel,
                                  stepIndex >= 1 && styles.stepLabelActive,
                                ]}
                              >
                                Preparing
                              </Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View
                                style={[
                                  styles.stepDot,
                                  stepIndex >= 2 && styles.stepDotActive,
                                ]}
                              />
                              <Text
                                style={[
                                  styles.stepLabel,
                                  stepIndex >= 2 && styles.stepLabelActive,
                                ]}
                              >
                                Shipping
                              </Text>
                            </View>
                            <View style={styles.trackingStep}>
                              <View
                                style={[
                                  styles.stepDot,
                                  stepIndex >= 3 && styles.stepDotCompleted,
                                ]}
                              />
                              <Text
                                style={[
                                  styles.stepLabel,
                                  stepIndex >= 3 && styles.stepLabelCompleted,
                                ]}
                              >
                                Completed
                              </Text>
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Customer Info */}
                      <View style={styles.orderInfoBox}>
                        <View style={styles.orderInfoLine}>
                          <Text style={styles.orderInfoKey}>Customer:</Text>
                          <Text style={styles.orderInfoVal}>
                            {order.customer_name}
                          </Text>
                        </View>
                        {order.shipping_address && (
                          <View style={styles.orderInfoLine}>
                            <Text style={styles.orderInfoKey}>Delivery / IGN:</Text>
                            <Text style={styles.orderInfoVal}>
                              {order.shipping_address}
                            </Text>
                          </View>
                        )}
                        <View style={styles.orderInfoLine}>
                          <Text style={styles.orderInfoKey}>Payment:</Text>
                          <Text style={styles.orderInfoVal}>
                            {order.payment_method || "PromptPay"}
                          </Text>
                        </View>
                      </View>

                      {/* Items List */}
                      <View style={styles.orderItemsBox}>
                        {order.items &&
                          order.items.map((item, idx) => (
                            <View key={idx} style={styles.orderItemSnippet}>
                              {item.image_url ? (
                                <Image
                                  source={{ uri: item.image_url }}
                                  style={styles.itemSnippetImg}
                                  resizeMode="contain"
                                />
                              ) : (
                                <View style={styles.snippetPlaceholder} />
                              )}
                              <View style={{ flex: 1 }}>
                                <Text style={styles.itemSnippetName} numberOfLines={1}>
                                  {item.name}
                                </Text>
                                <Text style={styles.itemSnippetQty}>
                                  Qty: {item.quantity} • ฿{Number(item.price).toLocaleString()}
                                </Text>
                              </View>
                            </View>
                          ))}
                      </View>

                      {/* Order Footer & Admin Management Controls */}
                      <View style={styles.orderCardFooter}>
                        <View>
                          <Text style={styles.totalSpentLabel}>Total Amount:</Text>
                          <Text style={styles.totalSpentValue}>
                            ฿{Number(order.total_amount).toLocaleString()}
                            {order.total_vp ? ` (${order.total_vp} VP)` : ""}
                          </Text>
                        </View>

                        {/* Admin Action Buttons */}
                        {userRole === "admin" && (
                          <View style={styles.adminActionRow}>
                            {order.status !== "Preparing Model" && (
                              <TouchableOpacity
                                style={[styles.statusActionBtn, { backgroundColor: C.amberBg }]}
                                onPress={() =>
                                  handleUpdateStatus(order.order_id, "Preparing Model")
                                }
                              >
                                <Text style={[styles.statusActionText, { color: C.amber }]}>
                                  🔨 Crafting
                                </Text>
                              </TouchableOpacity>
                            )}
                            {order.status !== "Shipping" && (
                              <TouchableOpacity
                                style={[styles.statusActionBtn, { backgroundColor: C.cyanBg }]}
                                onPress={() =>
                                  handleUpdateStatus(order.order_id, "Shipping")
                                }
                              >
                                <Text style={[styles.statusActionText, { color: C.cyan }]}>
                                  🚚 Shipping
                                </Text>
                              </TouchableOpacity>
                            )}
                            {order.status !== "Completed" && (
                              <TouchableOpacity
                                style={[styles.statusActionBtn, { backgroundColor: C.greenBg }]}
                                onPress={() =>
                                  handleUpdateStatus(order.order_id, "Completed")
                                }
                              >
                                <Text style={[styles.statusActionText, { color: C.green }]}>
                                  ✓ Done
                                </Text>
                              </TouchableOpacity>
                            )}
                            {order.status !== "Cancelled" && (
                              <TouchableOpacity
                                style={[styles.statusActionBtn, { backgroundColor: C.accentBg }]}
                                onPress={() =>
                                  handleUpdateStatus(order.order_id, "Cancelled")
                                }
                              >
                                <Text style={[styles.statusActionText, { color: C.accent }]}>
                                  ✕
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
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
      marginBottom: 16,
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
    refreshBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: C.surfaceCard,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: C.border,
    },
    refreshBtnText: {
      fontSize: 12,
      fontWeight: "600",
      color: C.textSecondary,
    },
    metricsRow: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 18,
    },
    metricCard: {
      flex: 1,
      backgroundColor: C.surfaceCard,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: C.border,
    },
    metricLabel: {
      fontSize: 11,
      color: C.textMuted,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    metricValue: {
      fontSize: 18,
      fontWeight: "800",
      color: C.textPrimary,
      marginTop: 4,
    },
    tabContainer: {
      flexDirection: "row",
      backgroundColor: C.surfaceCard,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: C.border,
      marginBottom: 20,
    },
    tabBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 8,
      gap: 6,
    },
    tabBtnActive: {
      backgroundColor: C.surface,
      borderWidth: 1,
      borderColor: C.accent,
    },
    tabBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: C.textMuted,
    },
    tabBtnTextActive: {
      color: C.accent,
      fontWeight: "700",
    },
    sectionWrapper: {
      gap: 12,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 6,
    },
    sectionHeading: {
      fontSize: 16,
      fontWeight: "700",
      color: C.textPrimary,
    },
    sectionHeadingSub: {
      fontSize: 12,
      color: C.textMuted,
    },
    productsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    productCard: {
      width: "48%",
      backgroundColor: C.surfaceCard,
      borderRadius: 14,
      padding: 10,
      borderWidth: 1,
      borderColor: C.border,
    },
    productCardSelected: {
      borderColor: C.accent,
      backgroundColor: C.surface,
    },
    imageContainer: {
      width: "100%",
      height: 100,
      backgroundColor: C.surfaceInput,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    },
    skinImage: {
      width: "90%",
      height: "90%",
    },
    imagePlaceholder: {
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      fontSize: 10,
      color: C.textMuted,
      fontWeight: "600",
    },
    typeBadge: {
      position: "absolute",
      top: 6,
      left: 6,
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    typeBadgeText: {
      fontSize: 9,
      color: "#ffffff",
      fontWeight: "700",
      textTransform: "uppercase",
    },
    productDetails: {
      marginTop: 8,
      gap: 4,
    },
    productName: {
      fontSize: 13,
      fontWeight: "700",
      color: C.textPrimary,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    productPrice: {
      fontSize: 13,
      fontWeight: "800",
      color: C.cyan,
    },
    productVp: {
      fontSize: 11,
      fontWeight: "600",
      color: C.textMuted,
    },
    stockRow: {
      marginTop: 2,
    },
    stockText: {
      fontSize: 11,
      color: C.textMuted,
    },
    outOfStockText: {
      color: C.accent,
      fontWeight: "700",
    },
    addToCartBtn: {
      marginTop: 6,
      backgroundColor: C.accent,
      paddingVertical: 6,
      borderRadius: 6,
      alignItems: "center",
    },
    addToCartBtnText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#ffffff",
    },
    disabledBtn: {
      opacity: 0.45,
    },
    quantityStepper: {
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: C.surfaceInput,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    stepperBtn: {
      width: 26,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    disabledStepperBtn: {
      opacity: 0.3,
    },
    stepperBtnText: {
      fontSize: 14,
      fontWeight: "800",
      color: C.accent,
    },
    stepperQtyText: {
      fontSize: 12,
      fontWeight: "700",
      color: C.textPrimary,
    },
    formCard: {
      backgroundColor: C.surfaceCard,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: C.border,
      gap: 12,
    },
    inputGroup: {
      gap: 4,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: C.textSecondary,
    },
    textInput: {
      backgroundColor: C.surfaceInput,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: C.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      color: C.textPrimary,
      fontSize: 13,
    },
    paymentGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
    },
    paymentMethodCard: {
      width: "48%",
      backgroundColor: C.surfaceInput,
      borderRadius: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: C.border,
    },
    paymentMethodSelected: {
      borderColor: C.accent,
      backgroundColor: C.accentBg,
    },
    paymentMethodText: {
      fontSize: 12,
      fontWeight: "700",
      color: C.textSecondary,
    },
    paymentMethodTextSelected: {
      color: C.accent,
    },
    paymentFeeText: {
      fontSize: 10,
      color: C.textMuted,
      marginTop: 2,
    },
    summaryCard: {
      backgroundColor: C.surfaceCard,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: C.border,
      gap: 12,
    },
    clearCartText: {
      fontSize: 12,
      color: C.accent,
      fontWeight: "600",
    },
    emptyCartBox: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 20,
      gap: 6,
    },
    emptyCartTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: C.textPrimary,
      marginTop: 4,
    },
    emptyCartSub: {
      fontSize: 12,
      color: C.textMuted,
      textAlign: "center",
    },
    cartItemsList: {
      gap: 10,
    },
    cartItemRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cartItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    cartThumb: {
      width: 42,
      height: 32,
      backgroundColor: C.surfaceInput,
      borderRadius: 6,
    },
    cartThumbPlaceholder: {
      width: 42,
      height: 32,
      backgroundColor: C.surfaceInput,
      borderRadius: 6,
    },
    cartItemName: {
      fontSize: 13,
      fontWeight: "700",
      color: C.textPrimary,
    },
    cartItemMeta: {
      fontSize: 11,
      color: C.textMuted,
    },
    cartItemTotal: {
      fontSize: 13,
      fontWeight: "700",
      color: C.cyan,
      marginLeft: 8,
    },
    summaryDivider: {
      height: 1,
      backgroundColor: C.border,
      marginVertical: 4,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 2,
    },
    summaryLabel: {
      fontSize: 12,
      color: C.textMuted,
    },
    summaryValueVP: {
      fontSize: 12,
      fontWeight: "700",
      color: C.purple,
    },
    freeDeliveryText: {
      fontSize: 11,
      fontWeight: "700",
      color: C.green,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: "800",
      color: C.textPrimary,
    },
    totalValue: {
      fontSize: 18,
      fontWeight: "800",
      color: C.accent,
    },
    errorBox: {
      backgroundColor: "rgba(255, 70, 85, 0.12)",
      borderRadius: 8,
      padding: 10,
      borderWidth: 1,
      borderColor: C.accent,
    },
    errorText: {
      fontSize: 12,
      color: C.accent,
      fontWeight: "600",
    },
    placeOrderBtn: {
      backgroundColor: C.accent,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
    },
    btnContentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    placeOrderBtnText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#ffffff",
      letterSpacing: 0.3,
    },
    filterRow: {
      marginBottom: 10,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: C.surfaceCard,
      borderRadius: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: C.border,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 8,
      fontSize: 13,
      color: C.textPrimary,
    },
    chipScroll: {
      marginBottom: 14,
    },
    chipContainer: {
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      backgroundColor: C.surfaceCard,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: C.border,
    },
    filterChipActive: {
      backgroundColor: C.accentBg,
      borderColor: C.accent,
    },
    filterChipText: {
      fontSize: 12,
      fontWeight: "600",
      color: C.textMuted,
    },
    filterChipTextActive: {
      color: C.accent,
      fontWeight: "700",
    },
    loadingBox: {
      paddingVertical: 40,
      alignItems: "center",
      gap: 8,
    },
    loadingText: {
      fontSize: 13,
      color: C.textMuted,
    },
    emptyOrdersBox: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 50,
      gap: 8,
    },
    emptyOrdersTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: C.textPrimary,
      marginTop: 4,
    },
    emptyOrdersSub: {
      fontSize: 13,
      color: C.textMuted,
    },
    goToOrderBtn: {
      marginTop: 10,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: C.accent,
      borderRadius: 8,
    },
    goToOrderBtnText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#ffffff",
    },
    ordersList: {
      gap: 14,
    },
    orderCard: {
      backgroundColor: C.surfaceCard,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: C.border,
      gap: 10,
    },
    orderCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    orderNumber: {
      fontSize: 14,
      fontWeight: "800",
      color: C.textPrimary,
      letterSpacing: 0.5,
    },
    myOrderBadge: {
      backgroundColor: C.purpleBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: C.purple,
    },
    myOrderBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: C.purple,
    },
    orderDate: {
      fontSize: 11,
      color: C.textMuted,
      marginTop: 2,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusBadgeText: {
      fontSize: 11,
      fontWeight: "800",
      textTransform: "uppercase",
    },
    trackingContainer: {
      marginVertical: 4,
      paddingVertical: 4,
    },
    trackingBarBackground: {
      height: 4,
      backgroundColor: C.border,
      borderRadius: 2,
      overflow: "hidden",
      marginBottom: 6,
    },
    trackingBarProgress: {
      height: 4,
      borderRadius: 2,
    },
    trackingStepsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    trackingStep: {
      alignItems: "center",
      gap: 2,
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: C.borderLight,
    },
    stepDotActive: {
      backgroundColor: C.amber,
    },
    stepDotCompleted: {
      backgroundColor: C.green,
    },
    stepLabel: {
      fontSize: 10,
      color: C.textMuted,
    },
    stepLabelActive: {
      color: C.amber,
      fontWeight: "700",
    },
    stepLabelCompleted: {
      color: C.green,
      fontWeight: "700",
    },
    orderInfoBox: {
      backgroundColor: C.surfaceInput,
      borderRadius: 8,
      padding: 10,
      gap: 4,
    },
    orderInfoLine: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    orderInfoKey: {
      fontSize: 11,
      color: C.textMuted,
    },
    orderInfoVal: {
      fontSize: 11,
      fontWeight: "600",
      color: C.textPrimary,
    },
    orderItemsBox: {
      gap: 6,
    },
    orderItemSnippet: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    itemSnippetImg: {
      width: 36,
      height: 26,
      backgroundColor: C.surfaceInput,
      borderRadius: 4,
    },
    snippetPlaceholder: {
      width: 36,
      height: 26,
      backgroundColor: C.surfaceInput,
      borderRadius: 4,
    },
    itemSnippetName: {
      fontSize: 12,
      fontWeight: "700",
      color: C.textPrimary,
    },
    itemSnippetQty: {
      fontSize: 10,
      color: C.textMuted,
    },
    orderCardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingTop: 10,
      marginTop: 4,
    },
    totalSpentLabel: {
      fontSize: 11,
      color: C.textMuted,
    },
    totalSpentValue: {
      fontSize: 14,
      fontWeight: "800",
      color: C.accent,
    },
    adminActionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      justifyContent: "flex-end",
    },
    statusActionBtn: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusActionText: {
      fontSize: 10,
      fontWeight: "700",
    },
    toastOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.65)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    toastCard: {
      backgroundColor: C.surface,
      borderRadius: 18,
      padding: 24,
      alignItems: "center",
      borderWidth: 1,
      borderColor: C.green,
      width: "85%",
      maxWidth: 340,
      gap: 8,
    },
    toastIconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: C.greenBg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    toastTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: C.textPrimary,
    },
    toastMessage: {
      fontSize: 13,
      color: C.textSecondary,
      textAlign: "center",
    },
  });
