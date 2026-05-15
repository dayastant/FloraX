import React from 'react';

export default function GardenSelector({ gardens, onSelect, loading }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading gardens...</p>
      </div>
    );
  }

  return (
    <div className="garden-selector">
      <div className="selector-header">
        <h2>Select a Garden</h2>
        <p className="subtitle">Choose a garden to manage zones and irrigation</p>
      </div>

      <div className="gardens-grid">
        {gardens.map(garden => (
          <div
            key={garden.gardenId}
            className="garden-card"
            onClick={() => onSelect(garden)}
          >
            <div className="garden-icon">🏡</div>
            <h3>{garden.gardenName}</h3>
            <div className="garden-info">
              <span className="info-item">
                <i>📍</i> {garden.location}
              </span>
              <span className="info-item">
                <i>📏</i> {garden.totalArea} m²
              </span>
            </div>
            <button className="select-btn">Open Garden →</button>
          </div>
        ))}
      </div>

      {gardens.length === 0 && (
        <div className="empty-state">
          <p>No gardens found. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
