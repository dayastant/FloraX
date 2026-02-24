package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Valves;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValvesRepository extends JpaRepository<Valves, Long> {

    // Find all valves by zone ID
    List<Valves> findByZone_ZoneId(Long zoneId);

}