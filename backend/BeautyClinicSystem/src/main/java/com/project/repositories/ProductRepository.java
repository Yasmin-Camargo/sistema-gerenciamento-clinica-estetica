package com.project.repositories;

import com.project.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByEstheticianCpf(String cpf);

    @Modifying
    @Query("DELETE FROM Product p WHERE p.esthetician.cpf = :estheticianCpf")
    int deleteByEstheticianCpf(@Param("estheticianCpf") String estheticianCpf);
}
