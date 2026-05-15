import React from 'react';

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
  return { label: 'OPTIMAL', color: '#06b6d4' };
};

export default function ZonesGrid({ garden, zones, onZoneSelect, onBack, loading }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading zones...</p>
      </div>
    );
  }

  return (
    <div className="zones-container">
      <div className="zones-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <div>
          <h2>{garden.gardenName}</h2>
          <p className="subtitle">{zones.length} active zones</p>
        </div>
      </div>

      <div className="zones-grid">
        {zones.map(zone => {
          const moistureStatus = getMoistureStatus(
            zone.currentMoisture,
            zone.moistureThresholdMin,
            zone.moistureThresholdMax
          );

          return (
            <div
              key={zone.zoneId}
              className="zone-box"
              onClick={() => onZoneSelect(zone)}
              style={{
                borderTop: `4px solid ${getStatusColor(zone.irrigationStatus)}`,
              }}
            >
              <div className="zone-header-row">
                <h3>{zone.zoneName}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(zone.irrigationStatus) }}
                >
                  {zone.irrigationStatus}
                </span>
              </div>

              <div className="moisture-section">
                <div className="moisture-value">
                  <span className="big-number">{zone.currentMoisture}%</span>
                  <span className="unit">Moisture</span>
                </div>
                <div className="moisture-bar-container">
                  <div
                    className="moisture-bar"
                    style={{
                      width: `${Math.min(zone.currentMoisture, 100)}%`,
                      backgroundColor: moistureStatus.color,
                    }}
                  ></div>
                </div>
                <div className="moisture-range">
                  <span>Min: {zone.moistureThresholdMin}%</span>
                  <span>Max: {zone.moistureThresholdMax}%</span>
                </div>
              </div>

              <div className="zone-footer">
                <small>Last watered: {zone.lastIrrigatedAt}</small>
                <span className="click-hint">Click for details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {zones.length === 0 && (
        <div className="empty-state">
          <p>No zones in this garden yet.</p>
        </div>
      )}
    </div>
  );
}
