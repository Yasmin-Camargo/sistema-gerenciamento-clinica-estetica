package com.project.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "health_record")
public class HealthRecord {

    @Id
    @Column(name = "client_cpf")
    private String clientCpf;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(columnDefinition = "TEXT")
    private String medications;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases;

    @Column(name = "skin_type")
    private String skinType;

    @Column(columnDefinition = "TEXT")
    private String observations;

    private Double height;

    private Double weight;

    private Double imc;

    @Column(name = "previous_procedures", columnDefinition = "TEXT")
    private String previousProcedures;

    private String phototype;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private OffsetDateTime lastUpdated;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "client_cpf")
    private Client client;

    @PrePersist
    @PreUpdate
    public void calculateImc() {
        if (this.height != null && this.height > 0 && this.weight != null && this.weight > 0) {
            this.imc = this.weight / (this.height * this.height);
        } else {
            this.imc = null;
        }
    }
}
