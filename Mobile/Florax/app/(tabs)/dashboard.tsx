import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { SegmentedControl } from "../../components/SegmentedControl";
import {
  getDashboardSummary,
  getActiveAlerts,
  getAllZones,
  getAllWaterTanks,
  getAllValves,
  getRecentIrrigationLogs,
  getFaultySensors,
  resolveAlert
} from "../../api/userDashboardService";

const { width } = Dimensions.get("window");

const TABS = ["Overview", "Farm", "Irrigation", "System"];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data States
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [tanks, setTanks] = useState<any[]>([]);
  const [valves, setValves] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [faulty, setFaulty] = useState<any[]>([]);

  const loadAllData = useCallback(async () => {
    try {
      const [sum, alts, zns, tnks, vlvs, lgs, flty] = await Promise.all([
        getDashboardSummary(),
        getActiveAlerts(),
        getAllZones(),
        getAllWaterTanks(),
        getAllValves(),
        getRecentIrrigationLogs(5),
        getFaultySensors()
      ]);
      
      setSummary(sum);
      setAlerts(alts || []);
      setZones(zns || []);
      setTanks(tnks || []);
      setValves(vlvs || []);
      setLogs(lgs || []);
      setFaulty(flty || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleResolve = async (id: number) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await resolveAlert(id);
      loadAllData(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Calibrating Ecosystem...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>FloraX Intelligence</Text>
          <Text style={styles.brandTitle}>Universal Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
          <Feather name="refresh-cw" size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Internal Tabs */}
      <SegmentedControl
        options={TABS}
        selectedIndex={activeTab}
        onChange={setActiveTab}
        activeColor="#10b981"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
        {activeTab === 0 && <OverviewTab summary={summary} alerts={alerts} />}
        {activeTab === 1 && <FarmTab zones={zones} />}
        {activeTab === 2 && <IrrigationTab tanks={tanks} valves={valves} logs={logs} />}
        {activeTab === 3 && <SystemTab faulty={faulty} alerts={alerts} onResolve={handleResolve} />}
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS (TABS)
// ══════════════════════════════════════════════════════════════════════════════

const OverviewTab = ({ summary, alerts }: any) => {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: summary?.weeklyUsage || [20, 45, 28, 80, 99, 43, 50] }]
  };

  return (
    <View>
      <LinearGradient colors={['#10b981', '#059669']} style={styles.heroCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heroLabel}>Water Usage Today</Text>
          <Text style={styles.heroValue}>{summary?.waterUsageToday || 0}<Text style={styles.unit}>L</Text></Text>
          <View style={styles.chipRow}>
            <View style={styles.glassChip}>
              <Text style={styles.chipText}>Global Health: Optimal</Text>
            </View>
          </View>
        </View>
        <View style={styles.usageCircle}>
           <Text style={styles.usagePercent}>85%</Text>
           <Text style={styles.usageSub}>Efficiency</Text>
        </View>
      </LinearGradient>

      <View style={styles.statGrid}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#eff6ff' }]}>
            <Feather name="map" size={18} color="#3b82f6" />
          </View>
          <Text style={styles.statNum}>{summary?.totalGardens || 0}</Text>
          <Text style={styles.statLabel}>Gardens</Text>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#fef2f2' }]}>
            <Feather name="alert-triangle" size={18} color="#ef4444" />
          </View>
          <Text style={styles.statNum}>{alerts?.length || 0}</Text>
          <Text style={styles.statLabel}>Alerts</Text>
        </View>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#f0fdf4' }]}>
            <MaterialCommunityIcons name="molecule" size={18} color="#10b981" />
          </View>
          <Text style={styles.statNum}>{summary?.totalZones || 0}</Text>
          <Text style={styles.statLabel}>Active Zones</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Consumption Trends</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const FarmTab = ({ zones }: any) => (
  <View>
    <Text style={styles.sectionTitle}>Zone Health Overview</Text>
    {zones.map((z: any, i: number) => (
      <View key={i} style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <View>
            <Text style={styles.itemName}>{z.name || `Zone ${z.id}`}</Text>
            <Text style={styles.itemMeta}>Garden ID: {z.gardenId}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: z.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9' }]}>
            <Text style={[styles.statusText, { color: z.status === 'ACTIVE' ? '#166534' : '#64748b' }]}>
              {z.status}
            </Text>
          </View>
        </View>
        <View style={styles.moistureBar}>
          <View style={styles.moistureInfo}>
            <Text style={styles.moistureLabel}>Soil Moisture</Text>
            <Text style={styles.moistureValue}>{z.currentMoisture}%</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${z.currentMoisture}%`, backgroundColor: z.currentMoisture < 30 ? '#fbbf24' : '#3b82f6' }]} />
          </View>
        </View>
      </View>
    ))}
  </View>
);

const IrrigationTab = ({ tanks, valves, logs }: any) => (
  <View>
    <Text style={styles.sectionTitle}>Resource Clusters</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
      {tanks.map((t: any, i: number) => (
        <View key={i} style={styles.tankCard}>
          <View style={styles.tankLevelContainer}>
             <View style={[styles.tankWater, { height: `${t.level}%` }]} />
          </View>
          <Text style={styles.tankName}>{t.name}</Text>
          <Text style={styles.tankLevel}>{t.level}%</Text>
        </View>
      ))}
    </ScrollView>

    <Text style={styles.sectionTitle}>Active Mechanisms</Text>
    <View style={styles.valvePool}>
        {valves.map((v: any, i: number) => (
          <View key={i} style={[styles.valveChip, v.status === 'OPEN' && styles.valveChipActive]}>
            <Ionicons name="water" size={14} color={v.status === 'OPEN' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.valveChipText, v.status === 'OPEN' && { color: '#fff' }]}>V-{v.id}</Text>
          </View>
        ))}
    </View>

    <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recent Activities</Text>
    {logs.map((l: any, i: number) => (
      <View key={i} style={styles.logRow}>
        <View style={styles.logDot} />
        <View style={styles.logBody}>
          <Text style={styles.logTitle}>Irrigated Zone {l.zoneId}</Text>
          <Text style={styles.logMeta}>{l.volumeUsed} Liters • {new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      </View>
    ))}
  </View>
);

const SystemTab = ({ faulty, alerts, onResolve }: any) => (
  <View>
    <Text style={styles.sectionTitle}>System Integrity</Text>
    {faulty.length === 0 ? (
      <View style={styles.perfectCard}>
        <Ionicons name="shield-checkmark" size={40} color="#10b981" />
        <Text style={styles.perfectTitle}>All Sensors Normal</Text>
        <Text style={styles.perfectSub}>System diagnostic 100% healthy</Text>
      </View>
    ) : (
      faulty.map((s: any, i: number) => (
        <View key={i} style={styles.faultCard}>
           <Text style={styles.faultTitle}>Sensor Fault: {s.type}</Text>
           <Text style={styles.faultMeta}>Hardware ID: {s.id} • Status: {s.status}</Text>
        </View>
      ))
    )}

    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Action Required</Text>
    {alerts.map((a: any, i: number) => (
      <View key={i} style={styles.alertItem}>
        <View style={styles.alertIconBg}>
          <Feather name="zap" size={18} color="#ef4444" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.alertMsg}>{a.message}</Text>
          <Text style={styles.alertTime}>Just now</Text>
        </View>
        <TouchableOpacity style={styles.resolveBtn} onPress={() => onResolve(a.id)}>
           <Text style={styles.resolveBtnText}>Resolve</Text>
        </TouchableOpacity>
      </View>
    ))}
  </View>
);

// ══════════════════════════════════════════════════════════════════════════════
// STYLES & CONFIG
// ══════════════════════════════════════════════════════════════════════════════

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "4", strokeWidth: "2", stroke: "#10b981" }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#64748b", fontWeight: "600" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, marginBottom: 20 },
  greetingText: { fontSize: 13, color: "#94a3b8", fontWeight: "600", textTransform: 'uppercase', letterSpacing: 1 },
  brandTitle: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },

  // Overview Styles
  heroCard: { padding: 24, borderRadius: 28, flexDirection: 'row', alignItems: 'center', marginBottom: 24, elevation: 8, shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 10 } },
  heroLabel: { color: "#d1fae5", fontSize: 14, fontWeight: "600" },
  heroValue: { color: "#fff", fontSize: 42, fontWeight: "800", marginTop: 4 },
  unit: { fontSize: 18, color: '#d1fae5', marginLeft: 4 },
  chipRow: { flexDirection: 'row', marginTop: 12 },
  glassChip: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  usageCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  usagePercent: { color: '#fff', fontSize: 20, fontWeight: '800' },
  usageSub: { color: '#d1fae5', fontSize: 9, fontWeight: '700' },

  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { width: (width - 64) / 3, backgroundColor: '#fff', borderRadius: 20, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  statIcon: { width: 32, height: 32, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statNum: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2 },

  sectionContainer: { marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 16 },
  chart: { borderRadius: 24, paddingRight: 40, marginTop: 8 },

  // List Cards (Zones)
  itemCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  itemMeta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  moistureBar: { marginTop: 4 },
  moistureInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  moistureLabel: { fontSize: 13, color: '#64748b' },
  moistureValue: { fontSize: 14, fontWeight: '800', color: '#1e293b' },
  track: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },

  // Irrigation Styles
  horizontalScroll: { marginBottom: 24 },
  tankCard: { width: 90, height: 130, backgroundColor: '#fff', borderRadius: 20, padding: 12, alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  tankLevelContainer: { width: 40, height: 60, backgroundColor: '#f1f5f9', borderRadius: 10, overflow: 'hidden', justifyContent: 'flex-end', marginBottom: 8 },
  tankWater: { width: '100%', backgroundColor: '#0ea5e9' },
  tankName: { fontSize: 10, fontWeight: '700', color: '#64748b', textAlign: 'center' },
  tankLevel: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginTop: 2 },
  valvePool: { flexDirection: 'row', flexWrap: 'wrap' },
  valveChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  valveChipActive: { backgroundColor: '#3b82f6' },
  valveChipText: { fontSize: 12, fontWeight: '700', color: '#64748b', marginLeft: 4 },
  logRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  logDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 16 },
  logBody: { flex: 1 },
  logTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  logMeta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  // System Styles
  perfectCard: { padding: 40, alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 28, borderWidth: 1, borderColor: '#dcfce7', marginTop: 8 },
  perfectTitle: { fontSize: 18, fontWeight: '800', color: '#166534', marginTop: 16 },
  perfectSub: { fontSize: 13, color: '#16a34a', marginTop: 4 },
  faultCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#ef4444', marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  faultTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  faultMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  alertItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  alertIconBg: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center' },
  alertMsg: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  alertTime: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  resolveBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  resolveBtnText: { fontSize: 11, fontWeight: '800', color: '#10b981' }
});