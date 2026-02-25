package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Alerts;
import com.example.FloraX.Enum.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alerts, Long> {

    // Active alerts for a specific garden
    List<Alerts> findByGardenGardenIdAndStatus(Long gardenId, AlertStatus status);

    // All active alerts for a user across all gardens
    @Query("SELECT a FROM Alerts a WHERE a.garden.user.userId = :userId AND a.status = :status ORDER BY a.createdAt DESC")
    List<Alerts> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") AlertStatus status);

    // Recent alerts for a garden (last 5)
    List<Alerts> findTop5ByGardenGardenIdOrderByCreatedAtDesc(Long gardenId);
}