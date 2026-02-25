package com.example.FloraX.Controller;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Service.UserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class UserDashboardController {

    private final UserDashboardService dashboardService;

    // Private helper — extracts email from JWT via Spring Security
    private String email(Authentication auth) {
        return auth.getName();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 1. FULL DASHBOARD
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/me — complete dashboard snapshot */
    @GetMapping("/me")
    public ResponseEntity<UserDashboardResponse> getMyDashboard(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getDashboard(email(auth)));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 2. SUMMARY STATISTICS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/summary — aggregated stat block */
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getDashboardSummary(email(auth)));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 3. GARDEN OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/gardens — all gardens with zones, alerts, logs */
    @GetMapping("/gardens")
    public ResponseEntity<List<GardenDTO>> getGardens(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAllGardens(email(auth)));
    }

    /** GET /api/dashboard/gardens/{gardenId} */
    @GetMapping("/gardens/{gardenId}")
    public ResponseEntity<GardenDTO> getGarden(Authentication auth, @PathVariable Long gardenId) {
        return ResponseEntity.ok(dashboardService.getGardenById(email(auth), gardenId));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 4. ZONE OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/zones — all zones with live moisture + status */
    @GetMapping("/zones")
    public ResponseEntity<List<ZoneDTO>> getZones(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAllZones(email(auth)));
    }

    /** GET /api/dashboard/gardens/{gardenId}/zones */
    @GetMapping("/gardens/{gardenId}/zones")
    public ResponseEntity<List<ZoneDTO>> getZonesByGarden(Authentication auth, @PathVariable Long gardenId) {
        return ResponseEntity.ok(dashboardService.getZonesByGarden(email(auth), gardenId));
    }

    /** GET /api/dashboard/zones/{zoneId} */
    @GetMapping("/zones/{zoneId}")
    public ResponseEntity<ZoneDTO> getZone(Authentication auth, @PathVariable Long zoneId) {
        return ResponseEntity.ok(dashboardService.getZoneById(email(auth), zoneId));
    }

    /** GET /api/dashboard/zones/alert — zones below moisture threshold */
    @GetMapping("/zones/alert")
    public ResponseEntity<List<ZoneDTO>> getAlertZones(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAlertZones(email(auth)));
    }

    /** GET /api/dashboard/zones/active — zones being irrigated now */
    @GetMapping("/zones/active")
    public ResponseEntity<List<ZoneDTO>> getActiveZones(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getActiveIrrigationZones(email(auth)));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 5. SENSOR OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/sensors — all sensors with latest readings */
    @GetMapping("/sensors")
    public ResponseEntity<List<SensorDTO>> getSensors(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAllSensors(email(auth)));
    }

    /** GET /api/dashboard/zones/{zoneId}/sensors */
    @GetMapping("/zones/{zoneId}/sensors")
    public ResponseEntity<List<SensorDTO>> getSensorsByZone(Authentication auth, @PathVariable Long zoneId) {
        return ResponseEntity.ok(dashboardService.getSensorsByZone(email(auth), zoneId));
    }

    /** GET /api/dashboard/sensors/faulty — faulty + inactive sensors */
    @GetMapping("/sensors/faulty")
    public ResponseEntity<List<SensorDTO>> getFaultySensors(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getFaultySensors(email(auth)));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 6. IRRIGATION LOG OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/irrigation/today */
    @GetMapping("/irrigation/today")
    public ResponseEntity<List<IrrigationLogDTO>> getTodayLogs(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getTodayIrrigationLogs(email(auth)));
    }

    /** GET /api/dashboard/irrigation/weekly */
    @GetMapping("/irrigation/weekly")
    public ResponseEntity<List<IrrigationLogDTO>> getWeeklyLogs(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getWeeklyIrrigationLogs(email(auth)));
    }

    /** GET /api/dashboard/irrigation/monthly */
    @GetMapping("/irrigation/monthly")
    public ResponseEntity<List<IrrigationLogDTO>> getMonthlyLogs(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getMonthlyIrrigationLogs(email(auth)));
    }

    /** GET /api/dashboard/irrigation/recent?limit=10 */
    @GetMapping("/irrigation/recent")
    public ResponseEntity<List<IrrigationLogDTO>> getRecentLogs(
            Authentication auth,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentIrrigationLogs(email(auth), limit));
    }

    /** GET /api/dashboard/zones/{zoneId}/irrigation?limit=10 */
    @GetMapping("/zones/{zoneId}/irrigation")
    public ResponseEntity<List<IrrigationLogDTO>> getLogsByZone(
            Authentication auth,
            @PathVariable Long zoneId,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getIrrigationLogsByZone(email(auth), zoneId, limit));
    }

    /** GET /api/dashboard/water-usage/today */
    @GetMapping("/water-usage/today")
    public ResponseEntity<Double> getWaterUsageToday(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getTotalWaterUsedToday(email(auth)));
    }

    /** GET /api/dashboard/water-usage/weekly */
    @GetMapping("/water-usage/weekly")
    public ResponseEntity<Double> getWaterUsageWeekly(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getTotalWaterUsedThisWeek(email(auth)));
    }

    /** GET /api/dashboard/water-usage/monthly */
    @GetMapping("/water-usage/monthly")
    public ResponseEntity<Double> getWaterUsageMonthly(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getTotalWaterUsedThisMonth(email(auth)));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 7. ALERT OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/alerts — active alerts */
    @GetMapping("/alerts")
    public ResponseEntity<List<AlertDTO>> getActiveAlerts(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getActiveAlerts(email(auth)));
    }

    /** GET /api/dashboard/alerts/resolved-today */
    @GetMapping("/alerts/resolved-today")
    public ResponseEntity<List<AlertDTO>> getResolvedToday(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getResolvedAlertsToday(email(auth)));
    }

    /** GET /api/dashboard/alerts/recent?limit=10 */
    @GetMapping("/alerts/recent")
    public ResponseEntity<List<AlertDTO>> getRecentAlerts(
            Authentication auth,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentAlerts(email(auth), limit));
    }

    /** GET /api/dashboard/gardens/{gardenId}/alerts */
    @GetMapping("/gardens/{gardenId}/alerts")
    public ResponseEntity<List<AlertDTO>> getAlertsByGarden(Authentication auth, @PathVariable Long gardenId) {
        return ResponseEntity.ok(dashboardService.getAlertsByGarden(email(auth), gardenId));
    }

    /**
     * GET /api/dashboard/alerts/count-by-type — { "LOW_WATER": 2, "DRY_SOIL": 1 }
     */
    @GetMapping("/alerts/count-by-type")
    public ResponseEntity<Map<String, Long>> getAlertsByType(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAlertCountByType(email(auth)));
    }

    /** PUT /api/dashboard/alerts/{alertId}/resolve */
    @PutMapping("/alerts/{alertId}/resolve")
    public ResponseEntity<Void> resolveAlert(Authentication auth, @PathVariable Long alertId) {
        dashboardService.resolveAlert(email(auth), alertId);
        return ResponseEntity.noContent().build();
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 8. WATER TANK OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/tanks — all tanks with fill percentage */
    @GetMapping("/tanks")
    public ResponseEntity<List<WaterTankDTO>> getTanks(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAllWaterTanks(email(auth)));
    }

    /** GET /api/dashboard/gardens/{gardenId}/tanks */
    @GetMapping("/gardens/{gardenId}/tanks")
    public ResponseEntity<List<WaterTankDTO>> getTanksByGarden(Authentication auth, @PathVariable Long gardenId) {
        return ResponseEntity.ok(dashboardService.getWaterTanksByGarden(email(auth), gardenId));
    }

    /** GET /api/dashboard/tanks/low — tanks that are LOW or EMPTY */
    @GetMapping("/tanks/low")
    public ResponseEntity<List<WaterTankDTO>> getLowTanks(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getLowWaterTanks(email(auth)));
    }

    // ══════════════════════════════════════════════════════════════════════════
    // 9. VALVE OPERATIONS
    // ══════════════════════════════════════════════════════════════════════════

    /** GET /api/dashboard/valves — all valves with current status */
    @GetMapping("/valves")
    public ResponseEntity<List<ValveDTO>> getValves(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAllValves(email(auth)));
    }

    /** GET /api/dashboard/zones/{zoneId}/valves */
    @GetMapping("/zones/{zoneId}/valves")
    public ResponseEntity<List<ValveDTO>> getValvesByZone(Authentication auth, @PathVariable Long zoneId) {
        return ResponseEntity.ok(dashboardService.getValvesByZone(email(auth), zoneId));
    }

    /** GET /api/dashboard/valves/open — valves currently irrigating */
    @GetMapping("/valves/open")
    public ResponseEntity<List<ValveDTO>> getOpenValves(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getOpenValves(email(auth)));
    }
}
