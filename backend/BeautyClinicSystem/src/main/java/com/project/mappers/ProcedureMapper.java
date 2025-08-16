package com.project.mappers;

import com.project.dto.ProcedureDTO;
import com.project.dto.ProductReferenceDTO;
import com.project.models.Procedure;
import com.project.models.Product;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ProcedureMapper {
    public static ProcedureDTO fromEntityToDto(Procedure procedure) {
        List<ProductReferenceDTO> productRefs = procedure.getProducts() == null ? List.of() :
                procedure.getProducts().stream()
                        .filter(Objects::nonNull)
                        .map(p -> new ProductReferenceDTO(p.getId(), p.getName()))
                        .collect(Collectors.toList());

        return new ProcedureDTO(
                procedure.getName(),
                procedure.getDescription(),
                procedure.getEstimatedDuration(),
                procedure.getCost(),
                productRefs
        );
    }

    public static Procedure fromDtoToEntity(ProcedureDTO dto, List<Product> products) {
        Procedure procedure = new Procedure();
        procedure.setName(dto.name());
        procedure.setDescription(dto.description());
        procedure.setEstimatedDuration(dto.estimatedDuration());
        procedure.setCost(dto.cost());
        procedure.setProducts(products);
        return procedure;
    }
}
