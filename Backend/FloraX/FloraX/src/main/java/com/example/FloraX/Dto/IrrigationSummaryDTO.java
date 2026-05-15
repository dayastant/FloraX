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
public class IrrigationSummaryDTO {
    private Long gardenId;
    private Integer totalEventsLast24h;
    private Long totalDurationMinutes;
    private Double totalWaterUsedLiters;
    private LocalDateTime lastIrrigationTime;
}
