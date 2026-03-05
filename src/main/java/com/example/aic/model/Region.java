package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "region")
@Data
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50, nullable = false)
    private String name;
}
