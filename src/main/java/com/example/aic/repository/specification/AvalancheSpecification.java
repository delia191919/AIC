package com.example.aic.repository.specification;

import com.example.aic.model.*;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AvalancheSpecification {

    public static Specification<Avalanche> filterBy(
            String title, Integer massifId, Integer typeId, Integer causeId,
            Integer orientationId, LocalDate startDate, LocalDate endDate,
            Integer minAltitude, Integer maxAltitude, Integer minSlope,
            String size, Boolean hasVictims, String status) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }

            if (massifId != null) {
                predicates.add(cb.equal(root.get("massif").get("id"), massifId));
            }

            if (typeId != null) {
                predicates.add(cb.equal(root.get("type").get("id"), typeId));
            }

            if (causeId != null) {
                predicates.add(cb.equal(root.get("cause").get("id"), causeId));
            }

            if (orientationId != null) {
                predicates.add(cb.equal(root.get("orientation").get("id"), orientationId));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), Avalanche.Status.valueOf(status.toUpperCase())));
            }

            if (size != null && !size.isEmpty()) {
                predicates.add(cb.equal(root.get("size"), size));
            }

            // Technical Details filters
            if (minAltitude != null || maxAltitude != null || minSlope != null) {
                Join<Avalanche, TechnicalDetails> techJoin = root.join("technicalDetailsList", JoinType.LEFT);
                if (minAltitude != null) {
                    predicates.add(cb.greaterThanOrEqualTo(techJoin.get("altitude"), minAltitude));
                }
                if (maxAltitude != null) {
                    predicates.add(cb.lessThanOrEqualTo(techJoin.get("altitude"), maxAltitude));
                }
                if (minSlope != null) {
                    predicates.add(cb.greaterThanOrEqualTo(techJoin.get("slopeInterpolation"), minSlope));
                }
            }

            // Victims filters
            if (Boolean.TRUE.equals(hasVictims)) {
                Join<Avalanche, DamagesAndVictims> victimsJoin = root.join("damagesAndVictimsList", JoinType.LEFT);
                predicates.add(cb.greaterThan(victimsJoin.get("personsCaught"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
