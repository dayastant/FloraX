package com.example.FloraX.Service.Impl;

import com.example.FloraX.Dto.*;
import com.example.FloraX.Entity.*;
import com.example.FloraX.Enum.*;
import com.example.FloraX.Mapper.DashboardMapper;
import com.example.FloraX.Repository.*;
import com.example.FloraX.Service.UserDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDashboardServiceImpl implements UserDashboardService {

        private final UserRepository userRepository;
        private final GardenRepository gardenRepository;
        private final ZoneRepository zoneRepository;
        private final SensorRepository sensorRepository;
        private final SensorReadingRepository sensorReadingRepository;
        private final IrrigationLogRepository irrigationLogRepository;
        private final AlertRepository alertRepository;
        private final WaterTankRepository waterTankRepository;
        private final ValvesRepository valvesRepository;
        private final DashboardMapper mapper;

        // ══════════════════════════════════════════════════════════════════════════
        // HELPERS
        // ══════════════════════════════════════════════════════════════════════════

        private Users resolveUser(String email) {
                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        }

        private void verifyGardenOwnership(Long userId, Long gardenId) {
                List<Gardens> gardens = gardenRepository.findByUserUserId(userId);
                boolean owned = gardens.stream().anyMatch(g -> g.getGardenId().equals(gardenId));
                if (!owned)
                        throw new RuntimeException("Garden " + gardenId + " does not belong to user");
        }

        private ZoneDTO buildZoneDTO(Zones zone) {
                Double latestReading = sensorReadingRepository
                                .findTopBySensorZoneZoneIdOrderByRecordedAtDesc(zone.getZoneId())
                                .map(SensorReadings::getValue)
                                .orElse(null);
                Long gardenId = (zone.getGarden() != null) ? zone.getGarden().getGardenId() : null;
                IrrigationLogs lastLog = (gardenId != null)
                                ? irrigationLogRepository
                                                .findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(gardenId)
                                                .stream()
                                                .filter(l -> l.getZone() != null
                                                                && l.getZone().getZoneId().equals(zone.getZoneId()))
                                                .findFirst().orElse(null)
                                : null;
                return mapper.toZoneDTO(zone, latestReading, lastLog);
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 1. FULL DASHBOARD
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public UserDashboardResponse getDashboard(String email) {
                Users user = resolveUser(email);
                Long uid = user.getUserId();
                List<Gardens> gardens = gardenRepository.findByUserUserId(uid);

                int totalZones = 0, totalActiveAlerts = 0, totalIrrigationsToday = 0;
                double totalWaterToday = 0.0, moistureSum = 0.0;
                int moistureCount = 0;

                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                List<GardenDTO> gardenDTOs = new ArrayList<>();

                for (Gardens garden : gardens) {
                        Long gId = garden.getGardenId();

                        List<Zones> zones = zoneRepository.findByGardenGardenId(gId);
                        List<ZoneDTO> zoneDTOs = new ArrayList<>();
                        for (Zones zone : zones) {
                                Double reading = sensorReadingRepository
                                                .findTopBySensorZoneZoneIdOrderByRecordedAtDesc(zone.getZoneId())
                                                .map(SensorReadings::getValue).orElse(null);
                                IrrigationLogs lastLog = irrigationLogRepository
                                                .findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(gId)
                                                .stream()
                                                .filter(l -> l.getZone() != null
                                                                && l.getZone().getZoneId().equals(zone.getZoneId()))
                                                .findFirst().orElse(null);
                                zoneDTOs.add(mapper.toZoneDTO(zone, reading, lastLog));
                                if (reading != null) {
                                        moistureSum += reading;
                                        moistureCount++;
                                }
                        }
                        totalZones += zones.size();

                        List<AlertDTO> alertDTOs = alertRepository
                                        .findTop5ByGardenGardenIdOrderByCreatedAtDesc(gId)
                                        .stream().map(mapper::toAlertDTO).collect(Collectors.toList());

                        totalActiveAlerts += alertDTOs.stream()
                                        .filter(a -> "ACTIVE".equals(a.getStatus())).count();

                        List<IrrigationLogDTO> logDTOs = irrigationLogRepository
                                        .findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(gId)
                                        .stream().map(mapper::toLogDTO).collect(Collectors.toList());

                        List<IrrigationLogs> todayLogs = irrigationLogRepository
                                        .findByZoneGardenGardenIdAndStartTimeAfter(gId, todayStart);
                        totalIrrigationsToday += todayLogs.size();
                        totalWaterToday += todayLogs.stream()
                                        .mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0.0)
                                        .sum();

                        gardenDTOs.add(mapper.toGardenDTO(garden, zoneDTOs, alertDTOs, logDTOs));
                }

                double avgMoisture = moistureCount > 0
                                ? Math.round((moistureSum / moistureCount) * 10.0) / 10.0
                                : 0.0;

                return UserDashboardResponse.builder()
                                .userId(user.getUserId())
                                .userName(user.getName())
                                .email(user.getEmail())
                                .totalGardens(gardens.size())
                                .totalZones(totalZones)
                                .activeAlerts(totalActiveAlerts)
                                .totalIrrigationsToday(totalIrrigationsToday)
                                .avgMoistureLevel(avgMoisture)
                                .totalWaterUsedToday(Math.round(totalWaterToday * 10.0) / 10.0)
                                .gardens(gardenDTOs)
                                .build();
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 2. SUMMARY STATISTICS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public DashboardSummaryDTO getDashboardSummary(String email) {
                Users user = resolveUser(email);
                Long uid = user.getUserId();

                List<Gardens> gardens = gardenRepository.findByUserUserId(uid);
                int totalZones = 0;
                for (Gardens g : gardens)
                        totalZones += zoneRepository.findByGardenGardenId(g.getGardenId()).size();

                List<Sensors> allSensors = sensorRepository.findAllByUserId(uid);
                int activeSensors = (int) allSensors.stream().filter(s -> SensorStatus.ACTIVE == s.getStatus()).count();
                int faultySensors = (int) allSensors.stream().filter(s -> SensorStatus.FAULTY == s.getStatus()).count();

                List<Valves> allValves = valvesRepository.findAllByUserId(uid);
                int openValves = (int) allValves.stream().filter(v -> ValveStatus.OPEN == v.getValveStatus()).count();

                List<WaterTanks> allTanks = waterTankRepository.findAllByUserId(uid);
                List<WaterTankDTO> tankDTOs = allTanks.stream().map(mapper::toWaterTankDTO)
                                .collect(Collectors.toList());

                List<Alerts> activeAlerts = alertRepository.findByUserIdAndStatus(uid, AlertStatus.ACTIVE);

                // Moisture average
                double moistSum = 0;
                int moistCount = 0;
                for (Gardens g : gardens) {
                        for (Zones z : zoneRepository.findByGardenGardenId(g.getGardenId())) {
                                Optional<Double> r = sensorReadingRepository
                                                .findTopBySensorZoneZoneIdOrderByRecordedAtDesc(z.getZoneId())
                                                .map(SensorReadings::getValue);
                                if (r.isPresent()) {
                                        moistSum += r.get();
                                        moistCount++;
                                }
                        }
                }
                double avgMoisture = moistCount > 0 ? Math.round((moistSum / moistCount) * 10.0) / 10.0 : 0.0;

                // Water usage - today / week / month
                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime weekStart = LocalDate.now().minusDays(6).atStartOfDay();
                LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();

                List<IrrigationLogs> todayLogs = irrigationLogRepository.findByUserIdAndStartTimeAfter(uid, todayStart);
                List<IrrigationLogs> weekLogs = irrigationLogRepository.findByUserIdAndStartTimeAfter(uid, weekStart);
                List<IrrigationLogs> monthLogs = irrigationLogRepository.findByUserIdAndStartTimeAfter(uid, monthStart);

                double waterToday = todayLogs.stream()
                                .mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0).sum();
                double waterWeek = weekLogs.stream()
                                .mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0).sum();
                double waterMonth = monthLogs.stream()
                                .mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0).sum();

                // Alert type breakdown — based on actual AlertType enum: LOW_WATER,
                // SENSOR_FAULT, DRY_SOIL
                long lowWaterAlerts = activeAlerts.stream().filter(a -> AlertType.LOW_WATER == a.getAlertType())
                                .count();
                long sensorFaultAlerts = activeAlerts.stream().filter(a -> AlertType.SENSOR_FAULT == a.getAlertType())
                                .count();
                long drySoilAlerts = activeAlerts.stream().filter(a -> AlertType.DRY_SOIL == a.getAlertType()).count();

                // Resolved today
                LocalDateTime todayEnd = todayStart.plusDays(1);
                long resolvedToday = alertRepository.findByUserIdAndStatus(uid, AlertStatus.RESOLVED)
                                .stream().filter(a -> a.getCreatedAt() != null
                                                && !a.getCreatedAt().isBefore(todayStart)
                                                && a.getCreatedAt().isBefore(todayEnd))
                                .count();

                return DashboardSummaryDTO.builder()
                                .totalGardens(gardens.size())
                                .totalZones(totalZones)
                                .totalSensors(allSensors.size())
                                .activeSensors(activeSensors)
                                .faultySensors(faultySensors)
                                .totalValves(allValves.size())
                                .openValves(openValves)
                                .totalWaterTanks(allTanks.size())
                                .avgMoistureLevel(avgMoisture)
                                .totalWaterUsedToday(Math.round(waterToday * 10.0) / 10.0)
                                .totalWaterUsedThisWeek(Math.round(waterWeek * 10.0) / 10.0)
                                .totalWaterUsedThisMonth(Math.round(waterMonth * 10.0) / 10.0)
                                .totalIrrigationsToday(todayLogs.size())
                                .totalIrrigationsThisWeek(weekLogs.size())
                                .activeAlerts(activeAlerts.size())
                                .resolvedAlertsToday((int) resolvedToday)
                                .lowMoistureAlerts((int) lowWaterAlerts)
                                .highTemperatureAlerts((int) sensorFaultAlerts)
                                .systemAlerts((int) drySoilAlerts)
                                .waterTanks(tankDTOs)
                                .build();
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 3. GARDEN OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<GardenDTO> getAllGardens(String email) {
                Users user = resolveUser(email);
                return gardenRepository.findByUserUserId(user.getUserId()).stream()
                                .map(g -> {
                                        List<ZoneDTO> zones = zoneRepository.findByGardenGardenId(g.getGardenId())
                                                        .stream().map(this::buildZoneDTO).collect(Collectors.toList());
                                        List<AlertDTO> alerts = alertRepository
                                                        .findTop5ByGardenGardenIdOrderByCreatedAtDesc(g.getGardenId())
                                                        .stream().map(mapper::toAlertDTO).collect(Collectors.toList());
                                        List<IrrigationLogDTO> logs = irrigationLogRepository
                                                        .findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(
                                                                        g.getGardenId())
                                                        .stream().map(mapper::toLogDTO).collect(Collectors.toList());
                                        return mapper.toGardenDTO(g, zones, alerts, logs);
                                }).collect(Collectors.toList());
        }

        @Override
        public GardenDTO getGardenById(String email, Long gardenId) {
                Users user = resolveUser(email);
                verifyGardenOwnership(user.getUserId(), gardenId);
                Gardens garden = gardenRepository.findById(gardenId)
                                .orElseThrow(() -> new RuntimeException("Garden not found: " + gardenId));
                List<ZoneDTO> zones = zoneRepository.findByGardenGardenId(gardenId)
                                .stream().map(this::buildZoneDTO).collect(Collectors.toList());
                List<AlertDTO> alerts = alertRepository
                                .findTop5ByGardenGardenIdOrderByCreatedAtDesc(gardenId)
                                .stream().map(mapper::toAlertDTO).collect(Collectors.toList());
                List<IrrigationLogDTO> logs = irrigationLogRepository
                                .findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(gardenId)
                                .stream().map(mapper::toLogDTO).collect(Collectors.toList());
                return mapper.toGardenDTO(garden, zones, alerts, logs);
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 4. ZONE OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<ZoneDTO> getAllZones(String email) {
                Users user = resolveUser(email);
                return gardenRepository.findByUserUserId(user.getUserId()).stream()
                                .flatMap(g -> zoneRepository.findByGardenGardenId(g.getGardenId()).stream())
                                .map(this::buildZoneDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<ZoneDTO> getZonesByGarden(String email, Long gardenId) {
                Users user = resolveUser(email);
                verifyGardenOwnership(user.getUserId(), gardenId);
                return zoneRepository.findByGardenGardenId(gardenId).stream()
                                .map(this::buildZoneDTO).collect(Collectors.toList());
        }

        @Override
        public ZoneDTO getZoneById(String email, Long zoneId) {
                resolveUser(email);
                Zones zone = zoneRepository.findById(zoneId)
                                .orElseThrow(() -> new RuntimeException("Zone not found: " + zoneId));
                return buildZoneDTO(zone);
        }

        @Override
        public List<ZoneDTO> getAlertZones(String email) {
                return getAllZones(email).stream()
                                .filter(z -> "ALERT".equals(z.getIrrigationStatus()))
                                .collect(Collectors.toList());
        }

        @Override
        public List<ZoneDTO> getActiveIrrigationZones(String email) {
                return getAllZones(email).stream()
                                .filter(z -> "ACTIVE".equals(z.getIrrigationStatus()))
                                .collect(Collectors.toList());
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 5. SENSOR OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<SensorDTO> getAllSensors(String email) {
                Users user = resolveUser(email);
                return sensorRepository.findAllByUserId(user.getUserId()).stream()
                                .map(s -> {
                                        SensorReadings latest = sensorReadingRepository
                                                        .findTopBySensorZoneZoneIdOrderByRecordedAtDesc(
                                                                        s.getZone().getZoneId())
                                                        .orElse(null);
                                        return mapper.toSensorDTO(s, latest);
                                }).collect(Collectors.toList());
        }

        @Override
        public List<SensorDTO> getSensorsByZone(String email, Long zoneId) {
                resolveUser(email);
                return sensorRepository.findByZoneZoneId(zoneId).stream()
                                .map(s -> {
                                        SensorReadings latest = sensorReadingRepository
                                                        .findTopBySensorZoneZoneIdOrderByRecordedAtDesc(zoneId)
                                                        .orElse(null);
                                        return mapper.toSensorDTO(s, latest);
                                }).collect(Collectors.toList());
        }

        @Override
        public List<SensorDTO> getFaultySensors(String email) {
                Users user = resolveUser(email);
                List<SensorDTO> faulty = sensorRepository.findByUserIdAndStatus(user.getUserId(), SensorStatus.FAULTY)
                                .stream().map(s -> mapper.toSensorDTO(s, null)).collect(Collectors.toList());
                List<SensorDTO> inactive = sensorRepository
                                .findByUserIdAndStatus(user.getUserId(), SensorStatus.INACTIVE)
                                .stream().map(s -> mapper.toSensorDTO(s, null)).collect(Collectors.toList());
                faulty.addAll(inactive);
                return faulty;
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 6. IRRIGATION LOG OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<IrrigationLogDTO> getTodayIrrigationLogs(String email) {
                Users user = resolveUser(email);
                return irrigationLogRepository
                                .findByUserIdAndStartTimeAfter(user.getUserId(), LocalDate.now().atStartOfDay())
                                .stream().map(mapper::toLogDTO).collect(Collectors.toList());
        }

        @Override
        public List<IrrigationLogDTO> getWeeklyIrrigationLogs(String email) {
                Users user = resolveUser(email);
                return irrigationLogRepository
                                .findByUserIdAndStartTimeAfter(user.getUserId(),
                                                LocalDate.now().minusDays(6).atStartOfDay())
                                .stream().map(mapper::toLogDTO).collect(Collectors.toList());
        }

        @Override
        public List<IrrigationLogDTO> getMonthlyIrrigationLogs(String email) {
                Users user = resolveUser(email);
                return irrigationLogRepository
                                .findByUserIdAndStartTimeAfter(user.getUserId(),
                                                LocalDate.now().withDayOfMonth(1).atStartOfDay())
                                .stream().map(mapper::toLogDTO).collect(Collectors.toList());
        }

        @Override
        public List<IrrigationLogDTO> getRecentIrrigationLogs(String email, int limit) {
                Users user = resolveUser(email);
                List<Gardens> gardens = gardenRepository.findByUserUserId(user.getUserId());
                return gardens.stream()
                                .flatMap(g -> irrigationLogRepository
                                                .findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(g.getGardenId())
                                                .stream())
                                .sorted(Comparator.comparing(IrrigationLogs::getStartTime,
                                                Comparator.nullsLast(Comparator.reverseOrder())))
                                .limit(limit)
                                .map(mapper::toLogDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<IrrigationLogDTO> getIrrigationLogsByZone(String email, Long zoneId, int limit) {
                resolveUser(email);
                return irrigationLogRepository.findAll().stream()
                                .filter(l -> l.getZone() != null && l.getZone().getZoneId().equals(zoneId))
                                .sorted(Comparator.comparing(IrrigationLogs::getStartTime,
                                                Comparator.nullsLast(Comparator.reverseOrder())))
                                .limit(limit)
                                .map(mapper::toLogDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public Double getTotalWaterUsedToday(String email) {
                Users user = resolveUser(email);
                return irrigationLogRepository
                                .findByUserIdAndStartTimeAfter(user.getUserId(), LocalDate.now().atStartOfDay())
                                .stream().mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0)
                                .sum();
        }

        @Override
        public Double getTotalWaterUsedThisWeek(String email) {
                Users user = resolveUser(email);
                return irrigationLogRepository
                                .findByUserIdAndStartTimeAfter(user.getUserId(),
                                                LocalDate.now().minusDays(6).atStartOfDay())
                                .stream().mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0)
                                .sum();
        }

        @Override
        public Double getTotalWaterUsedThisMonth(String email) {
                Users user = resolveUser(email);
                return irrigationLogRepository
                                .findByUserIdAndStartTimeAfter(user.getUserId(),
                                                LocalDate.now().withDayOfMonth(1).atStartOfDay())
                                .stream().mapToDouble(l -> l.getWaterVolumeUsed() != null ? l.getWaterVolumeUsed() : 0)
                                .sum();
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 7. ALERT OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<AlertDTO> getActiveAlerts(String email) {
                Users user = resolveUser(email);
                return alertRepository.findByUserIdAndStatus(user.getUserId(), AlertStatus.ACTIVE)
                                .stream().map(mapper::toAlertDTO).collect(Collectors.toList());
        }

        @Override
        public List<AlertDTO> getResolvedAlertsToday(String email) {
                Users user = resolveUser(email);
                LocalDateTime todayStart = LocalDate.now().atStartOfDay();
                LocalDateTime todayEnd = todayStart.plusDays(1);
                return alertRepository.findByUserIdAndStatus(user.getUserId(), AlertStatus.RESOLVED)
                                .stream()
                                .filter(a -> a.getCreatedAt() != null
                                                && !a.getCreatedAt().isBefore(todayStart)
                                                && a.getCreatedAt().isBefore(todayEnd))
                                .map(mapper::toAlertDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<AlertDTO> getRecentAlerts(String email, int limit) {
                Users user = resolveUser(email);
                List<Gardens> gardens = gardenRepository.findByUserUserId(user.getUserId());
                return gardens.stream()
                                .flatMap(g -> alertRepository
                                                .findTop5ByGardenGardenIdOrderByCreatedAtDesc(g.getGardenId()).stream())
                                .sorted(Comparator.comparing(Alerts::getCreatedAt,
                                                Comparator.nullsLast(Comparator.reverseOrder())))
                                .limit(limit)
                                .map(mapper::toAlertDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<AlertDTO> getAlertsByGarden(String email, Long gardenId) {
                Users user = resolveUser(email);
                verifyGardenOwnership(user.getUserId(), gardenId);
                return alertRepository.findTop5ByGardenGardenIdOrderByCreatedAtDesc(gardenId)
                                .stream().map(mapper::toAlertDTO).collect(Collectors.toList());
        }

        @Override
        public Map<String, Long> getAlertCountByType(String email) {
                Users user = resolveUser(email);
                return alertRepository.findByUserIdAndStatus(user.getUserId(), AlertStatus.ACTIVE)
                                .stream()
                                .filter(a -> a.getAlertType() != null)
                                .collect(Collectors.groupingBy(
                                                a -> a.getAlertType().name(),
                                                Collectors.counting()));
        }

        @Override
        public void resolveAlert(String email, Long alertId) {
                Users user = resolveUser(email);
                Alerts alert = alertRepository.findById(alertId)
                                .orElseThrow(() -> new RuntimeException("Alert not found: " + alertId));
                // Ownership check via garden
                if (alert.getGarden() == null ||
                                !alert.getGarden().getUser().getUserId().equals(user.getUserId())) {
                        throw new RuntimeException("Alert does not belong to this user");
                }
                alert.setStatus(AlertStatus.RESOLVED);
                alertRepository.save(alert);
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 8. WATER TANK OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<WaterTankDTO> getAllWaterTanks(String email) {
                Users user = resolveUser(email);
                return waterTankRepository.findAllByUserId(user.getUserId())
                                .stream().map(mapper::toWaterTankDTO).collect(Collectors.toList());
        }

        @Override
        public List<WaterTankDTO> getWaterTanksByGarden(String email, Long gardenId) {
                Users user = resolveUser(email);
                verifyGardenOwnership(user.getUserId(), gardenId);
                return waterTankRepository.findByGardenGardenId(gardenId)
                                .stream().map(mapper::toWaterTankDTO).collect(Collectors.toList());
        }

        @Override
        public List<WaterTankDTO> getLowWaterTanks(String email) {
                Users user = resolveUser(email);
                Long uid = user.getUserId();
                // TankStatus has: NORMAL, LOW, EMPTY (no CRITICAL)
                List<WaterTankDTO> low = waterTankRepository.findByUserIdAndStatus(uid, TankStatus.LOW)
                                .stream().map(mapper::toWaterTankDTO).collect(Collectors.toList());
                waterTankRepository.findByUserIdAndStatus(uid, TankStatus.EMPTY)
                                .stream().map(mapper::toWaterTankDTO).forEach(low::add);
                return low;
        }

        // ══════════════════════════════════════════════════════════════════════════
        // 9. VALVE OPERATIONS
        // ══════════════════════════════════════════════════════════════════════════

        @Override
        public List<ValveDTO> getAllValves(String email) {
                Users user = resolveUser(email);
                return valvesRepository.findAllByUserId(user.getUserId())
                                .stream().map(mapper::toValveDTO).collect(Collectors.toList());
        }

        @Override
        public List<ValveDTO> getValvesByZone(String email, Long zoneId) {
                resolveUser(email);
                return valvesRepository.findByZone_ZoneId(zoneId)
                                .stream().map(mapper::toValveDTO).collect(Collectors.toList());
        }

        @Override
        public List<ValveDTO> getOpenValves(String email) {
                Users user = resolveUser(email);
                return valvesRepository.findByUserIdAndStatus(user.getUserId(), ValveStatus.OPEN)
                                .stream().map(mapper::toValveDTO).collect(Collectors.toList());
        }
}
