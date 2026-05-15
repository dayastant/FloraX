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
  Dimensions
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { getZonesByGarden } from "../../api/userDashboardService";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 50) / 2;

export default function ZonesScreen() {
  const router = useRouter();
  const { gardenId, gardenName } = useLocalSearchParams();
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchZones = useCallback(async () => {
    try {
      if (gardenId) {
        const data = await getZonesByGarden(parseInt(gardenId as string));
        setZones(data || []);
      }
    } catch (err) {
      console.error("Error fetching zones:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [gardenId]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchZones();
  };

  const handleZonePress = (zone: any) => {
    router.push({
      pathname: "/valves",
      params: {
        zoneId: zone.id,
        zoneName: zone.name,
        gardenId,
        gardenName
      }
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading Zones...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitle}>Garden</Text>
          <Text style={styles.headerTitle}>{gardenName || "Zones"}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        <Text style={styles.zonesLabel}>Select Zone to View Valves</Text>

        {zones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No zones available</Text>
            <Text style={styles.emptySubtext}>Add zones to your garden to get started</Text>
          </View>
        ) : (
          <View style={styles.zonesGrid}>
            {zones.map((zone) => (
              <TouchableOpacity
                key={zone.id}
                style={styles.zoneCard}
                onPress={() => handleZonePress(zone)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.zoneIcon,
                  {
                    backgroundColor: zone.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9'
                  }
                ]}>
                  <Feather
                    name="droplets"
                    size={24}
                    color={zone.status === 'ACTIVE' ? '#10b981' : '#94a3b8'}
                  />
                </View>

                <Text style={styles.zoneName}>{zone.name || `Zone ${zone.id}`}</Text>

                <View style={styles.moistureInfo}>
                  <View style={styles.moistureBar}>
                    <View
                      style={[
                        styles.moistureFill,
                        {
                          width: `${zone.currentMoisture || 0}%`,
                          backgroundColor: zone.currentMoisture > 50 ? '#0ea5e9' : '#f97316'
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.moisturePercentage}>{zone.currentMoisture || 0}%</Text>
                </View>

                <View style={styles.statusBadge}>
                  <View style={[
                    styles.statusDot,
                    {
                      backgroundColor: zone.status === 'ACTIVE' ? '#22c55e' : '#94a3b8'
                    }
                  ]} />
                  <Text style={styles.statusLabel}>{zone.status || 'IDLE'}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardFooterText}>Tap to manage valves</Text>
                  <Feather name="arrow-right" size={16} color="#10b981" />
                </View>
              </TouchableOpacity>
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
  zonesLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5
  },
  zonesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12
  },
  zoneCard: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  zoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },
  zoneName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8
  },
  moistureInfo: {
    marginBottom: 8
  },
  moistureBar: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4
  },
  moistureFill: {
    height: "100%",
    borderRadius: 3
  },
  moisturePercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569"
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9"
  },
  cardFooterText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500"
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
