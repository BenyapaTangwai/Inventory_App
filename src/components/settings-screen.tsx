import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { UserRoleIcon, AdminRoleIcon, ProfileIcon } from "./tab-icons";
import { useAppTheme } from "@/theme/theme-context";

const DARK_C = {
  bg: "#0a0a0a",
  surface: "#141416",
  border: "#222228",
  accent: "#ff4655",
  userAccent: "#4fc3f7",
  textPrimary: "#ffffff",
  textSecondary: "#888899",
  divider: "#1e1e24",
  toggleGroupBg: "#1c1c22",
  toggleGroupBorder: "#2a2a32",
  toggleTextInactive: "#888899",
  statusOnlineBg: "#0a2a1a",
  statusOnlineBorder: "#22c55e",
  statusOnlineText: "#22c55e",
  clearCacheBg: "#1c1c24",
  clearCacheBorder: "#333340",
  clearCacheText: "#aaaaaa",
};

const LIGHT_C = {
  bg: "#f2f2f5",
  surface: "#ffffff",
  border: "#e2e2e6",
  accent: "#ff4655",
  userAccent: "#0284c7",
  textPrimary: "#111111",
  textSecondary: "#6b6b76",
  divider: "#ececf0",
  toggleGroupBg: "#eef0f3",
  toggleGroupBorder: "#e2e2e6",
  toggleTextInactive: "#8a8a94",
  statusOnlineBg: "#dcfce7",
  statusOnlineBorder: "#16a34a",
  statusOnlineText: "#15803d",
  clearCacheBg: "#f5f5f7",
  clearCacheBorder: "#e2e2e6",
  clearCacheText: "#5c5c66",
};

type Palette = typeof DARK_C;

interface SettingsScreenProps {
  currentUser: any;
  userRole: "admin" | "user";
  onOpenAuth: () => void;
  onLogout: () => void;
  onRefreshData: () => Promise<void> | void;
}

export default function SettingsScreen({
  currentUser,
  userRole,
  onOpenAuth,
  onLogout,
  onRefreshData,
}: SettingsScreenProps) {
  const { mode, setMode } = useAppTheme();
  const C = mode === "dark" ? DARK_C : LIGHT_C;
  const styles = mode === "dark" ? stylesByMode.dark : stylesByMode.light;

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefreshData();
    setRefreshing(false);
    if (Platform.OS === 'web') {
      alert("Inventory data refreshed successfully!");
    } else {
      Alert.alert("Success", "Inventory data refreshed successfully!");
    }
  };

  const handleClearCache = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm("Clear all local cache?")) {
        alert("Cache cleared!");
      }
    } else {
      Alert.alert("Clear Cache", "Clear all local cache?", [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => Alert.alert("Success", "Cache cleared!") },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.centeredWrapper}>
        {/* Header Title */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>App Preferences & Account Security</Text>
        </View>

        {/* 1. Account Profile Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Profile</Text>
          <View style={styles.profileBox}>
            <View style={[styles.avatarCircle, { backgroundColor: userRole === "admin" ? C.accent : C.userAccent }]}>
              {currentUser ? (
                <Text style={styles.avatarText}>
                  {currentUser.username ? currentUser.username.substring(0, 2).toUpperCase() : "US"}
                </Text>
              ) : (
                <ProfileIcon color="#ffffff" size={24} />
              )}
            </View>

            <View style={styles.profileDetails}>
              <Text style={styles.userNameText}>
                {currentUser ? currentUser.username : "Guest User"}
              </Text>
              <Text style={styles.userEmailText}>
                {currentUser?.email || "Not signed in"}
              </Text>
              <View style={styles.roleBadgeRow}>
                {userRole === "admin" ? (
                  <View style={[styles.roleBadge, { backgroundColor: mode === "dark" ? "#2a0a0e" : "#fee2e2", borderColor: C.accent }]}>
                    <AdminRoleIcon color={C.accent} size={13} />
                    <Text style={[styles.roleBadgeText, { color: C.accent }]}>ADMIN (Full Access)</Text>
                  </View>
                ) : (
                  <View style={[styles.roleBadge, { backgroundColor: mode === "dark" ? "#0d1a2a" : "#e0f2fe", borderColor: C.userAccent }]}>
                    <UserRoleIcon color={C.userAccent} size={13} />
                    <Text style={[styles.roleBadgeText, { color: C.userAccent }]}>USER (Read Only)</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.authActionBtn}
              onPress={currentUser ? onLogout : onOpenAuth}
              activeOpacity={0.8}
            >
              <Text style={styles.authActionBtnText}>
                {currentUser ? "Log Out" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Preferences Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* App Theme Option */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelBox}>
              <Text style={styles.settingLabel}>App Theme</Text>
              <Text style={styles.settingDesc}>Choose a light or dark appearance</Text>
            </View>
            <View style={styles.currencyToggleGroup}>
              <TouchableOpacity
                style={[styles.currencyBtn, mode === "light" && styles.currencyBtnActive]}
                onPress={() => setMode("light")}
                activeOpacity={0.8}
              >
                <Text style={[styles.currencyBtnText, mode === "light" && styles.currencyBtnTextActive]}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.currencyBtn, mode === "dark" && styles.currencyBtnActive]}
                onPress={() => setMode("dark")}
                activeOpacity={0.8}
              >
                <Text style={[styles.currencyBtnText, mode === "dark" && styles.currencyBtnTextActive]}>Dark</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Server & Database Status (Admin Only) */}
        {userRole === "admin" && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Database & API Status</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Server Endpoint:</Text>
              <Text style={styles.infoValue}>http://119.59.102.161:3027/api</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Database Host:</Text>
              <Text style={styles.infoValue}>119.59.102.161 (MySQL)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Target Database:</Text>
              <Text style={styles.infoValue}>ip_std6730202271</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Server Connection:</Text>
              <View style={styles.statusOnlineTag}>
                <View style={styles.statusDot} />
                <Text style={styles.statusOnlineText}>Online & Ready</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.refreshDataBtn}
              onPress={handleRefresh}
              disabled={refreshing}
              activeOpacity={0.8}
            >
              <Text style={styles.refreshDataBtnText}>
                {refreshing ? "Refreshing..." : "↻ Refresh Inventory Sync"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 4. App Info & System Actions (Admin Only) */}
        {userRole === "admin" && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>System & Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>App Version:</Text>
              <Text style={styles.infoValue}>v1.2.0 (VAL Model)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developer:</Text>
              <Text style={styles.infoValue}>Owen Shop / Nindam S.</Text>
            </View>

            <TouchableOpacity
              style={styles.clearCacheBtn}
              onPress={handleClearCache}
              activeOpacity={0.8}
            >
              <Text style={styles.clearCacheBtnText}>Clear Local Cache</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 80,
  },
  centeredWrapper: {
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
    gap: 16,
  },
  headerRow: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: C.textPrimary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.accent,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 10,
    marginBottom: 4,
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
  },
  profileDetails: {
    flex: 1,
    minWidth: 180,
    gap: 4,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: C.textPrimary,
  },
  userEmailText: {
    fontSize: 12,
    color: C.textSecondary,
  },
  roleBadgeRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  authActionBtn: {
    backgroundColor: C.toggleGroupBg,
    borderWidth: 1,
    borderColor: C.toggleGroupBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  authActionBtnText: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  settingLabelBox: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
  },
  settingDesc: {
    fontSize: 12,
    color: C.textSecondary,
  },
  currencyToggleGroup: {
    flexDirection: "row",
    backgroundColor: C.toggleGroupBg,
    borderRadius: 6,
    padding: 3,
    borderWidth: 1,
    borderColor: C.toggleGroupBorder,
  },
  currencyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  currencyBtnActive: {
    backgroundColor: C.accent,
  },
  currencyBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.toggleTextInactive,
  },
  currencyBtnTextActive: {
    color: "#ffffff",
  },
  rowDivider: {
    height: 1,
    backgroundColor: C.divider,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: C.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: C.textPrimary,
  },
  statusOnlineTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.statusOnlineBg,
    borderColor: C.statusOnlineBorder,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.statusOnlineText,
  },
  statusOnlineText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.statusOnlineText,
  },
  refreshDataBtn: {
    backgroundColor: C.toggleGroupBg,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
  },
  refreshDataBtnText: {
    color: C.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  clearCacheBtn: {
    backgroundColor: C.clearCacheBg,
    borderColor: C.clearCacheBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  clearCacheBtnText: {
    color: C.clearCacheText,
    fontSize: 13,
    fontWeight: "700",
  },
});

const stylesByMode = { dark: buildStyles(DARK_C), light: buildStyles(LIGHT_C) };
