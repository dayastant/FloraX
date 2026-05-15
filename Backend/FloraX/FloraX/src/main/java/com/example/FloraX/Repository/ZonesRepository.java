package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Zones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZonesRepository extends JpaRepository<Zones, Long> {
    List<Zones> findByGarden_GardenId(Long gardenId);
}
