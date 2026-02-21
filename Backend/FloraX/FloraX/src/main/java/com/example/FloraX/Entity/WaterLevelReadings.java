package com.example.FloraX.Entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "water_level_readings")
public class WaterLevelReadings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long readingId;

    @ManyToOne
    @JoinColumn(name = "tank_id")
    private WaterTanks tank;

    private Double waterLevel;
    private LocalDateTime recordedAt;

    // Getters and Setters
    public Long getReadingId() { return readingId; }
    public void setReadingId(Long readingId) { this.readingId = readingId; }

    public WaterTanks getTank() { return tank; }
    public void setTank(WaterTanks tank) { this.tank = tank; }

    public Double getWaterLevel() { return waterLevel; }
    public void setWaterLevel(Double waterLevel) { this.waterLevel = waterLevel; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}