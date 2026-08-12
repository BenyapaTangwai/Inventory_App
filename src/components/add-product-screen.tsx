import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";

// Color Palette matching Owen Shop theme
const C = {
  bg: "#0a0a0a",
  surface: "#151515",
  surfaceCard: "#1a1a1a",
  border: "#222222",
  borderActive: "#ff4655",
  accent: "#ff4655",
  accentHover: "#e03e4d",
  textPrimary: "#ffffff",
  textSecondary: "#aaaaaa",
  textMuted: "#666666",
  success: "#22c55e",
  successBg: "#052e16",
  error: "#ef4444",
  errorBg: "#450a0a",
};

interface AddProductScreenProps {
  onBack?: () => void;
  onAddProduct: (productData: any) => Promise<void> | void;
}

// Preset skin image options for quick selection
const PRESET_IMAGES = [
  {
    name: "Vandal",
    url: "https://raw.githubusercontent.com/BenyapaTangwai/Inventory_App/main/image_Product/Phaseguard_Vandal.webp",
  },
  {
    name: "CYRAX",
    url: "https://raw.githubusercontent.com/BenyapaTangwai/Inventory_App/main/image_Product/CYRAX_Vandal.webp",
  },
  {
    name: "Reaver",
    url: "https://raw.githubusercontent.com/BenyapaTangwai/Inventory_App/main/image_Product/Reaver_Vandal.webp",
  },
];

export default function AddProductScreen({ onBack, onAddProduct }: AddProductScreenProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [vp, setVp] = useState("");
  const [stock, setStock] = useState("10");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("Riot Games");
  const [location, setLocation] = useState("Owen Store");
  const [sizes, setSizes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [isEditionDropdownOpen, setIsEditionDropdownOpen] = useState(false);
  const editionOptions = ["SELECT EDITION", "Deluxe", "Exclusive", "Premium", "Standard", "Ultra", "VCT"];

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const gunOptions = ["SELECT GUN", "Ares", "Bucky", "Bulldog", "Classic", "Frenzy", "Ghost", "Guardian", "Judge", "Marshal", "Melee", "Odin", "Operator", "Outlaw", "Phantom", "Sheriff", "Shorty", "Spectre", "Stinger", "Vandal"];

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg("กรุณากรอกชื่อสินค้า (Product Name)");
      return;
    }
    if (!price.trim()) {
      setErrorMsg("กรุณากรอกราคาสินค้า (Price THB)");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const productPayload = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        price_thb: parseFloat(price) || 0,
        vp: parseInt(vp, 10) || 0,
        vp_price: parseInt(vp, 10) || 0,
        stock: parseInt(stock, 10) || 0,
        type: category.trim() || "Vandal",
        category_name: category.trim() || "Vandal",
        category: category.trim() || "Vandal",
        brand: brand.trim(),
        location: location.trim(),
        sizes: sizes.trim(),
        badge: sizes.trim(),
        badge_status: sizes.trim(),
        image_url: imageUrl.trim() || PRESET_IMAGES[0].url,
        image: imageUrl.trim() || PRESET_IMAGES[0].url,
        tagBg: "#2a0a0e",
        tagText: "#ff6b77",
      };

      await onAddProduct(productPayload);

      setSuccessMsg("เพิ่มสินค้าสำเร็จแล้ว! (Product added successfully)");
      // Clear form
      setName("");
      setDescription("");
      setPrice("");
      setVp("");
      setImageUrl("");
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Sub Header / Title Bar ── */}
      <View style={styles.subHeader}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleBox}>
          <Text style={styles.headerTitle}>Add Product</Text>
          <Text style={styles.headerSub}>เพิ่มรายการสินค้าใหม่เข้าสู่คลัง Owen Shop</Text>
        </View>
      </View>

      {/* ── Messages Alert ── */}
      {successMsg && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ {successMsg}</Text>
        </View>
      )}
      {errorMsg && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
        </View>
      )}

      {/* ── Form Card ── */}
      <View style={styles.formCard}>
        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "name" && styles.inputFocused,
            ]}
            placeholder="Enter product name (เช่น Prime Vandal)"
            placeholderTextColor={C.textMuted}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              focusedField === "description" && styles.inputFocused,
            ]}
            placeholder="Enter description"
            placeholderTextColor={C.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            onFocus={() => setFocusedField("description")}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* Row: Price & VP Price */}
        <View style={styles.row}>
          {/* Price THB */}
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>
              Price (THB) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "price" && styles.inputFocused,
              ]}
              placeholder="Enter price (e.g. 625)"
              placeholderTextColor={C.textMuted}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              onFocus={() => setFocusedField("price")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* VP Price */}
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>VP Price</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "vp" && styles.inputFocused,
              ]}
              placeholder="Enter VP (e.g. 2175)"
              placeholderTextColor={C.textMuted}
              value={vp}
              onChangeText={setVp}
              keyboardType="numeric"
              onFocus={() => setFocusedField("vp")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Row: Stock & Category */}
        <View style={[styles.row, { zIndex: isCategoryDropdownOpen ? 10 : 1 }]}>
          {/* Stock */}
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "stock" && styles.inputFocused,
              ]}
              placeholder="Enter stock quantity"
              placeholderTextColor={C.textMuted}
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
              onFocus={() => setFocusedField("stock")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Category */}
          <View style={[styles.fieldGroup, { flex: 1, zIndex: isCategoryDropdownOpen ? 10 : 1 }]}>
            <Text style={[styles.label, { color: C.accent, textTransform: 'uppercase' }]}>GUN TYPE</Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.dropdownHeader,
                isCategoryDropdownOpen && styles.inputFocused,
              ]}
              onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              activeOpacity={0.8}
            >
              <Text style={{ color: category ? C.textPrimary : C.textPrimary, fontSize: 14 }}>
                {category || "SELECT GUN"}
              </Text>
              <Text style={{ color: C.textPrimary, fontSize: 12 }}>{isCategoryDropdownOpen ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {isCategoryDropdownOpen && (
              <View style={[styles.dropdownList, { width: '100%' }]}>
                <ScrollView style={{ maxHeight: 250 }} nestedScrollEnabled={true}>
                  {gunOptions.map((option) => {
                    const isActive = (category || "SELECT GUN") === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownItem,
                          isActive && styles.dropdownItemActive
                        ]}
                        onPress={() => {
                          setCategory(option === "SELECT GUN" ? "" : option);
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          isActive && styles.dropdownItemTextActive
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Row: Brand & Location */}
        <View style={styles.row}>
          {/* Brand */}
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "brand" && styles.inputFocused,
              ]}
              placeholder="Enter brand"
              placeholderTextColor={C.textMuted}
              value={brand}
              onChangeText={setBrand}
              onFocus={() => setFocusedField("brand")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* Location */}
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === "location" && styles.inputFocused,
              ]}
              placeholder="Enter location"
              placeholderTextColor={C.textMuted}
              value={location}
              onChangeText={setLocation}
              onFocus={() => setFocusedField("location")}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        {/* Sizes / Badge */}
        <View style={[styles.fieldGroup, { zIndex: isEditionDropdownOpen ? 10 : 1 }]}>
          <Text style={[styles.label, { color: C.accent, textTransform: 'uppercase' }]}>EDITION</Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dropdownHeader,
              isEditionDropdownOpen && styles.inputFocused,
            ]}
            onPress={() => setIsEditionDropdownOpen(!isEditionDropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={{ color: sizes ? C.textPrimary : C.textPrimary, fontSize: 14 }}>
              {sizes || "SELECT EDITION"}
            </Text>
            <Text style={{ color: C.textPrimary, fontSize: 12 }}>{isEditionDropdownOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {isEditionDropdownOpen && (
            <View style={styles.dropdownList}>
              {editionOptions.map((option) => {
                const isActive = (sizes || "SELECT EDITION") === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      isActive && styles.dropdownItemActive
                    ]}
                    onPress={() => {
                      setSizes(option === "SELECT EDITION" ? "" : option);
                      setIsEditionDropdownOpen(false);
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      isActive && styles.dropdownItemTextActive
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Image URL */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === "imageUrl" && styles.inputFocused,
            ]}
            placeholder="Enter image URL (https://...)"
            placeholderTextColor={C.textMuted}
            value={imageUrl}
            onChangeText={(text) => {
              setImageUrl(text);
              setImgError(false);
            }}
            onFocus={() => setFocusedField("imageUrl")}
            onBlur={() => setFocusedField(null)}
          />

          {/* Preset image picker chips */}
          <Text style={styles.presetTitle}>หรือเลือกรูปตัวอย่างจากระบบ:</Text>
          <View style={styles.presetRow}>
            {PRESET_IMAGES.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.presetChip,
                  imageUrl === item.url && styles.presetChipActive,
                ]}
                onPress={() => {
                  setImageUrl(item.url);
                  setImgError(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    imageUrl === item.url && styles.presetChipTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Image Preview if URL provided */}
          {imageUrl ? (
            <View style={styles.imagePreviewBox}>
              {!imgError ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.imagePreview}
                  resizeMode="contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Text style={{ color: C.textMuted }}>No Image Available</Text>
              )}
            </View>
          ) : null}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitBtnText}>+ Add Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  } as ViewStyle,
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  } as ViewStyle,

  // Sub Header
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  } as ViewStyle,
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  backArrow: {
    color: C.accent,
    fontSize: 18,
    fontWeight: "bold",
  } as TextStyle,
  titleBox: {
    flex: 1,
  } as ViewStyle,
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: 0.3,
  } as TextStyle,
  headerSub: {
    fontSize: 11,
    color: C.textSecondary,
    marginTop: 2,
  } as TextStyle,

  // Banners
  successBanner: {
    backgroundColor: C.successBg,
    borderColor: C.success,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  } as ViewStyle,
  successText: {
    color: C.success,
    fontSize: 13,
    fontWeight: "600",
  } as TextStyle,
  errorBanner: {
    backgroundColor: C.errorBg,
    borderColor: C.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  } as ViewStyle,
  errorText: {
    color: C.error,
    fontSize: 13,
    fontWeight: "600",
  } as TextStyle,

  // Form Card
  formCard: {
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 18,
    gap: 14,
  } as ViewStyle,
  fieldGroup: {
    gap: 6,
  } as ViewStyle,
  row: {
    flexDirection: "row",
    gap: 12,
  } as ViewStyle,
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textSecondary,
  } as TextStyle,
  required: {
    color: C.accent,
  } as TextStyle,

  input: {
    backgroundColor: C.surfaceCard,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: C.textPrimary,
    fontSize: 14,
  } as ViewStyle,
  inputFocused: {
    borderColor: C.accent,
    backgroundColor: "#1f1013",
  } as ViewStyle,
  textArea: {
    height: 72,
    textAlignVertical: "top",
  } as ViewStyle,

  // Presets
  presetTitle: {
    fontSize: 11,
    color: C.textMuted,
    marginTop: 4,
  } as TextStyle,
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  } as ViewStyle,
  presetChip: {
    backgroundColor: C.surfaceCard,
    borderColor: C.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  } as ViewStyle,
  presetChipActive: {
    borderColor: C.accent,
    backgroundColor: "#2a0a0e",
  } as ViewStyle,
  presetChipText: {
    fontSize: 11,
    color: C.textSecondary,
  } as TextStyle,
  presetChipTextActive: {
    color: C.accent,
    fontWeight: "700",
  } as TextStyle,

  // Image Preview
  imagePreviewBox: {
    marginTop: 8,
    height: 110,
    backgroundColor: "#100507",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  } as ViewStyle,
  imagePreview: {
    width: "100%",
    height: "100%",
  } as ImageStyle,

  // Submit Button
  submitBtn: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  } as ViewStyle,
  submitBtnDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  submitBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  } as TextStyle,

  // Dropdown
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  dropdownList: {
    position: 'absolute',
    top: 66,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: C.accent,
    zIndex: 20,
    elevation: 5,
  } as ViewStyle,
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  } as ViewStyle,
  dropdownItemActive: {
    backgroundColor: "#3b82f6",
  } as ViewStyle,
  dropdownItemText: {
    color: "#ffffff",
    fontSize: 14,
  } as TextStyle,
  dropdownItemTextActive: {
    color: "#ffffff",
  } as TextStyle,
});
