package com.project.specification;

import com.project.models.Appointment;
import com.project.models.AppointmentStatus;
import com.project.models.Procedure;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class AppointmentSpecification {
    public static Specification<Appointment> clientNameContains(String name) {
        return (root, query, builder) -> name == null ? null :
                builder.like(builder.lower(root.get("client").get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Appointment> hasProcedure(String procedureName) {
        return (root, query, builder) -> {
            if (procedureName == null) return null;
            Join<Appointment, Procedure> procedureJoin = root.join("procedures", JoinType.INNER);
            return builder.equal(procedureJoin.get("name"), procedureName);
        };
    }

    public static Specification<Appointment> hasStatus(AppointmentStatus status) {
        return (root, query, builder) -> status == null ? null :
                builder.equal(root.get("status"), status);
    }

    public static Specification<Appointment> hasDate(LocalDate date) {
        return (root, query, builder) -> {
            if (date == null) return null;
            jakarta.persistence.criteria.Expression<java.sql.Date> appointmentDate = builder.function("DATE", java.sql.Date.class, root.get("id").get("dateTime"));
            return builder.equal(appointmentDate, java.sql.Date.valueOf(date));
        };
    }
}
