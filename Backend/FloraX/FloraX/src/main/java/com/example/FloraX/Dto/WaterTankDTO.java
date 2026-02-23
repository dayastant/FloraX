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
    private Double capacity;
    private Double currentLevel;
    private String status;

}