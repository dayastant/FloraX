package com.example.FloraX.Entity;

import com.example.FloraX.Enum.SensorStatus;
import com.example.FloraX.Enum.SensorType;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "sensors")
public class Sensors {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sensorId;

    @ManyToOne
    @JoinColumn(name = "zone_id")
    private Zones zone;

    @Enumerated(EnumType.STRING)
    private SensorType sensorType;

    private String serialNumber;
    private LocalDate installationDate;

    @Enumerated(EnumType.STRING)
    private SensorStatus status;

    @OneToMany(mappedBy = "sensor")
    private List<SensorReadings> readings;

    // Getters and Setters
    public Long getSensorId() { return sensorId; }
    public void setSensorId(Long sensorId) { this.sensorId = sensorId; }

    public Zones getZone() { return zone; }
    public void setZone(Zones zone) { this.zone = zone; }

    public SensorType getSensorType() { return sensorType; }
    public void setSensorType(SensorType sensorType) { this.sensorType = sensorType; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public LocalDate getInstallationDate() { return installationDate; }
    public void setInstallationDate(LocalDate installationDate) { this.installationDate = installationDate; }

    public SensorStatus getStatus() { return status; }
    public void setStatus(SensorStatus status) { this.status = status; }

    public List<SensorReadings> getReadings() { return readings; }
    public void setReadings(List<SensorReadings> readings) { this.readings = readings; }
}