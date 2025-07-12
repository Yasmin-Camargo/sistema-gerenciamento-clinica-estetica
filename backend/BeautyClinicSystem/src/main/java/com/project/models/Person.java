package com.project.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "person")
public abstract class Person {
    @Id
    private String cpf;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    private LocalDate birthDate;

    @Column(nullable = false)
    private String email;

    private String address;
}
