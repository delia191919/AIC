package com.example.aic.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ConditionsDTO {
    private Integer id;
    private String title;
    private LocalDate date;
    private Integer regionId;
    private Integer massifId;
    private String description;
    private String image1Url;
    private String image2Url;
    private String image3Url;
    private String image4Url;
    private Integer contributorId;
    private LocalDateTime createdAt;
}
