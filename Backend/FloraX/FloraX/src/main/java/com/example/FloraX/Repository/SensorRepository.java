package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Sensors;
import com.example.FloraX.Enum.SensorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorRepository extends JpaRepository<Sensors, Long> {

    List<Sensors> findByZoneZoneId(Long zoneId);

    // All sensors by status for a user
    @Query("SELECT s FROM Sensors s WHERE s.zone.garden.user.userId = :userId AND s.status = :status")
    List<Sensors> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") SensorStatus status);

    // All sensors across all zones of a user
    @Query("SELECT s FROM Sensors s WHERE s.zone.garden.user.userId = :userId")
    List<Sensors> findAllByUserId(@Param("userId") Long userId);
}
