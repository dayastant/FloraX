package com.example.FloraX.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SensorDTO {
    private Long sensorId;
    private String sensorType; // MOISTURE, TEMPERATURE, etc.
    private String serialNumber;
    private String status; // ACTIVE, INACTIVE, FAULTY
    private LocalDate installationDate;
    private Double latestReading; // most recent sensor value
    private String recordedAt; // when the reading was taken
}
