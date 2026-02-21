package com.example.FloraX.Entity;



import com.example.FloraX.Enum.TriggerType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "irrigation_logs")
public class IrrigationLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zones zone;

    @ManyToOne
    @JoinColumn(name = "valve_id")
    private Valves valve;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double waterVolumeUsed;

    @Enumerated(EnumType.STRING)
    private TriggerType triggerType;

    // Getters and Setters
    public Long getLogId() { return logId; }
    public void setLogId(Long logId) { this.logId = logId; }

    public Zones getZone() { return zone; }
    public void setZone(Zones zone) { this.zone = zone; }

    public Valves getValve() { return valve; }
    public void setValve(Valves valve) { this.valve = valve; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Double getWaterVolumeUsed() { return waterVolumeUsed; }
    public void setWaterVolumeUsed(Double waterVolumeUsed) { this.waterVolumeUsed = waterVolumeUsed; }

    public TriggerType getTriggerType() { return triggerType; }
    public void setTriggerType(TriggerType triggerType) { this.triggerType = triggerType; }
}