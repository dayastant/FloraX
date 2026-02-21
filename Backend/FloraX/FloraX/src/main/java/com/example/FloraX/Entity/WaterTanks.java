package com.example.FloraX.Entity;


import com.example.FloraX.Enum.TankStatus;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "water_tanks")
public class WaterTanks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tankId;

    @ManyToOne
    @JoinColumn(name = "garden_id")
    private Gardens garden;

    private Double capacityLiters;
    private Double currentLevelLiters;

    @Enumerated(EnumType.STRING)
    private TankStatus status;

    @OneToMany(mappedBy = "tank")
    private List<WaterLevelReadings> waterLevelReadings;

    @OneToMany(mappedBy = "tank")
    private List<Pumps> pumps;

    // Getters and Setters
    public Long getTankId() { return tankId; }
    public void setTankId(Long tankId) { this.tankId = tankId; }

    public Gardens getGarden() { return garden; }
    public void setGarden(Gardens garden) { this.garden = garden; }

    public Double getCapacityLiters() { return capacityLiters; }
    public void setCapacityLiters(Double capacityLiters) { this.capacityLiters = capacityLiters; }

    public Double getCurrentLevelLiters() { return currentLevelLiters; }
    public void setCurrentLevelLiters(Double currentLevelLiters) { this.currentLevelLiters = currentLevelLiters; }

    public TankStatus getStatus() { return status; }
    public void setStatus(TankStatus status) { this.status = status; }

    public List<WaterLevelReadings> getWaterLevelReadings() { return waterLevelReadings; }
    public void setWaterLevelReadings(List<WaterLevelReadings> waterLevelReadings) { this.waterLevelReadings = waterLevelReadings; }

    public List<Pumps> getPumps() { return pumps; }
    public void setPumps(List<Pumps> pumps) { this.pumps = pumps; }
}