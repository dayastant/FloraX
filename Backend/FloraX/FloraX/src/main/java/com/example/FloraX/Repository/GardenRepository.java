package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Gardens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GardenRepository extends JpaRepository<Gardens, Long> {

    List<Gardens> findByUserUserId(Long userId);

}