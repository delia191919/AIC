package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "avalanchecause")
@Data
public class AvalancheCause {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false)
    private String description;
}
