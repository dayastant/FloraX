package com.example.FloraX.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ZoneDTO {
    private Long zoneId;
    private String zoneName;
    private String plantType;
    private String soilType;
    private String sunlightExposure;
    private Double moistureThresholdMin;
    private Double moistureThresholdMax;
    private Double currentMoisture; // latest sensor value (percentage 0-100)
    private Double moistureRaw; // raw ADC value from sensor
    private String irrigationStatus; // ACTIVE / IDLE / SCHEDULED / ALERT
    private String lastIrrigatedAt; // ISO timestamp
    private List<SensorDTO> sensors; // all sensors in this zone
    private List<ValveDTO> valves; // all valves in this zone
}
