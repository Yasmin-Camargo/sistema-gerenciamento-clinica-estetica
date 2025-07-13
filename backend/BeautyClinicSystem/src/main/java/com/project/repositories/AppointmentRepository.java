package com.project.repositories;

import com.project.models.Appointment;
import com.project.models.AppointmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, AppointmentId> {
}
