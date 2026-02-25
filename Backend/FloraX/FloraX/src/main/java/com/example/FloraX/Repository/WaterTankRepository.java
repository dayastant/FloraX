package com.example.FloraX.Repository;

import com.example.FloraX.Entity.WaterTanks;
import com.example.FloraX.Enum.TankStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterTankRepository extends JpaRepository<WaterTanks, Long> {

    List<WaterTanks> findByGardenGardenId(Long gardenId);

    // All tanks for a user across all gardens
    @Query("SELECT t FROM WaterTanks t WHERE t.garden.user.userId = :userId")
    List<WaterTanks> findAllByUserId(@Param("userId") Long userId);

    // Tanks with specific status for a user (LOW, CRITICAL, EMPTY)
    @Query("SELECT t FROM WaterTanks t WHERE t.garden.user.userId = :userId AND t.status = :status")
    List<WaterTanks> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") TankStatus status);
}