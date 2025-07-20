package com.project.dto;

import java.util.List;

public record HomePageDTO(
        String estheticianName,
        List<AppointmentDTO> nextAppointments,
        List<PopularProceduresDTO> popularProcedures,
        Double totalRevenue
) {

    public record PopularProceduresDTO(
            String name,
            Integer count
    ) {
    }
}


