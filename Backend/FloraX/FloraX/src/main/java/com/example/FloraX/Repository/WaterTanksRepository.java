package com.example.FloraX.Repository;

import com.example.FloraX.Entity.WaterTanks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterTanksRepository extends JpaRepository<WaterTanks, Long> {
}
