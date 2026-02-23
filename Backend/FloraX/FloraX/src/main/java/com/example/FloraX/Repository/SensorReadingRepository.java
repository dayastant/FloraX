package com.example.FloraX.Repository;

import com.example.FloraX.Entity.SensorReadings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReadings, Long> {

    Optional<SensorReadings>
    findTopBySensorZoneZoneIdOrderByRecordedAtDesc(Long zoneId);

}