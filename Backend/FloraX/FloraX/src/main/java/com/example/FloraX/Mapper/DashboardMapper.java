package com.example.FloraX.Mapper;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Entity.*;
import com.example.FloraX.Enum.AlertStatus;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class DashboardMapper {

    private static final DateTimeFormatter DISPLAY_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    // ── Zone ──────────────────────────────────────────────────────────────────

    public ZoneDTO toZoneDTO(Zones zone, Double latestReading, IrrigationLogs lastLog) {
        String status = resolveZoneStatus(zone, latestReading);
        String lastIrrigated = lastLog != null
                ? formatRelative(lastLog.getStartTime())
                : "Never";

        return ZoneDTO.builder()
                .zoneId(zone.getZoneId())
                .zoneName(zone.getZoneName())
                .plantType(zone.getPlantType())
                .soilType(zone.getSoilType())
                .moistureMin(zone.getMoistureThresholdMin())
                .moistureMax(zone.getMoistureThresholdMax())
                .latestMoistureReading(latestReading)
                .irrigationStatus(status)
                .lastIrrigated(lastIrrigated)
                .build();
    }

    private String resolveZoneStatus(Zones zone, Double moisture) {
        if (moisture == null)
            return "UNKNOWN";
        Double min = zone.getMoistureThresholdMin();
        if (min != null && moisture < min)
            return "ALERT";
        Double max = zone.getMoistureThresholdMax();
        if (max != null && moisture >= max)
            return "IDLE";
        return "ACTIVE";
    }

    // ── Alert ─────────────────────────────────────────────────────────────────

    public AlertDTO toAlertDTO(Alerts alert) {
        return AlertDTO.builder()
                .alertId(alert.getAlertId())
                .type(alert.getAlertType() != null ? alert.getAlertType().name() : null)
                .message(alert.getMessage())
                .status(alert.getStatus() != null ? alert.getStatus().name() : null)
                .createdAt(alert.getCreatedAt())
                .zoneName(alert.getZone() != null ? alert.getZone().getZoneName() : "N/A")
                .build();
    }

    // ── Irrigation Log ────────────────────────────────────────────────────────

    public IrrigationLogDTO toLogDTO(IrrigationLogs log) {
        Long duration = null;
        if (log.getStartTime() != null && log.getEndTime() != null) {
            duration = Duration.between(log.getStartTime(), log.getEndTime()).toMinutes();
        }
        return IrrigationLogDTO.builder()
                .logId(log.getLogId())
                .zoneName(log.getZone() != null ? log.getZone().getZoneName() : "N/A")
                .startTime(log.getStartTime())
                .endTime(log.getEndTime())
                .waterVolumeUsed(log.getWaterVolumeUsed())
                .triggerType(log.getTriggerType() != null ? log.getTriggerType().name() : null)
                .durationMinutes(duration)
                .build();
    }

    // ── Sensor ────────────────────────────────────────────────────────────────

    public SensorDTO toSensorDTO(Sensors sensor, SensorReadings latestReading) {
        return SensorDTO.builder()
                .sensorId(sensor.getSensorId())
                .sensorType(sensor.getSensorType() != null ? sensor.getSensorType().name() : null)
                .serialNumber(sensor.getSerialNumber())
                .status(sensor.getStatus() != null ? sensor.getStatus().name() : null)
                .installationDate(sensor.getInstallationDate())
                .latestReading(latestReading != null ? latestReading.getValue() : null)
                .recordedAt(latestReading != null && latestReading.getRecordedAt() != null
                        ? latestReading.getRecordedAt().format(DISPLAY_FMT)
                        : null)
                .build();
    }

    // ── Water Tank ────────────────────────────────────────────────────────────

    public WaterTankDTO toWaterTankDTO(WaterTanks tank) {
        Double fillPct = null;
        if (tank.getCapacityLiters() != null && tank.getCurrentLevelLiters() != null
                && tank.getCapacityLiters() > 0) {
            fillPct = Math.round(
                    (tank.getCurrentLevelLiters() / tank.getCapacityLiters()) * 1000.0) / 10.0;
        }
        return WaterTankDTO.builder()
                .tankId(tank.getTankId())
                .capacityLiters(tank.getCapacityLiters())
                .currentLevelLiters(tank.getCurrentLevelLiters())
                .fillPercentage(fillPct)
                .status(tank.getStatus() != null ? tank.getStatus().name() : null)
                .build();
    }

    // ── Valve ─────────────────────────────────────────────────────────────────

    public ValveDTO toValveDTO(Valves valve) {
        return ValveDTO.builder()
                .valveId(valve.getValveId())
                .zoneName(valve.getZone() != null ? valve.getZone().getZoneName() : "N/A")
                .valveStatus(valve.getValveStatus() != null ? valve.getValveStatus().name() : null)
                .powerSource(valve.getPowerSource() != null ? valve.getPowerSource().name() : null)
                .lastActivatedAt(valve.getLastActivatedAt())
                .build();
    }

    // ── Garden ────────────────────────────────────────────────────────────────

    public GardenDTO toGardenDTO(Gardens garden,
            List<ZoneDTO> zones,
            List<AlertDTO> alerts,
            List<IrrigationLogDTO> recentLogs) {
        long activeAlertCount = alerts.stream()
                .filter(a -> "ACTIVE".equals(a.getStatus()))
                .count();

        return GardenDTO.builder()
                .gardenId(garden.getGardenId())
                .gardenName(garden.getGardenName())
                .location(garden.getLocation())
                .totalArea(garden.getTotalArea())
                .totalZones(zones.size())
                .activeAlerts((int) activeAlertCount)
                .zones(zones)
                .alerts(alerts)
                .recentIrrigations(recentLogs)
                .build();
    }

    // ── Utility ───────────────────────────────────────────────────────────────

    public String formatRelative(LocalDateTime dt) {
        if (dt == null)
            return "N/A";
        long minutes = Duration.between(dt, LocalDateTime.now()).toMinutes();
        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + " min ago";
        long hours = minutes / 60;
        if (hours < 24)
            return hours + " hr" + (hours > 1 ? "s" : "") + " ago";
        long days = hours / 24;
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    }
}