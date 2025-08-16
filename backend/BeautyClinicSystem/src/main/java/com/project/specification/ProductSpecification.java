package com.project.specification;

import com.project.models.Client;
import com.project.models.Product;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> byEsthetician(String cpf) {
        return (root, query, builder) -> {
            if (cpf == null) return null;
            Join<Client, Product> productEstheticianJoin = root.join("esthetician", JoinType.INNER);
            return builder.equal(productEstheticianJoin.get("cpf"), cpf);
        };
    }

    public static Specification<Product> search(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) return null;
            String likeSearch = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), likeSearch),
                    cb.like(cb.lower(root.get("description")), likeSearch)
            );
        };
    }

    public static Specification<Product> typeEquals(String type) {
        return (root, query, cb) -> {
            if (type == null || type.isBlank()) return null;
            return cb.equal(cb.lower(root.get("type")), type.toLowerCase());
        };
    }
}
