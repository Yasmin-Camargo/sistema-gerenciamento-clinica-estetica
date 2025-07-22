package com.project.dto;

import java.util.List;

public record HomePageDTO(
        List<AppointmentDTO> nextAppointments,
        List<PopularProceduresDTO> popularProcedures,
        Double totalRevenue
) {
}


