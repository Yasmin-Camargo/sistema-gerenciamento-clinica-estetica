package com.project.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@PrimaryKeyJoinColumn(name = "cpf")
@Table(name = "esthetician")
public class Esthetician extends Person implements Serializable {

    @Column(nullable = false)
    private String professionalRegistrationNumber;

    @Column(nullable = false)
    private String password;

    private String specializations;
}
