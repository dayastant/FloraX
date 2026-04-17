import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getDashboardSummary, getActiveAlerts } from "../../api/userDashboardService";

export default function DashboardScreen() {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const sum = await getDashboardSummary();
        const alts = await getActiveAlerts();
        setSummary(sum || {});
        setAlerts(alts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Dashboard overview</Text>
      
      {/* Overview Stats */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Water Today</Text>
          <Text style={styles.cardValue}>{summary?.waterUsageToday || 0}L</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Zones</Text>
          <Text style={styles.cardValue}>{summary?.totalZones || 0}</Text>
        </View>
      </View>

      {/* Alerts summary */}
      <Text style={styles.sectionTitle}>Active Alerts ({alerts?.length || 0})</Text>
      {alerts?.length > 0 ? (
        alerts.map((a, i) => (
          <View key={i} style={styles.alertCard}>
            <Text style={{ color: "#b91c1c", fontWeight: "600" }}>{a.message || "Alert details"}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No active alerts. Your garden is doing great!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#374151", marginVertical: 15 },
  cardContainer: { flexDirection: "row", justifyContent: "space-between" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 12, flex: 0.48, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  cardLabel: { fontSize: 14, color: "#6b7280", marginBottom: 5 },
  cardValue: { fontSize: 24, fontWeight: "bold", color: "#10b981" },
  alertCard: { backgroundColor: "#fee2e2", padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: "#fecaca" },
  noData: { color: "#6b7280", fontStyle: "italic", marginTop: 5 },
});
