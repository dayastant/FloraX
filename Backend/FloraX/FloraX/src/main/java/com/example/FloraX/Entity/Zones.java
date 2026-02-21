package com.example.FloraX.Entity;


import com.example.FloraX.Enum.SunlightExposure;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "zones")
public class Zones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long zoneId;

    @ManyToOne
    @JoinColumn(name = "garden_id")
    private Gardens garden;

    private String zoneName;
    private String plantType;
    private String soilType;

    @Enumerated(EnumType.STRING)
    private SunlightExposure sunlightExposure;

    private Double moistureThresholdMin;
    private Double moistureThresholdMax;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "zone")
    private List<Sensors> sensors;

    // Getters and Setters
    public Long getZoneId() { return zoneId; }
    public void setZoneId(Long zoneId) { this.zoneId = zoneId; }

    public Gardens getGarden() { return garden; }
    public void setGarden(Gardens garden) { this.garden = garden; }

    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }

    public String getPlantType() { return plantType; }
    public void setPlantType(String plantType) { this.plantType = plantType; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }

    public SunlightExposure getSunlightExposure() { return sunlightExposure; }
    public void setSunlightExposure(SunlightExposure sunlightExposure) { this.sunlightExposure = sunlightExposure; }

    public Double getMoistureThresholdMin() { return moistureThresholdMin; }
    public void setMoistureThresholdMin(Double moistureThresholdMin) { this.moistureThresholdMin = moistureThresholdMin; }

    public Double getMoistureThresholdMax() { return moistureThresholdMax; }
    public void setMoistureThresholdMax(Double moistureThresholdMax) { this.moistureThresholdMax = moistureThresholdMax; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Sensors> getSensors() { return sensors; }
    public void setSensors(List<Sensors> sensors) { this.sensors = sensors; }
}