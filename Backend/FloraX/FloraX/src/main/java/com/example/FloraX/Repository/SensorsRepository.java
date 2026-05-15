package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Sensors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorsRepository extends JpaRepository<Sensors, Long> {
    List<Sensors> findByZone_Garden_GardenId(Long gardenId);
    Optional<Sensors> findByZone_ZoneIdAndSensorType(Long zoneId, String sensorType);
}
