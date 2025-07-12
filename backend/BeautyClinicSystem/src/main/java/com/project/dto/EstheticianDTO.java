package com.project.dto;

import java.time.LocalDate;

public record EstheticianDTO(
        String cpf,
        String name,
        String phone,
        LocalDate birthDate,
        String email,
        String address,
        String professionalRegistrationNumber,
        String specializations
) {
}
