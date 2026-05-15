package com.example.FloraX.Service.Impl;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Entity.*;
import com.example.FloraX.Mapper.DashboardMapper;
import com.example.FloraX.Repository.*;
import com.example.FloraX.Service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of DashboardService.
 * Aggregates data from multiple repositories and uses DashboardMapper to convert to DTOs.
 */
@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final DashboardMapper dashboardMapper;
    private final ZonesRepository zonesRepository;
    private final SensorReadingsRepository sensorReadingsRepository;
    private final IrrigationLogsRepository irrigationLogsRepository;
    private final AlertsRepository alertsRepository;
    private final SensorsRepository sensorsRepository;
    private final WaterTanksRepository waterTanksRepository;
    private final ValvesRepository valvesRepository;
    private final GardensRepository gardensRepository;

    @Override
    public GardenDTO getGardenDashboard(Long gardenId) {
        log.debug("Fetching dashboard for garden: {}", gardenId);
        
        Gardens garden = gardensRepository.findById(gardenId)
                .orElseThrow(() -> new RuntimeException("Garden not found: " + gardenId));
        
        List<ZoneDTO> zones = getAllZonesWithReadings(gardenId);
        List<AlertDTO> alerts = getGardenAlerts(gardenId);
        List<IrrigationLogDTO> recentLogs = getRecentIrrigationLogs(gardenId, 10);
        
        return dashboardMapper.toGardenDTO(garden, zones, alerts, recentLogs);
    }

    @Override
    public List<ZoneDTO> getAllZonesWithReadings(Long gardenId) {
        log.debug("Fetching all zones with readings for garden: {}", gardenId);
        
        List<Zones> zones = zonesRepository.findByGarden_GardenId(gardenId);
        
        return zones.stream()
                .map(zone -> {
                    Double latestReading = getLatestZoneReading(zone.getZoneId());
                    IrrigationLogs lastLog = irrigationLogsRepository
                            .findTopByZone_ZoneIdOrderByStartTimeDesc(zone.getZoneId())
                            .orElse(null);
                    return dashboardMapper.toZoneDTO(zone, latestReading, lastLog);
                })
                .collect(Collectors.toList());
    }

    @Override
    public ZoneDTO getZoneWithLatestReading(Long zoneId) {
        log.debug("Fetching zone with latest reading: {}", zoneId);
        
        Zones zone = zonesRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found: " + zoneId));
        
        Double latestReading = getLatestZoneReading(zoneId);
        IrrigationLogs lastLog = irrigationLogsRepository
                .findTopByZone_ZoneIdOrderByStartTimeDesc(zoneId)
                .orElse(null);
        
        return dashboardMapper.toZoneDTO(zone, latestReading, lastLog);
    }

    @Override
    public List<AlertDTO> getGardenAlerts(Long gardenId) {
        log.debug("Fetching alerts for garden: {}", gardenId);
        
        List<Alerts> alerts = alertsRepository.findByZone_Garden_GardenIdOrderByCreatedAtDesc(gardenId);
        
        return alerts.stream()
                .map(dashboardMapper::toAlertDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<IrrigationLogDTO> getRecentIrrigationLogs(Long gardenId, int limit) {
        log.debug("Fetching {} recent irrigation logs for garden: {}", limit, gardenId);
        
        List<IrrigationLogs> logs = irrigationLogsRepository
                .findByZone_Garden_GardenIdOrderByStartTimeDesc(gardenId)
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
        
        return logs.stream()
                .map(dashboardMapper::toLogDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SensorDTO> getGardenSensors(Long gardenId) {
        log.debug("Fetching all sensors for garden: {}", gardenId);
        
        List<Sensors> sensors = sensorsRepository.findByZone_Garden_GardenId(gardenId);
        
        return sensors.stream()
                .map(sensor -> {
                    SensorReadings latestReading = sensorReadingsRepository
                            .findTopBySensor_SensorIdOrderByRecordedAtDesc(sensor.getSensorId())
                            .orElse(null);
                    return dashboardMapper.toSensorDTO(sensor, latestReading);
                })
                .collect(Collectors.toList());
    }

    @Override
    public WaterTankDTO getWaterTankStatus(Long tankId) {
        log.debug("Fetching water tank status: {}", tankId);
        
        WaterTanks tank = waterTanksRepository.findById(tankId)
                .orElseThrow(() -> new RuntimeException("Water tank not found: " + tankId));
        
        return dashboardMapper.toWaterTankDTO(tank);
    }

    @Override
    public List<ValveDTO> getGardenValves(Long gardenId) {
        log.debug("Fetching all valves for garden: {}", gardenId);
        
        List<Valves> valves = valvesRepository.findByZone_Garden_GardenId(gardenId);
        
        return valves.stream()
                .map(dashboardMapper::toValveDTO)
                .collect(Collectors.toList());
    }

    @Override
    public IrrigationSummaryDTO getIrrigationSummary(Long gardenId) {
        log.debug("Fetching irrigation summary for garden: {}", gardenId);
        
        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
        
        List<IrrigationLogs> logs = irrigationLogsRepository
                .findByZone_Garden_GardenIdAndStartTimeAfter(gardenId, last24Hours);
        
        long totalDuration = logs.stream()
                .filter(log -> log.getStartTime() != null && log.getEndTime() != null)
                .mapToLong(log -> Duration.between(log.getStartTime(), log.getEndTime()).toMinutes())
                .sum();
        
        Double totalWaterUsed = logs.stream()
                .mapToDouble(log -> log.getWaterVolumeUsed() != null ? log.getWaterVolumeUsed() : 0)
                .sum();
        
        return IrrigationSummaryDTO.builder()
                .gardenId(gardenId)
                .totalEventsLast24h(logs.size())
                .totalDurationMinutes(totalDuration)
                .totalWaterUsedLiters(totalWaterUsed)
                .lastIrrigationTime(logs.isEmpty() ? null : logs.get(0).getStartTime())
                .build();
    }

    /**
     * Helper method to get the latest moisture reading for a zone.
     */
    private Double getLatestZoneReading(Long zoneId) {
        return sensorsRepository.findByZone_ZoneIdAndSensorType(zoneId, "MOISTURE")
                .stream()
                .findFirst()
                .flatMap(sensor -> sensorReadingsRepository
                        .findTopBySensor_SensorIdOrderByRecordedAtDesc(sensor.getSensorId())
                        .map(SensorReadings::getValue))
                .orElse(null);
    }
}
