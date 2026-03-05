package com.example.aic.dto;

import lombok.Data;

@Data
public class DamagesAndVictimsDTO {
    private Integer personsCaught;
    private Integer personsPartially;
    private Integer personsFully;
    private Integer personsInjured;
    private Integer personsKilled;
    private Integer materialDamage;
}
