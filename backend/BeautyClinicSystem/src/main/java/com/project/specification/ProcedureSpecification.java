package com.project.specification;

import com.project.models.Client;
import com.project.models.Esthetician;
import com.project.models.Procedure;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class ProcedureSpecification {

    public static Specification<Procedure> byEsthetician(String cpf) {
        return (root, query, builder) -> {
            if (cpf == null) return null;
            Join<Client, Procedure> procedureEstheticianJoin = root.join("esthetician", JoinType.INNER);
            return builder.equal(procedureEstheticianJoin.get("cpf"), cpf);
        };
    }

    public static Specification<Procedure> nameContains(String name) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }
}
