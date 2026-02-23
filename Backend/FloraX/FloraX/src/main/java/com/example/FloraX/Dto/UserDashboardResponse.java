package com.example.FloraX.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDashboardResponse {

    private Long userId;
    private String userName;
    private List<GardenDTO> gardens;

}