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
public class GardenDTO {
    private Long gardenId;
    private String gardenName;
    private String location;
    private Double totalArea;
    private int totalZones;
    private int activeAlerts;
    private List<ZoneDTO> zones;
    private List<IrrigationLogDTO> recentIrrigations;
    private List<AlertDTO> alerts;
}