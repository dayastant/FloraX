package com.example.FloraX.Mapper;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DashboardMapper {

    public GardenDTO toGardenDTO(Gardens garden,
                                 List<ZoneDTO> zones,
                                 List<WaterTankDTO> tanks,
                                 List<AlertDTO> alerts,
                                 List<IrrigationLogDTO> logs) {

        return GardenDTO.builder()
                .gardenId(garden.getGardenId())
                .gardenName(garden.getGardenName())
                .location(garden.getLocation())
                .totalArea(garden.getTotalArea())
                .zones(zones)
                .tanks(tanks)
                .activeAlerts(alerts)
                .recentIrrigations(logs)
                .build();
    }

    public ZoneDTO toZoneDTO(Zones zone, Double latestReading) {

        return ZoneDTO.builder()
                .zoneId(zone.getZoneId())
                .zoneName(zone.getZoneName())
                .plantType(zone.getPlantType())
                .soilType(zone.getSoilType())
                .moistureMin(zone.getMoistureThresholdMin())
                .moistureMax(zone.getMoistureThresholdMax())
                .latestMoistureReading(latestReading)
                .build();
    }

    public WaterTankDTO toTankDTO(WaterTanks tank) {

        return WaterTankDTO.builder()
                .tankId(tank.getTankId())
                .capacity(tank.getCapacityLiters())
                .currentLevel(tank.getCurrentLevelLiters())
                .status(tank.getStatus().name())
                .build();
    }

    public AlertDTO toAlertDTO(Alerts alert) {

        return AlertDTO.builder()
                .alertId(alert.getAlertId())
                .type(alert.getAlertType().name())
                .message(alert.getMessage())
                .status(alert.getStatus().name())
                .createdAt(alert.getCreatedAt())
                .build();
    }

    public IrrigationLogDTO toLogDTO(IrrigationLogs log) {

        return IrrigationLogDTO.builder()
                .logId(log.getLogId())
                .startTime(log.getStartTime())
                .endTime(log.getEndTime())
                .waterVolumeUsed(log.getWaterVolumeUsed())
                .triggerType(log.getTriggerType().name())
                .build();
    }

    // ✅ NEW — Valve Mapping
    public ValveDTO toValveDTO(Valves valve) {

        return ValveDTO.builder()
                .valveId(valve.getValveId())
                .zoneId(valve.getZone() != null ? valve.getZone().getZoneId() : null)
                .valveStatus(valve.getValveStatus() != null ? valve.getValveStatus().name() : null)
                .powerSource(valve.getPowerSource() != null ? valve.getPowerSource().name() : null)
                .lastActivatedAt(valve.getLastActivatedAt())
                .build();
    }
}