import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Dimensions
} from "react-native";
import { getAllValves, getAllWaterTanks, getTodayIrrigationLogs } from "../../api/userDashboardService";

const { width } = Dimensions.get('window');

export default function IrrigationScreen() {
  const [tanks, setTanks] = useState<any[]>([]);
  const [valves, setValves] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [tanksRes, valvesRes, logsRes] = await Promise.all([
        getAllWaterTanks(),
        getAllValves(),
        getTodayIrrigationLogs()
      ]);
      setTanks(tanksRes || []);
      setValves(valvesRes || []);
      setLogs(logsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor="#059669" />}
      >
        <Text style={styles.title}>Irrigation Control</Text>

        {/* --- WATER TANKS SECTION --- */}
        <Text style={styles.sectionTitle}>Water Storage</Text>
        {tanks.length === 0 ? <Text style={styles.noData}>No tanks connected</Text> :
          tanks.map((t, i) => (
            <View key={i} style={styles.tankCard}>
              <View style={styles.tankHeader}>
                <Text style={styles.cardTitle}>{t.name || `Tank ${t.id}`}</Text>
                <Text style={[styles.levelText, { color: t.level < 20 ? '#ef4444' : '#0ea5e9' }]}>
                  {t.level}% Full
                </Text>
              </View>
              <View style={styles.tankTrack}>
                <View style={[
                  styles.tankFill,
                  { width: `${t.level}%`, backgroundColor: t.level < 20 ? '#fca5a5' : '#38bdf8' }
                ]} />
              </View>
              <Text style={styles.tankStatus}>{t.status || 'Stable'}</Text>
            </View>
          ))
        }

        {/* --- VALVES GRID SECTION --- */}
        <Text style={styles.sectionTitle}>Quick Valve View</Text>
        <View style={styles.valveGrid}>
          {valves.map((v, i) => (
            <View key={i} style={styles.valveBox}>
              <View style={[styles.valveIndicator, { backgroundColor: v.status === 'OPEN' ? '#3b82f6' : '#cbd5e1' }]} />
              <Text style={styles.valveName}>Valve {v.id}</Text>
              <Text style={[styles.valveStatus, { color: v.status === 'OPEN' ? '#3b82f6' : '#64748b' }]}>
                {v.status}
              </Text>
            </View>
          ))}
        </View>

        {/* --- LOGS SECTION --- */}
        <View style={styles.logsHeader}>
          <Text style={styles.sectionTitle}>Today's Sessions</Text>
          <View style={styles.logCount}><Text style={styles.logCountText}>{logs.length}</Text></View>
        </View>

        {logs.length === 0 ? <Text style={styles.noData}>No activity today.</Text> :
          logs.map((L, i) => (
            <View key={i} style={styles.logItem}>
              <View style={styles.logLine} />
              <View style={styles.logCircle} />
              <View style={styles.logContent}>
                <Text style={styles.logTitle}>Zone {L.zoneId} • {L.volumeUsed}L Used</Text>
                <Text style={styles.logTime}>{new Date(L.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingTop: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "800", color: "#1e293b", marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#475569", marginBottom: 15 },

  // Tank Styles
  tankCard: { backgroundColor: "#fff", padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  tankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  levelText: { fontWeight: '800', fontSize: 16 },
  tankTrack: { height: 12, backgroundColor: '#f1f5f9', borderRadius: 6, overflow: 'hidden' },
  tankFill: { height: '100%', borderRadius: 6 },
  tankStatus: { fontSize: 12, color: '#94a3b8', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },

  // Valve Styles
  valveGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  valveBox: { width: (width - 55) / 2, backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  valveIndicator: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  valveName: { fontWeight: '600', color: '#1e293b' },
  valveStatus: { fontSize: 12, fontWeight: '700', marginTop: 2 },

  // Log Styles
  logsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 },
  logCount: { backgroundColor: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  logCountText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  logItem: { flexDirection: 'row', height: 60, paddingLeft: 10 },
  logLine: { position: 'absolute', left: 14, top: 0, bottom: 0, width: 2, backgroundColor: '#e2e8f0' },
  logCircle: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10b981', marginTop: 6, zIndex: 1 },
  logContent: { marginLeft: 20 },
  logTitle: { fontSize: 15, fontWeight: '600', color: '#334155' },
  logTime: { fontSize: 13, color: '#94a3b8' },

  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  noData: { color: "#94a3b8", fontStyle: "italic", marginBottom: 20 },
});