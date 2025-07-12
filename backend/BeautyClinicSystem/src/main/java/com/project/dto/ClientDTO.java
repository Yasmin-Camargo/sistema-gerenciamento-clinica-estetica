package com.project.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record ClientDTO(
        String cpf,
        String name,
        String phone,
        LocalDate birthDate,
        String email,
        String address,
        OffsetDateTime registrationDate,
        boolean isActive,
        OffsetDateTime lastConsultationDate
) {
}
