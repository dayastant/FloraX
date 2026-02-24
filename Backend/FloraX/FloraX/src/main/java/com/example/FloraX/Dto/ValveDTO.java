package com.example.FloraX.Dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ValveDTO {

    private Long valveId;
    private Long zoneId;
    private String valveStatus;
    private String powerSource;
    private LocalDateTime lastActivatedAt;
}