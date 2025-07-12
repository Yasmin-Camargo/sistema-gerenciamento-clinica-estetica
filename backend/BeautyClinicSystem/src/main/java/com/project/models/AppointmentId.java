package com.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.OffsetDateTime;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class AppointmentId implements Serializable {

    @Column(name = "esthetician_cpf")
    private String estheticianCpf;

    @Column(name = "client_cpf")
    private String clientCpf;

    @Column(name = "date_time")
    private OffsetDateTime dateTime;
}
