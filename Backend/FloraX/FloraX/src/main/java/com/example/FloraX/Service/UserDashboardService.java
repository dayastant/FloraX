package com.example.FloraX.Service;

import com.example.FloraX.Dto.*;

import java.util.List;

/**
 * UserDashboardService — Complete Service Interface
 *
 * Provides all operations needed to power the user dashboard:
 * - Full dashboard snapshot
 * - Summary statistics
 * - Garden / Zone details
 * - Sensor & sensor readings
 * - Irrigation logs (daily / weekly / monthly)
 * - Alerts (active, resolved, by type)
 * - Water tank status
 * - Valve status
 *
 * All methods accept the authenticated user's email (extracted from JWT).
 */
public interface UserDashboardService {

    // ══════════════════════════════════════════════════════════════════════════
    // 1. FULL DASHBOARD
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns the complete dashboard response for the authenticated user.
     * Includes summary stats, all gardens with zones, sensors, alerts,
     * recent irrigation logs, and water tank status.
     */
    UserDashboardResponse getDashboard(String email);

    // ══════════════════════════════════════════════════════════════════════════
    // 2. SUMMARY STATISTICS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns aggregated summary stats for all gardens belonging to the user:
     * total gardens, zones, sensors, active/faulty sensors, valves,
     * water usage today/week/month, alert counts by type, tank levels.
     */
    DashboardSummaryDTO getDashboardSummary(String email);

    // ══════════════════════════════════════════════════════════════════════════
    // 3. GARDEN OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all gardens belonging to the user with their zones,
     * recent alerts, and irrigation logs.
     */
    List<GardenDTO> getAllGardens(String email);

    /**
     * Returns a single garden by ID.
     * Throws RuntimeException if the garden doesn't belong to the user.
     */
    GardenDTO getGardenById(String email, Long gardenId);

    // ══════════════════════════════════════════════════════════════════════════
    // 4. ZONE OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all zones across all gardens of the user,
     * each with latest moisture reading and irrigation status.
     */
    List<ZoneDTO> getAllZones(String email);

    /**
     * Returns all zones belonging to the specified garden,
     * each with the latest sensor reading and status.
     */
    List<ZoneDTO> getZonesByGarden(String email, Long gardenId);

    /**
     * Returns a single zone by ID with its sensors, latest readings,
     * and last irrigation log.
     */
    ZoneDTO getZoneById(String email, Long zoneId);

    /**
     * Returns all zones currently in ALERT status (moisture below threshold).
     */
    List<ZoneDTO> getAlertZones(String email);

    /**
     * Returns all zones that are actively being irrigated right now.
     */
    List<ZoneDTO> getActiveIrrigationZones(String email);

    // ══════════════════════════════════════════════════════════════════════════
    // 5. SENSOR OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all sensors across all zones of the user,
     * each with their latest reading.
     */
    List<SensorDTO> getAllSensors(String email);

    /**
     * Returns all sensors belonging to the specified zone,
     * with latest readings.
     */
    List<SensorDTO> getSensorsByZone(String email, Long zoneId);

    /**
     * Returns only sensors with FAULTY or INACTIVE status.
     */
    List<SensorDTO> getFaultySensors(String email);

    // ══════════════════════════════════════════════════════════════════════════
    // 6. IRRIGATION LOG OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all irrigation logs from today across all gardens of the user.
     */
    List<IrrigationLogDTO> getTodayIrrigationLogs(String email);

    /**
     * Returns irrigation logs from the past 7 days.
     */
    List<IrrigationLogDTO> getWeeklyIrrigationLogs(String email);

    /**
     * Returns irrigation logs from the past 30 days.
     */
    List<IrrigationLogDTO> getMonthlyIrrigationLogs(String email);

    /**
     * Returns the last N irrigation logs across all user gardens.
     */
    List<IrrigationLogDTO> getRecentIrrigationLogs(String email, int limit);

    /**
     * Returns irrigation logs for a specific zone.
     */
    List<IrrigationLogDTO> getIrrigationLogsByZone(String email, Long zoneId, int limit);

    /**
     * Returns the total water volume used today (litres) across all gardens.
     */
    Double getTotalWaterUsedToday(String email);

    /**
     * Returns the total water volume used this week (litres).
     */
    Double getTotalWaterUsedThisWeek(String email);

    /**
     * Returns the total water volume used this month (litres).
     */
    Double getTotalWaterUsedThisMonth(String email);

    // ══════════════════════════════════════════════════════════════════════════
    // 7. ALERT OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all ACTIVE alerts across all gardens of the user.
     */
    List<AlertDTO> getActiveAlerts(String email);

    /**
     * Returns alerts resolved today.
     */
    List<AlertDTO> getResolvedAlertsToday(String email);

    /**
     * Returns the last N alerts (any status) across all gardens.
     */
    List<AlertDTO> getRecentAlerts(String email, int limit);

    /**
     * Returns alerts for a specific garden.
     */
    List<AlertDTO> getAlertsByGarden(String email, Long gardenId);

    /**
     * Returns the count of active alerts grouped by alert type.
     * Key = AlertType name, Value = count.
     */
    java.util.Map<String, Long> getAlertCountByType(String email);

    /**
     * Marks an alert as RESOLVED.
     * Throws exception if the alert doesn't belong to the user.
     */
    void resolveAlert(String email, Long alertId);

    // ══════════════════════════════════════════════════════════════════════════
    // 8. WATER TANK OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all water tanks across all gardens of the user,
     * with their current fill level and status.
     */
    List<WaterTankDTO> getAllWaterTanks(String email);

    /**
     * Returns all water tanks for a specific garden.
     */
    List<WaterTankDTO> getWaterTanksByGarden(String email, Long gardenId);

    /**
     * Returns tanks that are LOW or CRITICAL on water level.
     */
    List<WaterTankDTO> getLowWaterTanks(String email);

    // ══════════════════════════════════════════════════════════════════════════
    // 9. VALVE OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /**
     * Returns all valves across all zones of the user,
     * with current status (OPEN, CLOSED, FAULTY).
     */
    List<ValveDTO> getAllValves(String email);

    /**
     * Returns all valves in a specific zone.
     */
    List<ValveDTO> getValvesByZone(String email, Long zoneId);

    /**
     * Returns all valves that are currently OPEN (actively irrigating).
     */
    List<ValveDTO> getOpenValves(String email);
}
