package com.example.aic.repository;

import com.example.aic.model.Conditions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConditionsRepository extends JpaRepository<Conditions, Integer>, JpaSpecificationExecutor<Conditions> {
    List<Conditions> findByContributorId(Long contributorId);
}
