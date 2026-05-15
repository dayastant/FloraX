package com.example.FloraX.Controller;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Dashboard operations.
 * Provides endpoints to retrieve dashboard data for mobile and web frontends.
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard/{gardenId}
     * Get complete garden dashboard data.
     */
    @GetMapping("/{gardenId}")
    public ResponseEntity<GardenDTO> getGardenDashboard(@PathVariable Long gardenId) {
        log.info("Fetching dashboard for garden: {}", gardenId);
        try {
            GardenDTO gardenDTO = dashboardService.getGardenDashboard(gardenId);
            return ResponseEntity.ok(gardenDTO);
        } catch (Exception e) {
            log.error("Error fetching dashboard for garden: {}", gardenId, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/dashboard/{gardenId}/zones
     * Get all zones with their latest sensor readings.
     */
    @GetMapping("/{gardenId}/zones")
    public ResponseEntity<List<ZoneDTO>> getZones(@PathVariable Long gardenId) {
        log.info("Fetching zones for garden: {}", gardenId);
        try {
            List<ZoneDTO> zones = dashboardService.getAllZonesWithReadings(gardenId);
            return ResponseEntity.ok(zones);
        } catch (Exception e) {
            log.error("Error fetching zones for garden: {}", gardenId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/dashboard/zone/{zoneId}
     * Get a specific zone with its latest sensor reading.
     */
    @GetMapping("/zone/{zoneId}")
    public ResponseEntity<ZoneDTO> getZoneDetail(@PathVariable Long zoneId) {
        log.info("Fetching zone details: {}", zoneId);
        try {
            ZoneDTO zone = dashboardService.getZoneWithLatestReading(zoneId);
            return ResponseEntity.ok(zone);
        } catch (Exception e) {
            log.error("Error fetching zone: {}", zoneId, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/dashboard/{gardenId}/alerts
     * Get active and recent alerts for a garden.
     */
    @GetMapping("/{gardenId}/alerts")
    public ResponseEntity<List<AlertDTO>> getAlerts(@PathVariable Long gardenId) {
        log.info("Fetching alerts for garden: {}", gardenId);
        try {
            List<AlertDTO> alerts = dashboardService.getGardenAlerts(gardenId);
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            log.error("Error fetching alerts for garden: {}", gardenId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/dashboard/{gardenId}/irrigation-logs
     * Get recent irrigation logs for a garden.
     * Query Parameter: limit (default 10)
     */
    @GetMapping("/{gardenId}/irrigation-logs")
    public ResponseEntity<List<IrrigationLogDTO>> getIrrigationLogs(
            @PathVariable Long gardenId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching irrigation logs for garden: {}, limit: {}", gardenId, limit);
        try {
            List<IrrigationLogDTO> logs = dashboardService.getRecentIrrigationLogs(gardenId, limit);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            log.error("Error fetching irrigation logs for garden: {}", gardenId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/dashboard/{gardenId}/sensors
     * Get all sensors for a garden with their latest readings.
     */
    @GetMapping("/{gardenId}/sensors")
    public ResponseEntity<List<SensorDTO>> getSensors(@PathVariable Long gardenId) {
        log.info("Fetching sensors for garden: {}", gardenId);
        try {
            List<SensorDTO> sensors = dashboardService.getGardenSensors(gardenId);
            return ResponseEntity.ok(sensors);
        } catch (Exception e) {
            log.error("Error fetching sensors for garden: {}", gardenId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/dashboard/tank/{tankId}
     * Get water tank status.
     */
    @GetMapping("/tank/{tankId}")
    public ResponseEntity<WaterTankDTO> getWaterTankStatus(@PathVariable Long tankId) {
        log.info("Fetching water tank status: {}", tankId);
        try {
            WaterTankDTO tank = dashboardService.getWaterTankStatus(tankId);
            return ResponseEntity.ok(tank);
        } catch (Exception e) {
            log.error("Error fetching water tank: {}", tankId, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/dashboard/{gardenId}/valves
     * Get all valves for a garden.
     */
    @GetMapping("/{gardenId}/valves")
    public ResponseEntity<List<ValveDTO>> getValves(@PathVariable Long gardenId) {
        log.info("Fetching valves for garden: {}", gardenId);
        try {
            List<ValveDTO> valves = dashboardService.getGardenValves(gardenId);
            return ResponseEntity.ok(valves);
        } catch (Exception e) {
            log.error("Error fetching valves for garden: {}", gardenId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/dashboard/{gardenId}/irrigation-summary
     * Get irrigation summary statistics.
     */
    @GetMapping("/{gardenId}/irrigation-summary")
    public ResponseEntity<IrrigationSummaryDTO> getIrrigationSummary(@PathVariable Long gardenId) {
        log.info("Fetching irrigation summary for garden: {}", gardenId);
        try {
            IrrigationSummaryDTO summary = dashboardService.getIrrigationSummary(gardenId);
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error fetching irrigation summary for garden: {}", gardenId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Health check endpoint for dashboard service.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info("Dashboard service health check");
        return ResponseEntity.ok("Dashboard service is healthy");
    }
}
