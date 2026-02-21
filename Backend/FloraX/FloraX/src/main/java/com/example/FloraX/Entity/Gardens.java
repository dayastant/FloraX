package com.example.FloraX.Entity;



import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "gardens")
public class Gardens {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gardenId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    private String gardenName;
    private String location;
    private Double totalArea;
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "garden")
    private List<Zones> zones;

    // Getters and Setters
    public Long getGardenId() { return gardenId; }
    public void setGardenId(Long gardenId) { this.gardenId = gardenId; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }

    public String getGardenName() { return gardenName; }
    public void setGardenName(String gardenName) { this.gardenName = gardenName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getTotalArea() { return totalArea; }
    public void setTotalArea(Double totalArea) { this.totalArea = totalArea; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Zones> getZones() { return zones; }
    public void setZones(List<Zones> zones) { this.zones = zones; }
}
