package com.example.FloraX.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ZoneDTO {
    private Long zoneId;
    private String zoneName;
    private String plantType;
    private String soilType;
    private Double moistureMin;
    private Double moistureMax;
    private Double latestMoistureReading; // latest sensor value
    private String irrigationStatus; // ACTIVE / IDLE / SCHEDULED / ALERT
    private String lastIrrigated; // human-readable time
}
