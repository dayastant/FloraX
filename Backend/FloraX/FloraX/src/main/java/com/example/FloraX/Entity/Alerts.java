package com.example.FloraX.Entity;



import com.example.FloraX.Enum.AlertStatus;
import com.example.FloraX.Enum.AlertType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alerts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @ManyToOne
    @JoinColumn(name = "garden_id")
    private Gardens garden;

    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zones zone;

    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    @Lob
    private String message;

    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getAlertId() { return alertId; }
    public void setAlertId(Long alertId) { this.alertId = alertId; }

    public Gardens getGarden() { return garden; }
    public void setGarden(Gardens garden) { this.garden = garden; }

    public Zones getZone() { return zone; }
    public void setZone(Zones zone) { this.zone = zone; }

    public AlertType getAlertType() { return alertType; }
    public void setAlertType(AlertType alertType) { this.alertType = alertType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public AlertStatus getStatus() { return status; }
    public void setStatus(AlertStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}