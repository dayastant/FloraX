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
public class DashboardSummaryDTO {
    // Counts
    private int totalGardens;
    private int totalZones;
    private int totalSensors;
    private int activeSensors;
    private int faultySensors;
    private int totalValves;
    private int openValves;
    private int totalWaterTanks;

    // Real-time metrics (averaged across all user zones)
    private Double avgMoistureLevel;
    private Double avgTemperature;

    // Water usage
    private Double totalWaterUsedToday;
    private Double totalWaterUsedThisWeek;
    private Double totalWaterUsedThisMonth;
    private int totalIrrigationsToday;
    private int totalIrrigationsThisWeek;

    // Alert summary
    private int activeAlerts;
    private int resolvedAlertsToday;

    // Per-type alert breakdown
    private int lowMoistureAlerts;
    private int highTemperatureAlerts;
    private int systemAlerts;

    // Water tank status
    private List<WaterTankDTO> waterTanks;
}
