package com.example.FloraX.Repository;

import com.example.FloraX.Entity.IrrigationLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IrrigationLogsRepository extends JpaRepository<IrrigationLogs, Long> {
    Optional<IrrigationLogs> findTopByZone_ZoneIdOrderByStartTimeDesc(Long zoneId);
    List<IrrigationLogs> findByZone_Garden_GardenIdOrderByStartTimeDesc(Long gardenId);
    List<IrrigationLogs> findByZone_Garden_GardenIdAndStartTimeAfter(Long gardenId, LocalDateTime startTime);
}
