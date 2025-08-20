package com.project.repositories;

import com.project.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, String>, JpaSpecificationExecutor<Client> {
    long countByEstheticianCpf(String estheticianCpf);

    List<Client> findByEstheticianCpf(String estheticianCpf);
}
