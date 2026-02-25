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
public class UserDashboardResponse {

    // User info
    private Long userId;
    private String userName;
    private String email;

    // Summary stats
    private int totalGardens;
    private int totalZones;
    private int activeAlerts;
    private int totalIrrigationsToday;
    private Double avgMoistureLevel; // average across all zones
    private Double totalWaterUsedToday; // litres used today across all gardens

    // Detailed garden list (with zones, alerts, logs)
    private List<GardenDTO> gardens;
}