package com.example.aic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "damages_and_victims")
@Data
public class DamagesAndVictims {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "avalanche_id")
    private Avalanche avalanche;

    @Column(name = "persons_caught")
    private Integer personsCaught;

    @Column(name = "persons_partially")
    private Integer personsPartially;

    @Column(name = "persons_fully")
    private Integer personsFully;

    @Column(name = "persons_injured")
    private Integer personsInjured;

    @Column(name = "persons_killed")
    private Integer personsKilled;

    @Column(name = "material_damage")
    private Integer materialDamage;
}
