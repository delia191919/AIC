package com.example.aic.repository;

import com.example.aic.model.AvalancheImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvalancheImageRepository extends JpaRepository<AvalancheImage, Integer> {
    List<AvalancheImage> findByAvalancheId(Long avalancheId);
}
