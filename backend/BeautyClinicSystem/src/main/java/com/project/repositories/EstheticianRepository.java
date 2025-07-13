package com.project.repositories;

import com.project.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstheticianRepository extends JpaRepository<Client, String> {
}
