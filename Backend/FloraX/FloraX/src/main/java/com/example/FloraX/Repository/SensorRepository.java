package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Sensors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorRepository extends JpaRepository<Sensors, Long> {

    List<Sensors> findByZoneZoneId(Long zoneId);

}
