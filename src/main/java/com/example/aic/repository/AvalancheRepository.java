package com.example.aic.repository;

import com.example.aic.model.Avalanche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvalancheRepository extends JpaRepository<Avalanche, Integer>, JpaSpecificationExecutor<Avalanche> {
    List<Avalanche> findByStatus(Avalanche.Status status);

    List<Avalanche> findByContributorId(Integer contributorId);
}
