package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Alerts;
import com.example.FloraX.Enum.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alerts, Long> {

    List<Alerts> findByGardenGardenIdAndStatus(
            Long gardenId,
            AlertStatus status
    );

}