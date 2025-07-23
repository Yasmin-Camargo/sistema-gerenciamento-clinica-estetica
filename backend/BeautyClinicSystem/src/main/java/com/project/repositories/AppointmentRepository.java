package com.project.repositories;

import com.project.models.Appointment;
import com.project.models.AppointmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, AppointmentId>, JpaSpecificationExecutor<Appointment> {

    @Query("""
       SELECT COUNT(a) FROM Appointment a
       WHERE a.id.estheticianCpf = :estheticianCpf
    """)
    long countByEstheticianCpf(@Param("estheticianCpf") String estheticianCpf);

    @Query("""
       SELECT a FROM Appointment a
       WHERE a.id.dateTime >= :now 
            AND a.id.estheticianCpf = :estheticianCpf
       ORDER BY a.id.dateTime ASC
    """)
    List<Appointment> findNextAppointments(@Param("now") OffsetDateTime now,
                                           @Param("estheticianCpf") String estheticianCpf);

    @Query("""
       SELECT SUM(a.value)
       FROM Appointment a
       WHERE a.status = :status
            AND a.id.estheticianCpf = :estheticianCpf
    """)
    Double getTotalRevenueFromCompletedAppointments(@Param("status") com.project.models.AppointmentStatus status,
                                                    @Param("estheticianCpf") String estheticianCpf);
}
