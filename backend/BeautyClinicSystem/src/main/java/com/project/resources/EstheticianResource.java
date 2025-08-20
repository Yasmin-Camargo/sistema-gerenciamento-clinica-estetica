package com.project.resources;

import com.project.dto.EstheticianDTO;
import com.project.security.EstheticianUserDetails;
import com.project.service.EstheticianService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/estheticians")
@RequiredArgsConstructor
public class EstheticianResource {

    private final EstheticianService estheticianService;

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping("/me")
    @Transactional(readOnly = true)
    public ResponseEntity<EstheticianDTO> getAuthenticatedUser(@AuthenticationPrincipal EstheticianUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        EstheticianDTO dto = estheticianService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<EstheticianDTO>> listAll() {
        List<EstheticianDTO> list = estheticianService.listAll();
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping("/{cpf}")
    public ResponseEntity<EstheticianDTO> findByCpf(@PathVariable String cpf) {
        EstheticianDTO dto = estheticianService.findByCpf(cpf);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @PutMapping("/{cpf}")
    public ResponseEntity<EstheticianDTO> update(@PathVariable String cpf, @Valid @RequestBody EstheticianDTO dto) {
        EstheticianDTO updatedDto = estheticianService.update(cpf, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> delete(@PathVariable String cpf) {
        estheticianService.delete(cpf);
        return ResponseEntity.noContent().build();
    }
}
