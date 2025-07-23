package com.project.specification;

import com.project.models.Client;
import com.project.models.Esthetician;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class ClientSpecification {
    public static Specification<Client> byEsthetician(String cpf) {
        return (root, query, builder) -> {
            if (cpf == null) return null;
            Join<Client, Esthetician> clientEstheticianJoin = root.join("esthetician", JoinType.INNER);
            return builder.equal(clientEstheticianJoin.get("cpf"), cpf);
        };
    }

    public static Specification<Client> cpfContains(String cpf) {
        return (root, query, builder) ->
                cpf == null ? null : builder.like(root.get("cpf"), "%" + cpf + "%");
    }

    public static Specification<Client> nameContains(String name) {
        return (root, query, builder) ->
                name == null ? null : builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Client> lastConsultationOn(OffsetDateTime date) {
        return (root, query, builder) ->
                date == null ? null : builder.equal(
                        builder.function("DATE", LocalDate.class, root.get("lastConsultationDate")),
                        date.toLocalDate()
                );
    }

    public static Specification<Client> isActive(Boolean isActive) {
        return (root, query, builder) ->
                isActive == null ? null : builder.equal(root.get("isActive"), isActive);
    }
}
