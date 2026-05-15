# Garden Control Frontend Integration Guide

## Overview
Complete React frontend for FloraX garden control system with 3 main views:
1. **Garden Selector** - Choose which garden to manage
2. **Zones Grid** - View all zones with moisture status
3. **Zone Details** - Comprehensive control panel for each zone

## Features

### Garden Selector View
- Browse all gardens
- View garden name, location, and area
- Click to select and manage a garden

### Zones Grid View
- Display all zones as clickable boxes
- Show current soil moisture percentage
- Display irrigation status (ACTIVE/IDLE/ALERT)
- Visual progress bar for moisture level
- Color-coded status badges
- Last irrigation timestamp

### Zone Detail View (Main Control Panel)
- **Soil Moisture Section** (Primary Card)
  - Large circular display with current moisture %
  - Trend indicator (OPTIMAL/CRITICAL/TOO HIGH)
  - Min/Max threshold display
  - Visual progress track with thresholds marked

- **Sensors Section**
  - Moisture sensor with percentage and raw ADC value
  - Temperature sensor
  - Latest sensor readings with timestamps
  - Sensor status indicators (ACTIVE/INACTIVE)

- **Irrigation Valves Section**
  - List of all valves in the zone
  - OPEN/CLOSE buttons for manual control
  - Current valve status
  - Last activation time
  - Color-coded visual states

- **Water Tank Status**
  - Tank level percentage
  - Current/capacity liters display
  - Visual tank fill indicator
  - Available water calculation

- **Zone Status**
  - Irrigation status (ACTIVE/IDLE/ALERT)
  - Last irrigation time

## Installation

1. **Install dependencies:**
```bash
npm install react-router-dom axios
```

2. **File Structure:**
```
src/
├── pages/
│   ├── GardenDashboard.jsx       (Main container)
│   └── GardenDashboard.css       (Styles)
├── components/
│   ├── GardenSelector.jsx        (Garden list)
│   ├── ZonesGrid.jsx             (Zones display)
│   └── ZoneDetail.jsx            (Control panel)
└── App.jsx                        (Router setup)
```

## API Endpoints Used

### Get Dashboard Data
```
GET /api/dashboard/{gardenId}
GET /api/dashboard/{gardenId}/zones
GET /api/dashboard/zone/{zoneId}
GET /api/dashboard/{gardenId}/sensors
GET /api/dashboard/{gardenId}/valves
GET /api/dashboard/{gardenId}/tank/{tankId}
```

### Control Valves
```
POST /api/valves/{valveId}/toggle
Body: { status: "OPEN" | "CLOSED" }
```

## Configuration

Update the `API_BASE` constant in `GardenDashboard.jsx`:
```javascript
const API_BASE = 'http://localhost:8080/api';  // Change to your API endpoint
```

## Usage

### Starting the App
```bash
npm start
```

The app will load at `http://localhost:3000/dashboard`

### User Flow
1. App loads → Shows garden selector
2. Click garden card → Loads all zones in that garden
3. Click zone box → Opens detailed control panel
4. In detail view:
   - View all sensor readings and raw ADC values
   - Click OPEN/CLOSE valve buttons to control irrigation
   - Monitor water tank level
   - Track irrigation status

## Styling

The UI features:
- Modern gradient design with green primary color (#10b981)
- Smooth animations and transitions
- Responsive grid layout (works on mobile/tablet/desktop)
- Color-coded status indicators
- Visual progress bars and circular displays
- Hover effects and smooth transitions
- Accessible dark text on light backgrounds

## Color Scheme
- **Primary (Green)**: #10b981 - Active status, positive states
- **Secondary (Blue)**: #3b82f6 - Idle/informational states
- **Danger (Red)**: #ef4444 - Alert/error states
- **Warning (Yellow)**: #fbbf24 - Low levels
- **Info (Cyan)**: #06b6d4 - Additional information

## Responsive Design
- Mobile (< 768px): Single column layouts
- Tablet (768px - 1024px): 2 columns
- Desktop (> 1024px): Auto-fit columns with 320px+ width

## Demo Mode
If backend API is unavailable, the app uses demo data for:
- Gardens list
- Zones list
- Sensor readings
- Valve status
- Water tank levels

This allows testing the UI without a backend server.

## Future Enhancements
- Add real-time WebSocket updates
- Implement charts for historical data
- Add scheduling for automated irrigation
- User authentication
- Multi-user support
- Export data/reports
- Mobile app version
