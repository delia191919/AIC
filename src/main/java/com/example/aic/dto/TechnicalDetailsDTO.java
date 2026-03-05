package com.example.aic.dto;

import lombok.Data;

@Data
public class TechnicalDetailsDTO {
    private Integer altitude;
    private Integer slopeInterpolation;
    private Integer trackLength;
    private Integer crownDepth;
    private Integer crownWidth;
    private Integer verticalDrop;
    private Float accumulationArea;
    private Double accumLat;
    private Double accumLng;
    private Integer runoutVerticalDrop;
    private String relativeSize;
    private String crownDepthText;
}
