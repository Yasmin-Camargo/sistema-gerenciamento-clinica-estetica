package com.project.dto;

import java.util.List;

public record ProcedureDTO(
        String name,
        String description,
        Integer estimatedDuration,
        Double cost,
        List<ProductReferenceDTO> products
) {
}
