package com.example.FloraX.Repository;

import com.example.FloraX.Entity.IrrigationLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IrrigationLogRepository extends JpaRepository<IrrigationLogs, Long> {

    // Last 5 logs for a garden
    List<IrrigationLogs> findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(Long gardenId);

    // All logs for a garden since a given time (for today's stats)
    List<IrrigationLogs> findByZoneGardenGardenIdAndStartTimeAfter(Long gardenId, LocalDateTime since);

    // All logs across all gardens belonging to a user since a given time
    @Query("SELECT il FROM IrrigationLogs il WHERE il.zone.garden.user.userId = :userId AND il.startTime >= :since")
    List<IrrigationLogs> findByUserIdAndStartTimeAfter(@Param("userId") Long userId,
            @Param("since") LocalDateTime since);
}
