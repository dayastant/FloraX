package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Zones;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zones, Long> {

    List<Zones> findByGardenGardenId(Long gardenId);

}
