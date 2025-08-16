package com.project.service;

import com.project.dto.ProductDTO;
import com.project.mappers.ProductMapper;
import com.project.models.Product;
import com.project.repositories.EstheticianRepository;
import com.project.repositories.ProductRepository;
import com.project.security.AuthService;
import com.project.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final AuthService authService;
    private final EstheticianRepository estheticianRepository;

    @Transactional(readOnly = true)
    public List<ProductDTO> listAll() {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Specification<Product> spec = ProductSpecification.byEsthetician(loggedInEstheticianCpf);

        return productRepository.findAll(spec).stream()
                .map(ProductMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .filter(p -> p.getEsthetician().getCpf().equals(authService.getLoggedInEstheticianCpf()))
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "product-not-found"));
        return ProductMapper.fromEntityToDto(product);
    }

    @Transactional
    public ProductDTO create(ProductDTO dto) {
        Product product = ProductMapper.fromDtoToEntity(dto);
        String cpf = authService.getLoggedInEstheticianCpf();
        product.setEsthetician(estheticianRepository.getReferenceById(cpf));
        Product saved = productRepository.save(product);
        return ProductMapper.fromEntityToDto(saved);
    }

    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "product-not-found"));

        if (!product.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-update-product-for-another-esthetician");
        }

        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setType(dto.type());
        Product updated = productRepository.save(product);
        return ProductMapper.fromEntityToDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "product-not-found"));

        if (!product.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-delete-product-for-another-esthetician");
        }

        productRepository.deleteById(id);
    }
}
