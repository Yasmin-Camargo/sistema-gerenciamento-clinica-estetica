package com.project.models;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.generator.EventType;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "cpf")
@Table(name = "client")
public class Client extends Person{

    @CurrentTimestamp(event = EventType.INSERT)
    private OffsetDateTime registrationDate;

    private boolean isActive;

    private OffsetDateTime lastConsultationDate;
}
