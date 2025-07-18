package com.project.repositories;

import com.project.models.Esthetician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstheticianRepository extends JpaRepository<Esthetician, String> {

    Optional<Esthetician> findByEmail(String email);
}
