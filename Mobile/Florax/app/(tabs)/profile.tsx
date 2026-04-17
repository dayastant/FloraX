import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>U</Text></View>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.subtitle}>Settings & Preferences</Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={20} color="#4b5563" />
          <Text style={styles.menuText}>App Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="bell" size={20} color="#4b5563" />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="help-circle" size={20} color="#4b5563" />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6", alignItems: "center", paddingTop: 100, paddingHorizontal: 20 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#10b981", justifyContent: "center", alignItems: "center", marginBottom: 20, elevation: 4 },
  avatarText: { fontSize: 36, color: "#fff", fontWeight: "bold" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  subtitle: { fontSize: 16, color: "#6b7280", marginBottom: 40 },
  menuContainer: { width: "100%", backgroundColor: "#fff", borderRadius: 12, paddingVertical: 10, marginBottom: 40, elevation: 2 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  menuText: { fontSize: 16, color: "#374151", marginLeft: 15, fontWeight: "500" },
  button: { width: "100%", backgroundColor: "#ef4444", paddingVertical: 15, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", elevation: 3 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 10 }
});
