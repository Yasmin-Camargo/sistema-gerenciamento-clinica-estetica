package com.project.dto;

public record ProcedureDTO(
        String name,
        String description,
        Integer estimatedDuration,
        Double cost
) {
}
