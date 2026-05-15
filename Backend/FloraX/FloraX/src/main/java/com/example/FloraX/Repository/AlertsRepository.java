package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Alerts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertsRepository extends JpaRepository<Alerts, Long> {
    List<Alerts> findByZone_Garden_GardenIdOrderByCreatedAtDesc(Long gardenId);
}
