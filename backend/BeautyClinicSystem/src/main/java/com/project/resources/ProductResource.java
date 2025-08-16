package com.project.resources;

import com.project.dto.ProductDTO;
import com.project.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductResource {

    private final ProductService productService;

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping
    public ResponseEntity<List<ProductDTO>> listAll() {
        return ResponseEntity.ok(productService.listAll());
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @PostMapping
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.create(dto));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, @Valid @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
