package com.example.aic.repository;

import com.example.aic.model.AvalancheType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvalancheTypeRepository extends JpaRepository<AvalancheType, Integer> {
}
