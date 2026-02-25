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
    private String zoneName;
    private String valveStatus; // OPEN, CLOSED, FAULTY
    private String powerSource; // ELECTRIC, SOLAR, MANUAL
    private LocalDateTime lastActivatedAt;
}