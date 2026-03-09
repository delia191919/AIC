package com.example.aic.repository;

import com.example.aic.model.Avalanche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvalancheRepository extends JpaRepository<Avalanche, Integer>, JpaSpecificationExecutor<Avalanche> {
    Page<Avalanche> findByStatus(Avalanche.Status status, Pageable pageable);

    List<Avalanche> findByContributorId(Integer contributorId);
}
