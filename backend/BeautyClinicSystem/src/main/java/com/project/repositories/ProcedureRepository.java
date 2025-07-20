package com.project.repositories;

import com.project.dto.PopularProceduresDTO;
import com.project.models.Procedure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcedureRepository extends JpaRepository<Procedure, String>, JpaSpecificationExecutor<Procedure> {
    @Query("""
        SELECT new com.project.dto.PopularProceduresDTO(p.name, COUNT(p))
        FROM Appointment a
        JOIN a.procedures p
        GROUP BY p.name
        ORDER BY COUNT(p) DESC
    """)
    List<PopularProceduresDTO> findTopProcedures();
}
