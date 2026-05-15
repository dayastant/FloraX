# Mobile App - Garden Control Integration

## Overview
Complete React Native/Expo mobile application with the same navigation flow:

```
Garden Selector → Zones Grid → Zone Detail (Control Panel)
```

## Components Created

### 1. **GardenManagementScreen** (`app/gardenManagement.tsx`)
- Main container managing state and navigation
- Orchestrates the 3-screen flow
- Handles garden and zone selection

### 2. **GardenSelectorScreen** (`components/GardenSelectorScreen.tsx`)
Mobile-optimized garden list with:
- Scrollable garden cards
- Garden name, location, area
- "Open Garden" buttons
- Touch-optimized UI (larger tap targets)
- Demo data fallback

### 3. **ZonesGridScreen** (`components/ZonesGridScreen.tsx`)
Mobile-optimized zone grid with:
- 2-column responsive grid layout
- Zone boxes showing:
  - Zone name with status badge
  - Soil moisture percentage
  - Visual moisture bar
  - Min/Max thresholds
  - Last watered time
- Touchable boxes for zone selection
- Back navigation

### 4. **ZoneDetailScreen** (`components/ZoneDetailScreen.tsx`)
Complete control panel with scrollable sections:
- **Moisture Card** - Circular display with trend
- **Sensors** - List with temperature, moisture, ADC values
- **Valves** - OPEN/CLOSE buttons for irrigation control
- **Water Tank** - Visual level display
- **Zone Status** - Current irrigation status

## File Structure

```
Mobile/Florax/
├── app/
│   ├── gardenManagement.tsx         (Main screen)
│   ├── (_layout).tsx                (Update to include routes)
│   └── ...
├── components/
│   ├── GardenSelectorScreen.tsx
│   ├── ZonesGridScreen.tsx
│   ├── ZoneDetailScreen.tsx
│   └── ...
├── navigation/
│   └── GardenManagementNavigator.tsx
└── ...
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd Mobile/Florax
npm install axios
```

### 2. Update API Configuration
In each screen component, update the `API_BASE`:
```typescript
const API_BASE = 'http://localhost:8080/api';
```

For production:
```typescript
const API_BASE = 'https://your-production-api.com/api';
```

### 3. Add to App Navigation
Update `app/_layout.tsx` to include the garden management screen:

```typescript
import GardenManagementNavigator from '../navigation/GardenManagementNavigator';

// In your navigation setup:
<Stack.Screen name="GardenManagement" component={GardenManagementNavigator} />
```

### 4. Run the App
```bash
npm start
# Then select:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on device
```

## Features

### Garden Selector
- Browse all gardens
- Card-based design optimized for touch
- Smooth navigation to zones

### Zones Grid
- 2-column grid layout (adapts to screen size)
- Responsive moisture visualization
- Color-coded status indicators
- Quick zone overview

### Zone Detail Control Panel
- Scrollable interface for smaller screens
- Soil moisture: Circular display with large numbers
- Sensors: ADC values, temperature, reading timestamps
- Valves: Interactive OPEN/CLOSE buttons with visual feedback
- Water Tank: Visual fill level indicator
- Zone Status: Current irrigation state

## Mobile-Specific Optimizations

1. **Touch Targets** - Minimum 44x44 points (Apple standard)
2. **Scrollable Content** - ScrollView for small screens
3. **Icons** - Material Community Icons for familiar UI
4. **Color Coding** - Same color scheme as web app
5. **Responsive Layouts** - Flexbox-based responsive grid
6. **Loading States** - ActivityIndicator spinners
7. **Error Handling** - Alert dialogs for errors
8. **Haptic Feedback** - Optional haptics on button press

## API Endpoints Used

Same as web app:
```
GET /api/dashboard/{gardenId}
GET /api/dashboard/{gardenId}/zones
GET /api/dashboard/zone/{zoneId}
GET /api/dashboard/{gardenId}/sensors
GET /api/dashboard/{gardenId}/valves
GET /api/dashboard/{gardenId}/tank/{tankId}
POST /api/valves/{valveId}/toggle
```

## Demo Mode
If API is unreachable, app uses built-in demo data:
- 3 sample gardens
- 4 zones per garden
- Mock sensor readings
- Mock valve states
- Mock tank levels

Perfect for development and testing without backend!

## Design System

### Colors
- **Primary Green** (#10b981) - Active, optimal states
- **Secondary Blue** (#3b82f6) - Idle states
- **Danger Red** (#ef4444) - Alerts
- **Warning Yellow** (#fbbf24) - Low levels
- **Info Cyan** (#06b6d4) - Information
- **Light Gray** (#f8fafc) - Background

### Typography
- **Headers** - fontWeight: 700-800
- **Body** - fontWeight: 500-600
- **Labels** - fontWeight: 500, smaller sizes

### Spacing
- Card padding: 16px
- Section gap: 12px
- Item padding: 12px
- Border radius: 12px (cards), 6px (buttons)

## Future Enhancements
- Real-time WebSocket updates
- Historical charts
- Scheduling interface
- Push notifications for alerts
- Offline caching
- Biometric authentication
- Dark mode support
