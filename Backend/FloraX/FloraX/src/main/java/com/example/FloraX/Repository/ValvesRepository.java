package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Valves;
import com.example.FloraX.Enum.ValveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValvesRepository extends JpaRepository<Valves, Long> {

    List<Valves> findByZone_ZoneId(Long zoneId);

    // All valves for a user across all zones
    @Query("SELECT v FROM Valves v WHERE v.zone.garden.user.userId = :userId")
    List<Valves> findAllByUserId(@Param("userId") Long userId);

    // Valves with specific status for a user (OPEN, CLOSED, FAULTY)
    @Query("SELECT v FROM Valves v WHERE v.zone.garden.user.userId = :userId AND v.valveStatus = :status")
    List<Valves> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ValveStatus status);
}