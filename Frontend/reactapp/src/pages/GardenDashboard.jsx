import React, { useState, useEffect } from 'react';
import './GardenDashboard.css';
import GardenSelector from './components/GardenSelector';
import ZonesGrid from './components/ZonesGrid';
import ZoneDetail from './components/ZoneDetail';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export default function GardenDashboard() {
  const [currentView, setCurrentView] = useState('gardens'); // 'gardens', 'zones', 'detail'
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch gardens
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
        { gardenId: 1, gardenName: 'Main Garden', location: 'Backyard', totalArea: 500 },
        { gardenId: 2, gardenName: 'Greenhouse', location: 'North Side', totalArea: 200 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGardenSelect = async (garden) => {
    setSelectedGarden(garden);
    setCurrentView('zones');
    await fetchZones(garden.gardenId);
  };

  const fetchZones = async (gardenId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/dashboard/${gardenId}/zones`);
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
      ]);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="garden-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🌱 FloraX Garden Control</h1>
          <p>Intelligent Irrigation Management</p>
        </div>
      </header>

      <main className="dashboard-main">
        {currentView === 'gardens' && (
          <GardenSelector gardens={gardens} onSelect={handleGardenSelect} loading={loading} />
        )}

        {currentView === 'zones' && selectedGarden && (
          <ZonesGrid
            garden={selectedGarden}
            zones={zones}
            onZoneSelect={handleZoneSelect}
            onBack={handleBack}
            loading={loading}
          />
        )}

        {currentView === 'detail' && selectedZone && selectedGarden && (
          <ZoneDetail
            zone={selectedZone}
            garden={selectedGarden}
            onBack={handleBack}
            onZoneUpdate={(updated) => {
              setSelectedZone(updated);
              setZones(zones.map(z => z.zoneId === updated.zoneId ? updated : z));
            }}
          />
        )}
      </main>
    </div>
  );
}
