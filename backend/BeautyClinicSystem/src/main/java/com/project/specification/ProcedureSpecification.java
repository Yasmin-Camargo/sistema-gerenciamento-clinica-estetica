package com.project.specification;

import com.project.models.Procedure;
import org.springframework.data.jpa.domain.Specification;

public class ProcedureSpecification {
    public static Specification<Procedure> nameContains(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}
