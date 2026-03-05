package com.example.aic.repository.specification;

import com.example.aic.model.Conditions;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ConditionsSpecification {

    public static Specification<Conditions> filterBy(
            String title, Integer regionId, Integer massifId,
            LocalDate startDate, LocalDate endDate) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }

            if (regionId != null) {
                predicates.add(cb.equal(root.get("region").get("id"), regionId));
            }

            if (massifId != null) {
                predicates.add(cb.equal(root.get("massif").get("id"), massifId));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("date"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("date"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
