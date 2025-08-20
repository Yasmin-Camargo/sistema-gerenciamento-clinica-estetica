package com.project.resources;

import com.project.dto.ProcedureDTO;
import com.project.service.ProcedureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/procedures")
@RequiredArgsConstructor
public class ProcedureResource {

    private final ProcedureService procedureService;

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping
    public ResponseEntity<List<ProcedureDTO>> listAll() {
        List<ProcedureDTO> list = procedureService.listAll();
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping("/filter")
    public ResponseEntity<List<ProcedureDTO>> filterProcedures(
            @RequestParam(required = false) String name
    ) {
        return ResponseEntity.ok(procedureService.filterProcedures(name));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping("/{name}")
    public ResponseEntity<ProcedureDTO> findByName(@PathVariable String name) {
        ProcedureDTO dto = procedureService.findByName(name);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @PostMapping
    public ResponseEntity<ProcedureDTO> create(@Valid @RequestBody ProcedureDTO dto) {
        ProcedureDTO createdDto = procedureService.create(dto);
        return ResponseEntity.ok(createdDto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @PutMapping("/{name}")
    public ResponseEntity<ProcedureDTO> update(@PathVariable String name, @Valid @RequestBody ProcedureDTO dto) {
        ProcedureDTO updatedDto = procedureService.update(name, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @DeleteMapping("/{name}")
    public ResponseEntity<Void> delete(@PathVariable String name) {
        procedureService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
