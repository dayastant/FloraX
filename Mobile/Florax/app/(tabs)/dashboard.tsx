import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit"; // Ensure this is installed
import { getDashboardSummary, getActiveAlerts } from "../../api/userDashboardService";
import { Ionicons } from '@expo/vector-icons'; // For better iconography

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sum, alts] = await Promise.all([getDashboardSummary(), getActiveAlerts()]);
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
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // Mock data for the chart - in a real app, fetch this from your API
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: summary?.weeklyUsage || [20, 45, 28, 80, 99, 43, 50] }]
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Gardener! 👋</Text>
          <Text style={styles.title}>System Overview</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge}>
          <Ionicons name="notifications-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Hero Stats */}
      <View style={styles.heroCard}>
        <View>
          <Text style={styles.heroLabel}>Water Usage Today</Text>
          <Text style={styles.heroValue}>{summary?.waterUsageToday || 0}L</Text>
        </View>
        <View style={styles.progressCircle}>
           <Text style={styles.progressText}>85%</Text>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Weekly Consumption</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chartStyle}
        />
      </View>

      <View style={styles.cardRow}>
        <StatCard label="Active Zones" value={summary?.totalZones || 0} icon="leaf-outline" color="#3b82f6" />
        <StatCard label="Avg Temp" value="24°C" icon="thermometer-outline" color="#f59e0b" />
      </View>

      {/* Alerts summary */}
      <View style={styles.alertSection}>
        <Text style={styles.sectionTitle}>System Alerts ({alerts?.length || 0})</Text>
        {alerts?.length > 0 ? (
          alerts.map((a, i) => (
            <View key={i} style={styles.alertCard}>
              <Ionicons name="alert-circle" size={20} color="#b91c1c" />
              <Text style={styles.alertText}>{a.message || "Potential leak detected in Zone 2"}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={40} color="#10b981" />
            <Text style={styles.noData}>All systems nominal. Your garden is thriving!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Sub-component for small cards
const StatCard = ({ label, value, icon, color }: any) => (
  <View style={styles.smallCard}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.smallCardValue}>{value}</Text>
    <Text style={styles.smallCardLabel}>{label}</Text>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#10b981" }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, marginBottom: 20 },
  greeting: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  title: { fontSize: 26, fontWeight: "bold", color: "#1f2937" },
  profileBadge: { backgroundColor: "#fff", padding: 10, borderRadius: 12, elevation: 2 },
  
  heroCard: { backgroundColor: "#10b981", marginHorizontal: 20, padding: 25, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  heroLabel: { color: "#d1fae5", fontSize: 16 },
  heroValue: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  progressCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 4, borderColor: "#d1fae5", justifyContent: 'center', alignItems: 'center' },
  progressText: { color: "#fff", fontWeight: "bold" },

  chartContainer: { marginTop: 25, paddingHorizontal: 20 },
  chartStyle: { borderRadius: 16, marginTop: 10 },
  
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#374151", marginBottom: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20 },
  smallCard: { backgroundColor: "#fff", width: '47%', padding: 15, borderRadius: 16, elevation: 1 },
  smallCardValue: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginTop: 8 },
  smallCardLabel: { fontSize: 12, color: "#6b7280" },

  alertSection: { padding: 20, marginBottom: 30 },
  alertCard: { backgroundColor: "#fee2e2", padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  alertText: { color: "#b91c1c", fontWeight: "600", marginLeft: 10 },
  emptyState: { alignItems: 'center', marginTop: 10 },
  noData: { color: "#6b7280", marginTop: 10, textAlign: 'center' },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});