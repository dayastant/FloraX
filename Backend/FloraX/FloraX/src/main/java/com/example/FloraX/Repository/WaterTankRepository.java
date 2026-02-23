package com.example.FloraX.Repository;

import com.example.FloraX.Entity.WaterTanks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterTankRepository extends JpaRepository<WaterTanks, Long> {

    List<WaterTanks> findByGardenGardenId(Long gardenId);

}