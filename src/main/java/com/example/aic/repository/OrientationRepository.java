package com.example.aic.repository;

import com.example.aic.model.Orientation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrientationRepository extends JpaRepository<Orientation, Integer> {
}
