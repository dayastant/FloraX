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
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { getAllGardens, getFaultySensors } from "../../api/userDashboardService";

export default function FarmScreen() {
  const router = useRouter();
  const [gardens, setGardens] = useState<any[]>([]);
  const [faulty, setFaulty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarmData = useCallback(async () => {
    try {
      // Fetching both datasets in parallel for better performance
      const [gardensData, faultyData] = await Promise.all([
        getAllGardens(),
        getFaultySensors()
      ]);
      setGardens(gardensData || []);
      setFaulty(faultyData || []);
    } catch (err) {
      console.error("Error fetching farm data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFarmData();
  }, [fetchFarmData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFarmData();
  };

  const handleGardenPress = (garden: any) => {
    router.push({
      pathname: "/zones",
      params: {
        gardenId: garden.id,
        gardenName: garden.name
      }
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Syncing Farm Data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        <Text style={styles.headerTitle}>Farm Overview</Text>

        {/* Gardens Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gardens</Text>
          <View style={styles.badgeCount}>
            <Text style={styles.badgeCountText}>{gardens.length}</Text>
          </View>
        </View>

        {gardens.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.noData}>No gardens configured.</Text>
          </View>
        ) : (
          gardens.map((garden, i) => (
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() => handleGardenPress(garden)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{garden.name || `Garden ${garden.id}`}</Text>
                  <Text style={styles.cardSubtitle}>
                    {garden.zones?.length || 0} zones • ID: {garden.id}
                  </Text>
                </View>
                <View style={[
                  styles.statusPill,
                  { backgroundColor: garden.zones?.some((z: any) => z.status === 'ACTIVE') ? '#dcfce7' : '#f3f4f6' }
                ]}>
                  <View style={[
                    styles.dot,
                    { backgroundColor: garden.zones?.some((z: any) => z.status === 'ACTIVE') ? '#22c55e' : '#94a3b8' }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: garden.zones?.some((z: any) => z.status === 'ACTIVE') ? '#166534' : '#64748b' }
                  ]}>
                    {garden.zones?.some((z: any) => z.status === 'ACTIVE') ? 'ACTIVE' : 'IDLE'}
                  </Text>
                </View>
              </View>

              <View style={styles.moistureContainer}>
                <View style={styles.moistureLabelRow}>
                  <Text style={styles.moistureLabel}>Avg Soil Moisture</Text>
                  <Text style={styles.moistureValue}>
                    {garden.zones && garden.zones.length > 0
                      ? Math.round(
                          garden.zones.reduce((sum: number, z: any) => sum + (z.currentMoisture || 0), 0) /
                            garden.zones.length
                        )
                      : 0}
                    %
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          garden.zones && garden.zones.length > 0
                            ? Math.round(
                                garden.zones.reduce((sum: number, z: any) => sum + (z.currentMoisture || 0), 0) /
                                  garden.zones.length
                              )
                            : 0
                        }%`
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.tapIndicator}>
                <Text style={styles.tapText}>Tap to view zones</Text>
                <Feather name="arrow-right" size={16} color="#10b981" />
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Faulty Sensors Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>System Integrity</Text>
        </View>

        {faulty.length === 0 ? (
          <View style={styles.successCard}>
            <Text style={styles.successText}>✓ All sensors are operational</Text>
          </View>
        ) : (
          faulty.map((s, i) => (
            <View key={i} style={[styles.card, styles.faultyCard]}>
              <View style={styles.alertIcon}>
                <Text style={styles.alertIconText}>!</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Fault Detected: {s.id}</Text>
                <Text style={styles.cardSubtitle}>Type: {s.type}</Text>
              </View>
              <Text style={styles.faultTag}>Action Required</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#f8fafc' },
  loadingText: { marginTop: 12, color: '#64748b', fontWeight: '500' },

  headerTitle: { fontSize: 32, fontWeight: "800", color: "#1e293b", marginBottom: 24, letterSpacing: -0.8 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#475569", marginRight: 8 },

  badgeCount: { backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeCountText: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#1e293b" },
  cardSubtitle: { fontSize: 13, color: "#94a3b8", marginTop: 2 },

  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  moistureContainer: { marginTop: 4 },
  moistureLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  moistureLabel: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  moistureValue: { fontSize: 18, fontWeight: '800', color: '#3b82f6' },
  progressTrack: { height: 8, backgroundColor: '#eff6ff', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },

  tapIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  tapText: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },

  faultyCard: { flexDirection: 'row', alignItems: 'center', borderLeftWidth: 6, borderLeftColor: "#ef4444" },
  alertIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  alertIconText: { color: '#ef4444', fontWeight: '900', fontSize: 16 },
  faultTag: { fontSize: 10, fontWeight: '800', color: '#ef4444', textTransform: 'uppercase', backgroundColor: '#fef2f2', padding: 4, borderRadius: 4 },

  successCard: { padding: 20, backgroundColor: '#f0fdf4', borderRadius: 16, borderWidth: 1, borderColor: '#dcfce7', alignItems: 'center' },
  successText: { color: '#16a34a', fontWeight: '700', fontSize: 15 },

  emptyCard: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  noData: { color: "#94a3b8", fontSize: 15, fontStyle: 'italic' },
});