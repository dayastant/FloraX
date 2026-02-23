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
public class AlertDTO {

    private Long alertId;
    private String type;
    private String message;
    private String status;
    private LocalDateTime createdAt;

}
