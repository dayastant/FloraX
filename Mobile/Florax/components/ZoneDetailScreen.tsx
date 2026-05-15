import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const getTankColor = (percentage) => {
  if (percentage < 20) return '#ef4444';
  if (percentage < 50) return '#fbbf24';
  return '#10b981';
};

export default function ZoneDetailScreen({
  zone,
  garden,
  onBack,
  onZoneUpdate,
}) {
  const [zoneData, setZoneData] = useState(zone);
  const [sensors, setSensors] = useState([]);
  const [valves, setValves] = useState([]);
  const [tankStatus, setTankStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valveStates, setValveStates] = useState({});

  useEffect(() => {
    fetchZoneDetails();
  }, [zone.zoneId]);

  const fetchZoneDetails = async () => {
    try {
      setLoading(true);

      // Fetch zone with latest reading
      const zoneResponse = await axios.get(
        `${API_BASE}/dashboard/zone/${zone.zoneId}`
      );
      setZoneData(zoneResponse.data);

      // Fetch sensors
      const sensorsResponse = await axios.get(
        `${API_BASE}/dashboard/${garden.gardenId}/sensors`
      );
      const zoneSensors = sensorsResponse.data.filter(
        s => s.zoneId === zone.zoneId
      );
      setSensors(zoneSensors);

      // Fetch valves
      const valvesResponse = await axios.get(
        `${API_BASE}/dashboard/${garden.gardenId}/valves`
      );
      const zoneValves = valvesResponse.data.filter(
        v => v.zoneId === zone.zoneId
      );
      setValves(zoneValves);
      zoneValves.forEach(v => {
        setValveStates(prev => ({
          ...prev,
          [v.valveId]: v.status === 'OPEN',
        }));
      });

      // Fetch water tank
      const tankResponse = await axios.get(
        `${API_BASE}/dashboard/${garden.gardenId}/tank/1`
      );
      setTankStatus(tankResponse.data);
    } catch (error) {
      console.error('Failed to fetch zone details:', error);
      // Demo data
      setSensors([
        {
          sensorId: 1,
          sensorType: 'MOISTURE',
          status: 'ACTIVE',
          latestReading: 65,
          latestReadingRaw: 512,
          recordedAtFormatted: '2 mins ago',
        },
        {
          sensorId: 2,
          sensorType: 'TEMPERATURE',
          status: 'ACTIVE',
          latestReading: 28,
          recordedAtFormatted: '3 mins ago',
        },
      ]);
      setValves([
        {
          valveId: 1,
          zoneName: zone.zoneName,
          status: 'CLOSED',
          lastActivatedAt: '2 hours ago',
        },
        {
          valveId: 2,
          zoneName: zone.zoneName,
          status: 'OPEN',
          lastActivatedAt: '10 mins ago',
        },
      ]);
      setTankStatus({
        tankId: 1,
        currentLevelLiters: 450,
        capacityLiters: 1000,
        fillPercentage: 45,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleValve = async (valveId, currentState) => {
    try {
      const newState = !currentState;
      await axios.post(`${API_BASE}/valves/${valveId}/toggle`, {
        status: newState ? 'OPEN' : 'CLOSED',
      });

      setValveStates(prev => ({
        ...prev,
        [valveId]: newState,
      }));

      setValves(
        valves.map(v =>
          v.valveId === valveId
            ? { ...v, status: newState ? 'OPEN' : 'CLOSED' }
            : v
        )
      );
    } catch (error) {
      console.error('Failed to toggle valve:', error);
      Alert.alert('Error', 'Failed to toggle valve');
    }
  };

  const getMoistureTrend = () => {
    if (zoneData.currentMoisture < zoneData.moistureThresholdMin) {
      return { label: 'LOW', color: '#ef4444', icon: '📉' };
    }
    if (zoneData.currentMoisture > zoneData.moistureThresholdMax) {
      return { label: 'HIGH', color: '#10b981', icon: '📈' };
    }
    return { label: 'OPTIMAL', color: '#06b6d4', icon: '✓' };
  };

  const trend = getMoistureTrend();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading details...</Text>
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
        <Text style={styles.headerTitle}>{zoneData.zoneName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Moisture Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💧 Soil Moisture</Text>

          <View style={styles.moistureDisplay}>
            <View style={styles.moistureCircle}>
              <Text style={styles.circleMoisture}>{zoneData.currentMoisture}%</Text>
              <Text style={[styles.circleTrend, { color: trend.color }]}>
                {trend.label}
              </Text>
            </View>

            <View style={styles.moistureInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current</Text>
                <Text style={styles.infoValue}>{zoneData.currentMoisture}%</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Min</Text>
                <Text style={styles.infoValue}>
                  {zoneData.moistureThresholdMin}%
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Max</Text>
                <Text style={styles.infoValue}>
                  {zoneData.moistureThresholdMax}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.trackBg}>
              <View
                style={[
                  styles.trackFill,
                  {
                    width: `${Math.min(zoneData.currentMoisture, 100)}%`,
                    backgroundColor: trend.color,
                  },
                ]}
              />
            </View>
            <View style={styles.trackLabels}>
              <Text style={styles.trackLabel}>
                {zoneData.moistureThresholdMin}%
              </Text>
              <Text style={styles.trackLabel}>
                {zoneData.moistureThresholdMax}%
              </Text>
            </View>
          </View>
        </View>

        {/* Sensors */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Sensors</Text>
          {sensors.map(sensor => (
            <View key={sensor.sensorId} style={styles.sensorItem}>
              <View style={styles.sensorLeft}>
                <Text style={styles.sensorIcon}>
                  {sensor.sensorType === 'MOISTURE'
                    ? '💧'
                    : sensor.sensorType === 'TEMPERATURE'
                    ? '🌡️'
                    : '📊'}
                </Text>
              </View>
              <View style={styles.sensorMiddle}>
                <Text style={styles.sensorType}>{sensor.sensorType}</Text>
                {sensor.latestReadingRaw && (
                  <Text style={styles.sensorAdc}>
                    ADC: {sensor.latestReadingRaw}
                  </Text>
                )}
                <Text style={styles.sensorTime}>{sensor.recordedAtFormatted}</Text>
              </View>
              <View style={styles.sensorRight}>
                <Text style={styles.sensorValue}>{sensor.latestReading}</Text>
                <Text style={styles.sensorUnit}>
                  {sensor.sensorType === 'MOISTURE'
                    ? '%'
                    : sensor.sensorType === 'TEMPERATURE'
                    ? '°C'
                    : 'ADC'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Valves */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚰 Irrigation Valves</Text>
          {valves.map(valve => (
            <View key={valve.valveId} style={styles.valveItem}>
              <View style={styles.valveLeft}>
                <Text style={styles.valveIcon}>
                  {valveStates[valve.valveId] ? '🔓' : '🔒'}
                </Text>
              </View>
              <View style={styles.valveMiddle}>
                <Text style={styles.valveName}>Valve {valve.valveId}</Text>
                <Text style={styles.valveTime}>{valve.lastActivatedAt}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.valveButton,
                  valveStates[valve.valveId]
                    ? styles.valveButtonOpen
                    : styles.valveButtonClosed,
                ]}
                onPress={() =>
                  toggleValve(valve.valveId, valveStates[valve.valveId])
                }
              >
                <Text style={styles.valveButtonText}>
                  {valveStates[valve.valveId] ? 'CLOSE' : 'OPEN'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Water Tank */}
        {tankStatus && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏊 Water Tank</Text>
            <View style={styles.tankDisplay}>
              <View style={styles.tankVisual}>
                <View style={styles.tankContainer}>
                  <View
                    style={[
                      styles.tankLevel,
                      {
                        height: `${tankStatus.fillPercentage}%`,
                        backgroundColor: getTankColor(tankStatus.fillPercentage),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.tankPercent}>
                  {Math.round(tankStatus.fillPercentage)}%
                </Text>
              </View>
              <View style={styles.tankInfo}>
                <View style={styles.tankInfoRow}>
                  <Text style={styles.tankLabel}>Current</Text>
                  <Text style={styles.tankValue}>
                    {tankStatus.currentLevelLiters}L
                  </Text>
                </View>
                <View style={styles.tankInfoRow}>
                  <Text style={styles.tankLabel}>Capacity</Text>
                  <Text style={styles.tankValue}>
                    {tankStatus.capacityLiters}L
                  </Text>
                </View>
                <View style={styles.tankInfoRow}>
                  <Text style={styles.tankLabel}>Available</Text>
                  <Text style={styles.tankValue}>
                    {tankStatus.capacityLiters - tankStatus.currentLevelLiters}L
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Zone Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📋 Zone Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Irrigation</Text>
            <View
              style={[
                styles.statusValue,
                {
                  backgroundColor:
                    zoneData.irrigationStatus === 'ACTIVE'
                      ? '#10b981'
                      : zoneData.irrigationStatus === 'IDLE'
                      ? '#3b82f6'
                      : '#ef4444',
                },
              ]}
            >
              <Text style={styles.statusValueText}>
                {zoneData.irrigationStatus}
              </Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Last Watered</Text>
            <Text style={styles.statusInfo}>{zoneData.lastIrrigatedAt}</Text>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },

  // Moisture
  moistureDisplay: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  moistureCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleMoisture: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10b981',
  },
  circleTrend: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  moistureInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoLabel: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 13,
  },
  infoValue: {
    color: '#1e293b',
    fontWeight: '700',
    fontSize: 14,
  },
  progressTrack: {
    marginTop: 12,
  },
  trackBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  trackLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // Sensors
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sensorLeft: {
    marginRight: 12,
  },
  sensorIcon: {
    fontSize: 24,
  },
  sensorMiddle: {
    flex: 1,
  },
  sensorType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  sensorAdc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  sensorTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  sensorRight: {
    alignItems: 'flex-end',
  },
  sensorValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  sensorUnit: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Valves
  valveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  valveLeft: {
    marginRight: 12,
  },
  valveIcon: {
    fontSize: 24,
  },
  valveMiddle: {
    flex: 1,
  },
  valveName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  valveTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  valveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  valveButtonOpen: {
    backgroundColor: '#10b981',
  },
  valveButtonClosed: {
    backgroundColor: '#e2e8f0',
  },
  valveButtonText: {
    fontWeight: '700',
    fontSize: 11,
    color: '#fff',
  },

  // Tank
  tankDisplay: {
    flexDirection: 'row',
    gap: 20,
  },
  tankVisual: {
    alignItems: 'center',
  },
  tankContainer: {
    width: 70,
    height: 120,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  tankLevel: {
    width: '100%',
  },
  tankPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10b981',
  },
  tankInfo: {
    flex: 1,
  },
  tankInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tankLabel: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 13,
  },
  tankValue: {
    color: '#1e293b',
    fontWeight: '700',
    fontSize: 14,
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statusLabel: {
    color: '#64748b',
    fontWeight: '500',
    fontSize: 14,
  },
  statusValue: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusValueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  statusInfo: {
    color: '#1e293b',
    fontWeight: '600',
    fontSize: 14,
  },
});
