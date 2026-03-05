package com.example.aic.repository;

import com.example.aic.model.AvalancheCause;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvalancheCauseRepository extends JpaRepository<AvalancheCause, Integer> {
}
