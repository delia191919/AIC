package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "orientation")
@Data
public class Orientation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 10, nullable = false)
    private String direction;
}
