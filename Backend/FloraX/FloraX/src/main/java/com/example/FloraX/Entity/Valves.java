package com.example.FloraX.Entity;


import com.example.FloraX.Enum.PowerSource;
import com.example.FloraX.Enum.ValveStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "valves")
public class Valves {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long valveId;

    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zones zone;

    @Enumerated(EnumType.STRING)
    private ValveStatus valveStatus;

    @Enumerated(EnumType.STRING)
    private PowerSource powerSource;

    private LocalDateTime lastActivatedAt;

    @OneToMany(mappedBy = "valve")
    private List<IrrigationLogs> irrigationLogs;

    // Getters and Setters
    public Long getValveId() { return valveId; }
    public void setValveId(Long valveId) { this.valveId = valveId; }

    public Zones getZone() { return zone; }
    public void setZone(Zones zone) { this.zone = zone; }

    public ValveStatus getValveStatus() { return valveStatus; }
    public void setValveStatus(ValveStatus valveStatus) { this.valveStatus = valveStatus; }

    public PowerSource getPowerSource() { return powerSource; }
    public void setPowerSource(PowerSource powerSource) { this.powerSource = powerSource; }

    public LocalDateTime getLastActivatedAt() { return lastActivatedAt; }
    public void setLastActivatedAt(LocalDateTime lastActivatedAt) { this.lastActivatedAt = lastActivatedAt; }

    public List<IrrigationLogs> getIrrigationLogs() { return irrigationLogs; }
    public void setIrrigationLogs(List<IrrigationLogs> irrigationLogs) { this.irrigationLogs = irrigationLogs; }
}