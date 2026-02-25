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
public class IrrigationLogDTO {
    private Long logId;
    private String zoneName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double waterVolumeUsed;
    private String triggerType; // TriggerType enum name
    private Long durationMinutes; // computed: endTime - startTime
}