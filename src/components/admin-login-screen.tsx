import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";

interface AdminLoginScreenProps {
  onLoginSuccess: (user: any) => void;
  onCancel: () => void;
  apiCall: (endpoint: string, options?: any) => Promise<any>;
}

export default function AdminLoginScreen({
  onLoginSuccess,
  onCancel,
  apiCall,
}: AdminLoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim()) {
      setErrorMsg("Please enter Username");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter Password");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      let result: any = null;
      try {
        result = await apiCall("/login", {
          method: "POST",
          body: JSON.stringify({ username: username.trim(), password: password.trim() }),
        });
      } catch (err: any) {
        console.warn("Backend API login offline or failed:", err.message);
        // Fallback for default accounts if API server is offline
        if (username.trim().toLowerCase() === "Nyxpaszin" && password.trim() === "@Bento2549") {
          result = {
            user_id: 1,
            username: "admin",
            role: "admin",
            token: "admin_fallback_token",
          };
        } else {
          throw new Error("Invalid Username or Password");
        }
      }

      if (result && (result.role || result.token)) {
        onLoginSuccess(result);
      } else {
        throw new Error(result?.error || "Login failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0c" />
      <View style={styles.centerWrapper}>
        <View style={styles.card}>
          {/* Top Red Accent Border */}
          <View style={styles.topAccentBar} />

          <View style={styles.cardContent}>
            {/* Title: ADMIN LOGIN */}
            <View style={styles.titleBox}>
              <Text style={styles.titleText}>
                <Text style={styles.titleWhite}>ADMIN </Text>
                <Text style={styles.titleRed}>LOGIN</Text>
              </Text>
            </View>

            {/* Error Banner */}
            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            ) : null}

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor="#666666"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#666666"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.signInBtnText}>SIGN IN</Text>
              )}
            </TouchableOpacity>

            {/* Back to Store Link */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnText}>← Back to Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0c",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centerWrapper: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#121215",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222228",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  topAccentBar: {
    height: 4,
    backgroundColor: "#ff4655",
    width: "100%",
  },
  cardContent: {
    padding: 32,
  },
  titleBox: {
    alignItems: "center",
    marginBottom: 28,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
  },
  titleWhite: {
    color: "#ffffff",
  },
  titleRed: {
    color: "#ff4655",
  },
  errorBox: {
    backgroundColor: "#2a0a0e",
    borderColor: "#ff4655",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: "#ff4655",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#aaaaaa",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#18181c",
    borderWidth: 1,
    borderColor: "#2a2a32",
    borderRadius: 6,
    color: "#ffffff",
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
  },
  signInBtn: {
    backgroundColor: "#ff4655",
    height: 48,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#ff4655",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signInBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  backBtn: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 6,
  },
  backBtnText: {
    color: "#777788",
    fontSize: 13,
    fontWeight: "600",
  },
});
