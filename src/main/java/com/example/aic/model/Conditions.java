package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "conditions")
@Data
public class Conditions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

    @ManyToOne
    @JoinColumn(name = "massif_id")
    private Massif massif;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image1_url", columnDefinition = "TEXT")
    private String image1Url;

    @Column(name = "image2_url", columnDefinition = "TEXT")
    private String image2Url;

    @Column(name = "image3_url", columnDefinition = "TEXT")
    private String image3Url;

    @Column(name = "image4_url", columnDefinition = "TEXT")
    private String image4Url;

    @ManyToOne
    @JoinColumn(name = "contributor_id")
    private User contributor;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
