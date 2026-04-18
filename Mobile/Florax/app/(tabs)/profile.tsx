import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/(auth)/login" as any);
  };

  const MenuLink = ({ icon, title, color = "#4b5563", isLast = false, onPress }: any) => (
    <TouchableOpacity
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Feather name="chevron-right" size={18} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Feather name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@farmtech.io</Text>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionLabel}>Account Settings</Text>
        <View style={styles.groupCard}>
          <MenuLink icon="user" title="Personal Information" color="#3b82f6" />
          <MenuLink icon="settings" title="App Preferences" color="#10b981" />
          <MenuLink icon="bell" title="Notifications" color="#f59e0b" />
          <MenuLink icon="shield" title="Security & Privacy" color="#6366f1" isLast={true} />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.groupCard}>
          <MenuLink icon="help-circle" title="Help Center" color="#4b5563" />
          <MenuLink icon="file-text" title="Terms of Service" color="#4b5563" isLast={true} />
        </View>

        {/* Danger Zone */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 2.4.0 (2026 Stable)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingBottom: 40 },

  header: { alignItems: "center", paddingVertical: 40, backgroundColor: '#fff', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 10 } },
  avatarWrapper: { position: 'relative', marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#10b981", justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: '#fff' },
  avatarText: { fontSize: 32, color: "#fff", fontWeight: "800" },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1f2937', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },

  userName: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
  userEmail: { fontSize: 14, color: "#64748b", marginTop: 4 },

  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginLeft: 25, marginTop: 30, marginBottom: 10, letterSpacing: 1 },

  groupCard: { marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "#f1f5f9" },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f8fafc" },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: "#334155", fontWeight: "600" },

  logoutButton: { marginHorizontal: 20, marginTop: 30, backgroundColor: "#fee2e2", paddingVertical: 18, borderRadius: 24, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 16, marginLeft: 10 },

  versionText: { textAlign: 'center', color: '#cbd5e1', fontSize: 12, marginTop: 30, fontWeight: '600' }
});