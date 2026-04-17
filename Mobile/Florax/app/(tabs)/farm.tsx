import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { getAllZones, getFaultySensors } from "../../api/userDashboardService";

export default function FarmScreen() {
  const [zones, setZones] = useState<any[]>([]);
  const [faulty, setFaulty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFarmData() {
      try {
         setZones((await getAllZones()) || []);
         setFaulty((await getFaultySensors()) || []);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    fetchFarmData();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Farm Status</Text>

      <Text style={styles.sectionTitle}>Zone Moisture & Irrigation</Text>
      {zones.length === 0 && <Text style={styles.noData}>No zones configured.</Text>}
      {zones.map((z, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{z.name || `Zone ${z.id}`}</Text>
          <Text style={styles.cardDetail}>Status: <Text style={{ color: z.status === 'ACTIVE' ? '#3b82f6' : '#10b981', fontWeight: 'bold' }}>{z.status || 'IDLE'}</Text></Text>
          <Text style={styles.cardDetail}>Moisture: {z.currentMoisture}%</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Faulty Sensors ({faulty.length})</Text>
      {faulty.length === 0 ? (
        <Text style={styles.noData}>All sensors are operational.</Text>
      ) : (
        faulty.map((s, i) => (
          <View key={i} style={[styles.card, styles.faultyCard]}>
            <Text style={styles.cardTitle}>Sensor ID: {s.id}</Text>
            <Text style={styles.cardDetail}>Type: {s.type}</Text>
          </View>
        ))
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
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  faultyCard: { borderLeftWidth: 4, borderLeftColor: "#ef4444" },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1f2937", marginBottom: 5 },
  cardDetail: { fontSize: 14, color: "#4b5563", marginBottom: 3 },
  noData: { color: "#6b7280", fontStyle: "italic" },
});
