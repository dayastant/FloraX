package com.example.FloraX.Repository;

import com.example.FloraX.Entity.Gardens;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GardensRepository extends JpaRepository<Gardens, Long> {
}
