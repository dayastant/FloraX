import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getAllValves, getAllWaterTanks, getTodayIrrigationLogs } from "../../api/userDashboardService";

export default function IrrigationScreen() {
  const [tanks, setTanks] = useState<any[]>([]);
  const [valves, setValves] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIrrigation() {
      try {
        setTanks((await getAllWaterTanks()) || []);
        setValves((await getAllValves()) || []);
        setLogs((await getTodayIrrigationLogs()) || []);
      } catch (err) {} finally { setLoading(false); }
    }
    fetchIrrigation();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Irrigation Control</Text>

      <Text style={styles.sectionTitle}>Water Tanks</Text>
      {tanks.length === 0 && <Text style={styles.noData}>No tanks found.</Text>}
      {tanks.map((t, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{t.name || `Tank ${t.id}`}</Text>
          <Text style={styles.cardDetail}>Level: {t.level}% <Text style={{ color: t.level < 20 ? '#ef4444' : '#10b981' }}>({t.status})</Text></Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Valve Status</Text>
      {valves.length === 0 && <Text style={styles.noData}>No valves found.</Text>}
      {valves.map((v, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>Valve {v.id}</Text>
          <Text style={styles.cardDetail}>Status: <Text style={{ color: v.status === 'OPEN' ? '#3b82f6' : '#6b7280', fontWeight: 'bold' }}>{v.status}</Text></Text>
        </View>
      ))}
      
      <Text style={styles.sectionTitle}>Today's Sessions ({logs.length})</Text>
      {logs.length === 0 && <Text style={styles.noData}>No irrigation logs today.</Text>}
      {logs.map((L, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardDetail}>Zone: {L.zoneId} | Volume: {L.volumeUsed}L</Text>
          <Text style={styles.cardDetail}>Time: {new Date(L.startTime).toLocaleTimeString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  content: { padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#374151", marginVertical: 15 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1f2937", marginBottom: 4 },
  cardDetail: { fontSize: 14, color: "#4b5563", marginBottom: 2 },
  noData: { color: "#6b7280", fontStyle: "italic" },
});
