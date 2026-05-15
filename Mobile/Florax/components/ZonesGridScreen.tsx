import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE = 'http://localhost:8080/api';

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return '#10b981';
    case 'IDLE':
      return '#3b82f6';
    case 'ALERT':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const getMoistureStatus = (moisture, min, max) => {
  if (moisture < min) return { label: 'LOW', color: '#fbbf24' };
  if (moisture > max) return { label: 'HIGH', color: '#10b981' };
  return { label: 'OK', color: '#06b6d4' };
};

export default function ZonesGridScreen({ garden, onZoneSelect, onBack }) {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZones();
  }, [garden.gardenId]);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE}/dashboard/${garden.gardenId}/zones`
      );
      setZones(response.data);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
      // Demo data
      setZones([
        {
          zoneId: 1,
          zoneName: 'Tomato Zone',
          currentMoisture: 65,
          moistureThresholdMin: 40,
          moistureThresholdMax: 80,
          irrigationStatus: 'ACTIVE',
          lastIrrigatedAt: '2 hours ago',
        },
        {
          zoneId: 2,
          zoneName: 'Lettuce Zone',
          currentMoisture: 55,
          moistureThresholdMin: 50,
          moistureThresholdMax: 75,
          irrigationStatus: 'IDLE',
          lastIrrigatedAt: '4 hours ago',
        },
        {
          zoneId: 3,
          zoneName: 'Pepper Zone',
          currentMoisture: 35,
          moistureThresholdMin: 40,
          moistureThresholdMax: 80,
          irrigationStatus: 'ALERT',
          lastIrrigatedAt: '8 hours ago',
        },
        {
          zoneId: 4,
          zoneName: 'Herbs Zone',
          currentMoisture: 72,
          moistureThresholdMin: 60,
          moistureThresholdMax: 80,
          irrigationStatus: 'ACTIVE',
          lastIrrigatedAt: '1 hour ago',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderZoneBox = ({ item }) => {
    const moistureStatus = getMoistureStatus(
      item.currentMoisture,
      item.moistureThresholdMin,
      item.moistureThresholdMax
    );

    return (
      <TouchableOpacity
        style={[
          styles.zoneBox,
          { borderTopColor: getStatusColor(item.irrigationStatus) },
        ]}
        onPress={() => onZoneSelect(item)}
        activeOpacity={0.8}
      >
        <View style={styles.zoneHeader}>
          <Text style={styles.zoneName}>{item.zoneName}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.irrigationStatus) },
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.irrigationStatus}</Text>
          </View>
        </View>

        <View style={styles.moistureSection}>
          <View style={styles.moistureValueContainer}>
            <Text style={styles.moistureValue}>{item.currentMoisture}%</Text>
            <Text style={styles.moistureUnit}>Moisture</Text>
          </View>
          <View style={styles.moistureStatusContainer}>
            <View style={styles.moistureBar}>
              <View
                style={[
                  styles.moistureFill,
                  {
                    width: `${Math.min(item.currentMoisture, 100)}%`,
                    backgroundColor: moistureStatus.color,
                  },
                ]}
              />
            </View>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>
                Min: {item.moistureThresholdMin}%
              </Text>
              <Text style={styles.rangeLabel}>
                Max: {item.moistureThresholdMax}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.zoneFooter}>
          <Text style={styles.lastWatered}>{item.lastIrrigatedAt}</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#10b981"
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading zones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{garden.gardenName}</Text>
          <Text style={styles.headerSubtitle}>{zones.length} zones</Text>
        </View>
      </View>

      {/* Zones Grid */}
      <FlatList
        data={zones}
        renderItem={renderZoneBox}
        keyExtractor={item => item.zoneId.toString()}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={true}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  gridContainer: {
    padding: 8,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  zoneBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 6,
    borderTopWidth: 4,
    borderWidth: 1,
    borderTopColor: '#10b981',
    borderColor: '#e2e8f0',
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  zoneName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  moistureSection: {
    marginBottom: 12,
  },
  moistureValueContainer: {
    marginBottom: 8,
  },
  moistureValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10b981',
  },
  moistureUnit: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  moistureStatusContainer: {
    marginBottom: 8,
  },
  moistureBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  moistureFill: {
    height: '100%',
    borderRadius: 3,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  zoneFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  lastWatered: {
    fontSize: 11,
    color: '#94a3b8',
  },
});
