package com.project.dto;

import com.project.models.AppointmentStatus;

import java.time.OffsetDateTime;
import java.util.List;

public record AppointmentDTO(
        ReferenceDTO esthetician,
        ReferenceDTO client,
        OffsetDateTime dateTime,
        String clinicalNotes,
        Double value,
        AppointmentStatus status,
        List<String> proceduresName
) {
}
