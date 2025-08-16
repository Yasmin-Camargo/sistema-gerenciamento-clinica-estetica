package com.project.mappers;

import com.project.dto.ProductDTO;
import com.project.models.Product;

public class ProductMapper {
    public static ProductDTO fromEntityToDto(Product product) {
        return new ProductDTO(product.getId(), product.getName(), product.getDescription(), product.getType());
    }

    public static Product fromDtoToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setId(dto.id());
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setType(dto.type());
        return product;
    }
}
