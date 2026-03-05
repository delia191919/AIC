package com.example.aic.repository;

import com.example.aic.model.TechnicalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechnicalDetailsRepository extends JpaRepository<TechnicalDetails, Integer> {
    java.util.List<TechnicalDetails> findByAvalancheId(Integer avalancheId);
}
