package com.example.FloraX.Entity;


import com.example.FloraX.Enum.PumpStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pumps")
public class Pumps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pumpId;

    @ManyToOne
    @JoinColumn(name = "tank_id")
    private WaterTanks tank;

    @Enumerated(EnumType.STRING)
    private PumpStatus status;

    private LocalDateTime lastActivatedAt;

    // Getters and Setters
    public Long getPumpId() { return pumpId; }
    public void setPumpId(Long pumpId) { this.pumpId = pumpId; }

    public WaterTanks getTank() { return tank; }
    public void setTank(WaterTanks tank) { this.tank = tank; }

    public PumpStatus getStatus() { return status; }
    public void setStatus(PumpStatus status) { this.status = status; }

    public LocalDateTime getLastActivatedAt() { return lastActivatedAt; }
    public void setLastActivatedAt(LocalDateTime lastActivatedAt) { this.lastActivatedAt = lastActivatedAt; }
}