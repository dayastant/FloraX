package com.example.FloraX.Service;

import com.example.FloraX.Dto.*;
import java.util.List;

/**
 * Service interface for dashboard operations.
 * Provides methods to retrieve and aggregate dashboard data.
 */
public interface DashboardService {

    /**
     * Get complete garden dashboard data including zones, alerts, and recent irrigation logs.
     */
    GardenDTO getGardenDashboard(Long gardenId);

    /**
     * Get all zones with their latest sensor readings.
     */
    List<ZoneDTO> getAllZonesWithReadings(Long gardenId);

    /**
     * Get a specific zone with its latest sensor reading.
     */
    ZoneDTO getZoneWithLatestReading(Long zoneId);

    /**
     * Get active and recent alerts for a garden.
     */
    List<AlertDTO> getGardenAlerts(Long gardenId);

    /**
     * Get recent irrigation logs for a garden.
     */
    List<IrrigationLogDTO> getRecentIrrigationLogs(Long gardenId, int limit);

    /**
     * Get all sensors for a garden with their latest readings.
     */
    List<SensorDTO> getGardenSensors(Long gardenId);

    /**
     * Get water tank status.
     */
    WaterTankDTO getWaterTankStatus(Long tankId);

    /**
     * Get all valves for a garden.
     */
    List<ValveDTO> getGardenValves(Long gardenId);

    /**
     * Get irrigation summary statistics.
     */
    IrrigationSummaryDTO getIrrigationSummary(Long gardenId);
}
