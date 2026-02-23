package com.example.FloraX.Repository;

import com.example.FloraX.Entity.IrrigationLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IrrigationLogRepository
        extends JpaRepository<IrrigationLogs, Long> {

    List<IrrigationLogs>
    findTop5ByZoneGardenGardenIdOrderByStartTimeDesc(Long gardenId);

}
