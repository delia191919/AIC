package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "technical_details")
@Data
public class TechnicalDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "avalanche_id")
    private Avalanche avalanche;

    private Integer altitude;

    @Column(name = "slope_interpolation")
    private Integer slopeInterpolation;

    @Column(name = "track_length")
    private Integer trackLength;

    @Column(name = "crown_depth")
    private Integer crownDepth;

    @Column(name = "crown_width")
    private Integer crownWidth;

    @Column(name = "vertical_drop")
    private Integer verticalDrop;

    @Column(name = "accumulation_area")
    private Float accumulationArea;

    @Column(name = "accum_lat")
    private Double accumLat;

    @Column(name = "accum_lng")
    private Double accumLng;

    @Column(name = "runout_vertical_drop")
    private Integer runoutVerticalDrop;

    @Column(name = "relative_size")
    private String relativeSize;

    @Column(name = "crown_depth_text", columnDefinition = "TEXT")
    private String crownDepthText;
}
