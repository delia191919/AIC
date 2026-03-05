package com.example.aic.repository;

import com.example.aic.model.DamagesAndVictims;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DamagesAndVictimsRepository extends JpaRepository<DamagesAndVictims, Integer> {
    java.util.List<DamagesAndVictims> findByAvalancheId(Integer avalancheId);
}
