import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser } from "../../api/authService"; // Import from authService

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleChange = (name: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleAgree = () => {
    setFormData((prev) => ({ ...prev, agree: !prev.agree }));
    if (errors.agree) setErrors((prev) => ({ ...prev, agree: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.agree) newErrors.agree = "You must agree to terms & conditions";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(formData);
      Alert.alert("Success", "Registration successful!");
      if (response && response.token) {
         await AsyncStorage.setItem("token", response.token); // store JWT
      }
      router.push("/login" as any);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        Alert.alert("Error", err.response.data.message);
      } else {
         Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.headerTitle}>Join FloraX</Text>
          <Text style={styles.headerSubtitle}>
            Manage your smart garden irrigation and optimize water usage automatically.
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Register</Text>
          <Text style={styles.formSubtitle}>Create your free account</Text>

          {/* Form Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Feather name="user" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#9ca3af"
                value={formData.name}
                onChangeText={(text) => handleChange("name", text)}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}><Feather name="alert-circle" size={12} /> {errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Feather name="mail" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}><Feather name="alert-circle" size={12} /> {errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
              <Feather name="phone" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#9ca3af"
                value={formData.phone}
                onChangeText={(text) => handleChange("phone", text)}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}><Feather name="alert-circle" size={12} /> {errors.phone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Feather name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="#9ca3af"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
              />
            </View>
            {errors.password && <Text style={styles.errorText}><Feather name="alert-circle" size={12} /> {errors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Feather name="lock" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="#9ca3af"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                secureTextEntry
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}><Feather name="alert-circle" size={12} /> {errors.confirmPassword}</Text>}
          </View>

          {/* Role selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity 
                style={[styles.roleButton, formData.role === "USER" && styles.roleButtonActive]}
                onPress={() => handleChange("role", "USER")}
              >
                <Text style={[styles.roleButtonText, formData.role === "USER" && styles.roleButtonTextActive]}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, formData.role === "ADMIN" && styles.roleButtonActive]}
                onPress={() => handleChange("role", "ADMIN")}
              >
                <Text style={[styles.roleButtonText, formData.role === "ADMIN" && styles.roleButtonTextActive]}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms checkbox */}
          <TouchableOpacity 
            style={[styles.checkboxContainer, errors.agree && styles.checkboxErrorRect]} 
            onPress={toggleAgree}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, formData.agree && styles.checkboxChecked]}>
              {formData.agree && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.linkText}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>
          {errors.agree && <Text style={styles.errorText}><Feather name="alert-circle" size={12} /> {errors.agree}</Text>}

          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
             <Text style={styles.loginText}>Already have an account? </Text>
             <Link href={"/login" as any} asChild>
               <TouchableOpacity>
                 <Text style={styles.linkTextBold}>Login</Text>
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
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
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
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#ecfdf5",
    borderColor: "#10b981",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  roleButtonTextActive: {
    color: "#10b981",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  checkboxErrorRect: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#10b981",
    borderRadius: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
  },
  checkboxText: {
    fontSize: 14,
    color: "#374151",
  },
  linkText: {
    color: "#10b981",
    fontWeight: "600",
  },
  linkTextBold: {
    color: "#10b981",
    fontWeight: "700",
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
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#4b5563",
    fontSize: 14,
  },
});
