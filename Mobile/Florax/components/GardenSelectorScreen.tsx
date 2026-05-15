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

export default function GardenSelectorScreen({ onSelect }) {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGardens();
  }, []);

  const fetchGardens = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/gardens`);
      setGardens(response.data);
    } catch (error) {
      console.error('Failed to fetch gardens:', error);
      // Demo data
      setGardens([
        {
          gardenId: 1,
          gardenName: 'Main Garden',
          location: 'Backyard',
          totalArea: 500,
        },
        {
          gardenId: 2,
          gardenName: 'Greenhouse',
          location: 'North Side',
          totalArea: 200,
        },
        {
          gardenId: 3,
          gardenName: 'Patio Garden',
          location: 'Rooftop',
          totalArea: 150,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderGardenCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gardenCard}
      onPress={() => onSelect(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>🏡</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Text style={styles.gardenName}>{item.gardenName}</Text>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="map-marker" size={16} color="#3b82f6" />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="ruler" size={16} color="#10b981" />
        <Text style={styles.infoText}>{item.totalArea} m²</Text>
      </View>

      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Open Garden</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading gardens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌱 FloraX</Text>
        <Text style={styles.headerSubtitle}>Select a Garden</Text>
      </View>

      {/* Gardens List */}
      <FlatList
        data={gardens}
        renderItem={renderGardenCard}
        keyExtractor={item => item.gardenId.toString()}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No gardens found</Text>
          </View>
        }
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#f8fafc',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  gardenCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 32,
  },
  moreButton: {
    padding: 8,
  },
  gardenName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 6,
  },
  infoText: {
    marginLeft: 8,
    color: '#64748b',
    fontSize: 14,
  },
  selectButton: {
    backgroundColor: '#10b981',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '700',
    marginRight: 8,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
});
