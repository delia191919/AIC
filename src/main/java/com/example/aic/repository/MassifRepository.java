package com.example.aic.repository;

import com.example.aic.model.Massif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MassifRepository extends JpaRepository<Massif, Integer> {
    List<Massif> findByRegionId(Long regionId);
}
