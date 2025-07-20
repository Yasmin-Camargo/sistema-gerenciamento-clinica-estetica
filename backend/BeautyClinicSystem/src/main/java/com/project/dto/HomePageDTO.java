package com.project.dto;

import java.util.List;

public record HomePageDTO(
        String estheticianName,
        List<AppointmentDTO> nextAppointments,
        List<PopularProceduresDTO> popularProcedures,
        Double totalRevenue
) {
}


