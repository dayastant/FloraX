import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const API_BASE = 'http://localhost:8080/api';

// Import screen components
import GardenSelectorScreen from '../components/GardenSelectorScreen';
import ZonesGridScreen from '../components/ZonesGridScreen';
import ZoneDetailScreen from '../components/ZoneDetailScreen';

export default function GardenManagementScreen() {
  const [currentView, setCurrentView] = useState('gardens'); // 'gardens', 'zones', 'detail'
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGardenSelect = (garden) => {
    setSelectedGarden(garden);
    setCurrentView('zones');
  };

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    setCurrentView('detail');
  };

  const handleBack = () => {
    if (currentView === 'detail') {
      setCurrentView('zones');
    } else if (currentView === 'zones') {
      setCurrentView('gardens');
    }
  };

  const handleZoneUpdate = (updated) => {
    setSelectedZone(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentView === 'gardens' && (
        <GardenSelectorScreen onSelect={handleGardenSelect} />
      )}

      {currentView === 'zones' && selectedGarden && (
        <ZonesGridScreen
          garden={selectedGarden}
          onZoneSelect={handleZoneSelect}
          onBack={handleBack}
        />
      )}

      {currentView === 'detail' && selectedZone && selectedGarden && (
        <ZoneDetailScreen
          zone={selectedZone}
          garden={selectedGarden}
          onBack={handleBack}
          onZoneUpdate={handleZoneUpdate}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
