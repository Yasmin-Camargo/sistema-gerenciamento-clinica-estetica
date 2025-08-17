package com.project.dto;

import java.time.OffsetDateTime;

public record HealthRecordDTO(
        String clientCpf,
        String allergies,
        String medications,
        String bloodType,
        String chronicDiseases,
        String skinType,
        String observations,
        Double height,
        Double weight,
        Double imc,
        String previousProcedures,
        String phototype,
        OffsetDateTime lastUpdated
) {}
