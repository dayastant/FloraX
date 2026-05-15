package com.example.FloraX.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValveDTO {
    private Long valveId;
    private Long zoneId;
    private String zoneName;
    private String status; // OPEN, CLOSED, FAULTY
    private String powerSource; // ELECTRIC, SOLAR, MANUAL
    private LocalDateTime lastActivatedAt;
    private String lastActivatedAtFormatted; // human-readable format
    private Boolean isActive; // true if OPEN, false if CLOSED
}