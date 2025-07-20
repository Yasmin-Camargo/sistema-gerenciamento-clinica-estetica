package com.project.dto;

public record ClinicOverviewDTO(
        int totalClients,
        int totalAppointments,
        int totalProcedures,
        int totalProducts
) {
}
