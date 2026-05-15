package com.example.FloraX.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SensorDTO {
    private Long sensorId;
    private String sensorType; // MOISTURE, TEMPERATURE, HUMIDITY, etc.
    private String serialNumber;
    private String status; // ACTIVE, INACTIVE, FAULTY
    private LocalDate installationDate;
    private Double latestReading; // converted percentage value (0-100 for moisture)
    private Double latestReadingRaw; // raw ADC value
    private LocalDateTime recordedAt; // when the reading was taken
    private String recordedAtFormatted; // human-readable format
}
