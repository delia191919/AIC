package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "avalancheimage")
@Data
public class AvalancheImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "avalanche_id")
    private Avalanche avalanche;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;
}
