package com.project.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "procedure")
public class Procedure {

    @Id
    private String name;

    private String description;

    private Integer estimatedDuration;

    private Double cost;
}
