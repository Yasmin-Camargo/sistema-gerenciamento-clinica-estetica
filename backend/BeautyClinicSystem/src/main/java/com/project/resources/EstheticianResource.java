package com.project.resources;

import com.project.dto.EstheticianDTO;
import com.project.service.EstheticianService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estheticians")
@RequiredArgsConstructor
public class EstheticianResource {

    private final EstheticianService estheticianService;

    @GetMapping
    public ResponseEntity<List<EstheticianDTO>> listAll() {
        List<EstheticianDTO> list = estheticianService.listAll();
        return ResponseEntity.ok(list);
    }

    @Transactional
    @GetMapping("/{cpf}")
    public ResponseEntity<EstheticianDTO> findByCpf(@PathVariable String cpf) {
        EstheticianDTO dto = estheticianService.findByCpf(cpf);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<EstheticianDTO> create(@Valid @RequestBody EstheticianDTO dto) {
        EstheticianDTO createdDto = estheticianService.create(dto);
        return ResponseEntity.ok(createdDto);
    }

    @PutMapping("/{cpf}")
    public ResponseEntity<EstheticianDTO> update(@PathVariable String cpf, @Valid @RequestBody EstheticianDTO dto) {
        EstheticianDTO updatedDto = estheticianService.update(cpf, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> delete(@PathVariable String cpf) {
        estheticianService.delete(cpf);
        return ResponseEntity.noContent().build();
    }
}
