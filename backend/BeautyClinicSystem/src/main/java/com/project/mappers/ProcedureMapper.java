package com.project.mappers;

import com.project.dto.ProcedureDTO;
import com.project.models.Procedure;

public class ProcedureMapper {
    public static ProcedureDTO fromEntityToDto(Procedure procedure) {
        return new ProcedureDTO(
                procedure.getName(),
                procedure.getDescription(),
                procedure.getEstimatedDuration(),
                procedure.getCost()
        );
    }

    public static Procedure fromDtoToEntity(ProcedureDTO dto) {
        Procedure procedure = new Procedure();
        procedure.setName(dto.name());
        procedure.setDescription(dto.description());
        procedure.setEstimatedDuration(dto.estimatedDuration());
        procedure.setCost(dto.cost());
        return procedure;
    }
}
