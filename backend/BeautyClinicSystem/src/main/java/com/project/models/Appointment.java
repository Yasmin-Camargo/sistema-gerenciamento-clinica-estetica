package com.project.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "appointment")
public class Appointment {

    @EmbeddedId
    private AppointmentId id;

    @ManyToOne
    @MapsId("clientCpf")
    @JoinColumn(name = "client_cpf", nullable = false)
    private Client client;

    @ManyToOne
    @MapsId("estheticianCpf")
    @JoinColumn(name = "esthetician_cpf", nullable = false)
    private Esthetician esthetician;

    @Column(name = "clinical_notes")
    private String clinicalNotes;

    private Double value;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @ManyToMany
    @JoinTable(
            name = "appointment_procedure",
            joinColumns = {
                    @JoinColumn(name = "esthetician_cpf", referencedColumnName = "esthetician_cpf"),
                    @JoinColumn(name = "client_cpf", referencedColumnName = "client_cpf"),
                    @JoinColumn(name = "date_time", referencedColumnName = "date_time")
            },
            inverseJoinColumns = @JoinColumn(name = "procedure_id")
    )
    private List<Procedure> procedures;
}
