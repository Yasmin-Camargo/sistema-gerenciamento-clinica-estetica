package com.project.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String type;

    @ManyToMany(mappedBy = "products")
    private Set<Procedure> procedures;

    @ManyToOne
    @JoinColumn(name = "esthetician_cpf", nullable = false)
    private Esthetician esthetician;
}
