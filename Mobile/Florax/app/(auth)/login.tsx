import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../../api/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleLogin = async () => {
    setApiError("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      if (data && data.token) {
        await AsyncStorage.setItem("token", data.token);
      }
      // Redirect to home / dashboard after successful login
      router.replace("/(tabs)/dashboard" as any);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Login failed. Please check your credentials.";
      setApiError(typeof msg === "string" ? msg : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Feather name="wind" size={64} color="#fff" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Welcome to FloraX</Text>
          <Text style={styles.headerSubtitle}>
            Smart irrigation solution that automatically delivers water to your
            garden based on real-time soil data.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          {/* API Error Banner */}
          {apiError ? (
            <View style={styles.apiErrorBanner}>
              <Feather name="alert-circle" size={16} color="#dc2626" />
              <Text style={styles.apiErrorText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Email Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Feather name="user" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>
                <Feather name="alert-circle" size={12} /> {errors.email}
              </Text>
            )}
          </View>

          {/* Password Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Feather name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>
                <Feather name="alert-circle" size={12} /> {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
             <Link href={"/forgot-password" as any} asChild>
               <TouchableOpacity>
                 <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
               </TouchableOpacity>
             </Link>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.submitButtonText}> Signing in...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerLinkContainer}>
             <Text style={styles.registerText}>Don't have an account? </Text>
             <Link href={"/register" as any} asChild>
               <TouchableOpacity>
                 <Text style={styles.linkTextBold}>Register here</Text>
               </TouchableOpacity>
             </Link>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    backgroundColor: "#10b981",
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: -20,
    zIndex: 1,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 2,
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
  },
  apiErrorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  apiErrorText: {
    color: "#dc2626",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
    height: "100%",
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#1f2937",
    height: "100%",
  },
  eyeIconContainer: {
    padding: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#10b981",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "600",
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#4b5563",
    fontSize: 14,
  },
  linkTextBold: {
    color: "#10b981",
    fontWeight: "700",
  },
});
