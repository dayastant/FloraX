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
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { getValvesByZone, openValve, closeValve, getZoneById } from "../../api/userDashboardService";

const { width } = Dimensions.get("window");

export default function ValvesScreen() {
  const router = useRouter();
  const { zoneId, zoneName, gardenId, gardenName } = useLocalSearchParams();
  const [zone, setZone] = useState<any>(null);
  const [valves, setValves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingValves, setUpdatingValves] = useState<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      if (zoneId) {
        const zoneNum = parseInt(zoneId as string);
        // Fetch zone details and valves in parallel
        const [zoneData, valvesData] = await Promise.all([
          getZoneById(zoneNum),
          getValvesByZone(zoneNum)
        ]);
        setZone(zoneData);
        setValves(valvesData || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [zoneId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleValveToggle = async (valve: any) => {
    try {
      setUpdatingValves(prev => new Set([...prev, valve.valveId]));
      
      const isOpen = valve.status === 'OPEN';
      const newStatus = isOpen ? 'CLOSED' : 'OPEN';
      
      Alert.alert(
        `${newStatus === 'OPEN' ? 'Open' : 'Close'} Valve?`,
        `Are you sure you want to ${newStatus === 'OPEN' ? 'open' : 'close'} this valve?`,
        [
          {
            text: "Cancel",
            onPress: () => {
              setUpdatingValves(prev => {
                const next = new Set(prev);
                next.delete(valve.valveId);
                return next;
              });
            },
            style: "cancel"
          },
          {
            text: "Confirm",
            onPress: async () => {
              try {
                let result;
                if (newStatus === 'OPEN') {
                  result = await openValve(valve.valveId);
                } else {
                  result = await closeValve(valve.valveId);
                }
                
                // Update local state with the result
                setValves(prev =>
                  prev.map(v =>
                    v.valveId === valve.valveId ? result : v
                  )
                );
                
                Alert.alert(
                  "Success",
                  `Valve ${newStatus === 'OPEN' ? 'opened' : 'closed'} successfully`
                );
              } catch (err) {
                Alert.alert("Error", err.message || "Failed to update valve status");
                console.error(err);
              } finally {
                setUpdatingValves(prev => {
                  const next = new Set(prev);
                  next.delete(valve.valveId);
                  return next;
                });
              }
            },
            style: "destructive"
          }
        ]
      );
    } catch (err) {
      console.error("Error toggling valve:", err);
      setUpdatingValves(prev => {
        const next = new Set(prev);
        next.delete(valve.valveId);
        return next;
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading Valves...</Text>
      </View>
    );
  }

  const openValvesCount = valves.filter(v => v.status === 'OPEN').length;
  const closedValvesCount = valves.filter(v => v.status === 'CLOSED').length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>{gardenName}</Text>
          <Text style={styles.headerTitle}>{zone?.zoneName || "Zone"}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        {/* Zone Info */}
        {zone && (
          <View style={styles.zoneInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Plant Type</Text>
              <Text style={styles.infoValue}>{zone.plantType || "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Soil Type</Text>
              <Text style={styles.infoValue}>{zone.soilType || "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sunlight</Text>
              <Text style={styles.infoValue}>{zone.sunlightExposure || "—"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Moisture Range</Text>
              <Text style={styles.infoValue}>
                {zone.moistureThresholdMin}% - {zone.moistureThresholdMax}%
              </Text>
            </View>

            {/* Moisture Visualization */}
            <View style={styles.moistureSection}>
              <Text style={styles.moistureTitle}>Current Soil Moisture</Text>
              <View style={styles.moistureDisplay}>
                <Text style={styles.moisturePercentage}>{zone.currentMoisture || 0}%</Text>
              </View>
              <View style={styles.moistureBar}>
                <View
                  style={[
                    styles.moistureFill,
                    {
                      width: `${zone.currentMoisture || 0}%`,
                      backgroundColor:
                        zone.currentMoisture > 70
                          ? '#3b82f6'
                          : zone.currentMoisture > 40
                          ? '#10b981'
                          : '#f97316'
                    }
                  ]}
                />
              </View>
              {zone.moistureRaw && (
                <Text style={styles.rawValue}>Raw ADC: {zone.moistureRaw.toFixed(0)}</Text>
              )}
            </View>

            {/* Sensors Section */}
            {zone.sensors && zone.sensors.length > 0 && (
              <View style={styles.sensorsSection}>
                <Text style={styles.sectionTitle}>Zone Sensors</Text>
                {zone.sensors.map((sensor: any, idx: number) => (
                  <View key={idx} style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                      <Text style={styles.sensorType}>{sensor.sensorType}</Text>
                      <Text
                        style={[
                          styles.sensorStatus,
                          { color: sensor.status === 'ACTIVE' ? '#10b981' : '#ef4444' }
                        ]}
                      >
                        {sensor.status}
                      </Text>
                    </View>
                    <Text style={styles.sensorReading}>
                      {sensor.latestReading?.toFixed(1) || '—'}%
                    </Text>
                    {sensor.latestReadingRaw && (
                      <Text style={styles.sensorRaw}>Raw: {sensor.latestReadingRaw.toFixed(0)}</Text>
                    )}
                    <Text style={styles.sensorSerial}>SN: {sensor.serialNumber}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="unlock" size={20} color="#10b981" />
            </View>
            <Text style={styles.statValue}>{openValvesCount}</Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="lock" size={20} color="#ef4444" />
            </View>
            <Text style={styles.statValue}>{closedValvesCount}</Text>
            <Text style={styles.statLabel}>Closed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="activity" size={20} color="#0ea5e9" />
            </View>
            <Text style={styles.statValue}>{valves.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Valve Controls</Text>

        {valves.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No valves available</Text>
            <Text style={styles.emptySubtext}>This zone has no valves configured</Text>
          </View>
        ) : (
          <View style={styles.valvesList}>
            {valves.map((valve, index) => (
              <View key={valve.valveId} style={styles.valveItem}>
                <View style={styles.valveInfo}>
                  <View style={[
                    styles.valveStatusIcon,
                    {
                      backgroundColor: valve.status === 'OPEN' ? '#dcfce7' : '#f3f4f6'
                    }
                  ]}>
                    <Feather
                      name={valve.status === 'OPEN' ? 'unlock' : 'lock'}
                      size={20}
                      color={valve.status === 'OPEN' ? '#22c55e' : '#94a3b8'}
                    />
                  </View>
                  <View style={styles.valveDetails}>
                    <Text style={styles.valveName}>Valve {valve.valveId}</Text>
                    <Text style={styles.valveId}>Power: {valve.powerSource}</Text>
                  </View>
                </View>

                <View style={styles.valveButtons}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor: valve.status === 'OPEN' ? '#10b981' : '#e2e8f0'
                      }
                    ]}
                    disabled={updatingValves.has(valve.valveId)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      {
                        color: valve.status === 'OPEN' ? '#ffffff' : '#94a3b8'
                      }
                    ]}>
                      {valve.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      valve.status === 'OPEN' ? styles.closeButton : styles.openButton,
                      updatingValves.has(valve.valveId) && styles.disabledButton
                    ]}
                    onPress={() => handleValveToggle(valve)}
                    disabled={updatingValves.has(valve.valveId)}
                  >
                    {updatingValves.has(valve.valveId) ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <Feather
                          name={valve.status === 'OPEN' ? 'lock' : 'unlock'}
                          size={18}
                          color="#ffffff"
                        />
                        <Text style={styles.actionButtonText}>
                          {valve.status === 'OPEN' ? 'Close' : 'Open'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {index < valves.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc"
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontWeight: "500"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0"
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  headerContent: {
    flex: 1,
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b"
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  content: {
    padding: 16,
    paddingBottom: 24
  },
  zoneInfo: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9"
  },
  infoLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b"
  },
  moistureSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9"
  },
  moistureTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  moistureDisplay: {
    alignItems: "center",
    marginBottom: 12
  },
  moisturePercentage: {
    fontSize: 40,
    fontWeight: "800",
    color: "#10b981"
  },
  moistureBar: {
    height: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 8
  },
  moistureFill: {
    height: "100%",
    borderRadius: 5
  },
  rawValue: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
    textAlign: "center"
  },
  sensorsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    marginTop: 16
  },
  sensorCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#0ea5e9"
  },
  sensorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  sensorType: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
    textTransform: "uppercase"
  },
  sensorStatus: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  sensorReading: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3b82f6",
    marginBottom: 4
  },
  sensorRaw: {
    fontSize: 10,
    color: "#94a3b8",
    marginBottom: 4
  },
  sensorSerial: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "500"
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b"
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12
  },
  valvesList: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  valveItem: {
    padding: 16
  },
  valveInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  valveStatusIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  valveDetails: {
    flex: 1
  },
  valveName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b"
  },
  valveId: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2
  },
  valveButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: "center"
  },
  statusButtonText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6
  },
  openButton: {
    backgroundColor: "#10b981"
  },
  closeButton: {
    backgroundColor: "#ef4444"
  },
  disabledButton: {
    opacity: 0.6
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600"
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginTop: 12
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginTop: 12
  },
  emptySubtext: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4
  }
});
