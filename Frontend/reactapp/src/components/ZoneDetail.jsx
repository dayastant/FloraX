import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export default function ZoneDetail({ zone, garden, onBack, onZoneUpdate }) {
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

      // Fetch sensors for garden
      const sensorsResponse = await axios.get(
        `${API_BASE}/dashboard/${garden.gardenId}/sensors`
      );
      // Filter for this zone's sensors
      const zonesSensors = sensorsResponse.data.filter(
        s => s.zoneId === zone.zoneId
      );
      setSensors(zonesSensors);

      // Fetch valves for garden
      const valvesResponse = await axios.get(
        `${API_BASE}/dashboard/${garden.gardenId}/valves`
      );
      // Filter for this zone's valves
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

      // Fetch water tank status
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
      // Call API to toggle valve
      await axios.post(`${API_BASE}/valves/${valveId}/toggle`, {
        status: newState ? 'OPEN' : 'CLOSED',
      });

      setValveStates(prev => ({
        ...prev,
        [valveId]: newState,
      }));

      // Update valve status in list
      setValves(
        valves.map(v =>
          v.valveId === valveId
            ? { ...v, status: newState ? 'OPEN' : 'CLOSED' }
            : v
        )
      );
    } catch (error) {
      console.error('Failed to toggle valve:', error);
      alert('Failed to toggle valve');
    }
  };

  const getMoistureTrend = () => {
    if (zoneData.currentMoisture < zoneData.moistureThresholdMin) {
      return { label: 'CRITICAL', color: '#ef4444', icon: '📉' };
    }
    if (zoneData.currentMoisture > zoneData.moistureThresholdMax) {
      return { label: 'TOO HIGH', color: '#10b981', icon: '📈' };
    }
    return { label: 'OPTIMAL', color: '#06b6d4', icon: '✓' };
  };

  const trend = getMoistureTrend();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading zone details...</p>
      </div>
    );
  }

  return (
    <div className="zone-detail">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Zones
        </button>
        <h1>{zoneData.zoneName}</h1>
      </div>

      <div className="detail-content">
        {/* Main Moisture Section */}
        <div className="moisture-card card-primary">
          <div className="card-title">Soil Moisture</div>
          <div className="moisture-display">
            <div className="moisture-circle">
              <div className="circle-content">
                <span className="moisture-value">{zoneData.currentMoisture}%</span>
                <span className="moisture-trend" style={{ color: trend.color }}>
                  {trend.icon} {trend.label}
                </span>
              </div>
            </div>
            <div className="moisture-details">
              <div className="detail-row">
                <span className="label">Current</span>
                <span className="value">{zoneData.currentMoisture}%</span>
              </div>
              <div className="detail-row">
                <span className="label">Minimum</span>
                <span className="value">{zoneData.moistureThresholdMin}%</span>
              </div>
              <div className="detail-row">
                <span className="label">Maximum</span>
                <span className="value">{zoneData.moistureThresholdMax}%</span>
              </div>
            </div>
          </div>
          <div className="progress-track">
            <div className="track-bg">
              <div
                className="track-fill"
                style={{
                  width: `${Math.min(zoneData.currentMoisture, 100)}%`,
                  backgroundColor: trend.color,
                }}
              ></div>
            </div>
            <div className="track-labels">
              <span>{zoneData.moistureThresholdMin}%</span>
              <span>{zoneData.moistureThresholdMax}%</span>
            </div>
          </div>
        </div>

        {/* Sensors Section */}
        <div className="sensors-card card-section">
          <h3 className="card-title">Sensors</h3>
          <div className="sensors-grid">
            {sensors.map(sensor => (
              <div key={sensor.sensorId} className="sensor-item">
                <div className="sensor-icon">
                  {sensor.sensorType === 'MOISTURE'
                    ? '💧'
                    : sensor.sensorType === 'TEMPERATURE'
                    ? '🌡️'
                    : '📊'}
                </div>
                <div className="sensor-info">
                  <h4>{sensor.sensorType}</h4>
                  <div className="sensor-reading">
                    <span className="value">{sensor.latestReading}</span>
                    <span className="unit">
                      {sensor.sensorType === 'MOISTURE'
                        ? '%'
                        : sensor.sensorType === 'TEMPERATURE'
                        ? '°C'
                        : 'ADC'}
                    </span>
                  </div>
                  {sensor.latestReadingRaw && (
                    <div className="sensor-adc">
                      Raw ADC: <strong>{sensor.latestReadingRaw}</strong>
                    </div>
                  )}
                  <small className="timestamp">{sensor.recordedAtFormatted}</small>
                </div>
                <span
                  className="status-dot"
                  style={{
                    backgroundColor:
                      sensor.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                  }}
                ></span>
              </div>
            ))}
          </div>
        </div>

        {/* Valves Section */}
        <div className="valves-card card-section">
          <h3 className="card-title">Irrigation Valves</h3>
          <div className="valves-list">
            {valves.map(valve => (
              <div
                key={valve.valveId}
                className={`valve-item ${
                  valveStates[valve.valveId] ? 'valve-open' : 'valve-closed'
                }`}
              >
                <div className="valve-icon">
                  {valveStates[valve.valveId] ? '🔓' : '🔒'}
                </div>
                <div className="valve-info">
                  <h4>Valve {valve.valveId}</h4>
                  <p className="valve-zone">{valve.zoneName}</p>
                  <small>Last active: {valve.lastActivatedAt}</small>
                </div>
                <button
                  className={`valve-toggle ${
                    valveStates[valve.valveId] ? 'open' : 'closed'
                  }`}
                  onClick={() =>
                    toggleValve(valve.valveId, valveStates[valve.valveId])
                  }
                >
                  {valveStates[valve.valveId] ? 'CLOSE' : 'OPEN'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Water Tank Section */}
        {tankStatus && (
          <div className="tank-card card-section">
            <h3 className="card-title">Water Tank Status</h3>
            <div className="tank-display">
              <div className="tank-visual">
                <div className="tank-container">
                  <div
                    className="tank-level"
                    style={{
                      height: `${tankStatus.fillPercentage}%`,
                      backgroundColor: getTankColor(tankStatus.fillPercentage),
                    }}
                  ></div>
                </div>
                <div className="tank-percentage">
                  {Math.round(tankStatus.fillPercentage)}%
                </div>
              </div>
              <div className="tank-info">
                <div className="info-row">
                  <span className="label">Current Level</span>
                  <span className="value">{tankStatus.currentLevelLiters}L</span>
                </div>
                <div className="info-row">
                  <span className="label">Capacity</span>
                  <span className="value">{tankStatus.capacityLiters}L</span>
                </div>
                <div className="info-row">
                  <span className="label">Available</span>
                  <span className="value">
                    {tankStatus.capacityLiters - tankStatus.currentLevelLiters}L
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zone Status Section */}
        <div className="status-card card-section">
          <h3 className="card-title">Zone Status</h3>
          <div className="status-info">
            <div className="status-row">
              <span className="label">Irrigation Status</span>
              <span
                className="status-badge"
                style={{
                  backgroundColor:
                    zoneData.irrigationStatus === 'ACTIVE'
                      ? '#10b981'
                      : zoneData.irrigationStatus === 'IDLE'
                      ? '#3b82f6'
                      : '#ef4444',
                }}
              >
                {zoneData.irrigationStatus}
              </span>
            </div>
            <div className="status-row">
              <span className="label">Last Irrigated</span>
              <span className="value">{zoneData.lastIrrigatedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTankColor(percentage) {
  if (percentage < 20) return '#ef4444';
  if (percentage < 50) return '#fbbf24';
  return '#10b981';
}
