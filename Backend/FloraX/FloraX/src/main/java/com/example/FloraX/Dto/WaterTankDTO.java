package com.example.FloraX.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WaterTankDTO {
    private Long tankId;
    private Double capacityLiters;
    private Double currentLevelLiters;
    private Double fillPercentage; // (currentLevel / capacity) * 100
    private String status; // FULL, NORMAL, LOW, CRITICAL, EMPTY
}