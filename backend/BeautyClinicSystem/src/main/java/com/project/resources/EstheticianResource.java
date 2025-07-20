package com.project.resources;

import com.project.dto.EstheticianDTO;
import com.project.security.EstheticianUserDetails;
import com.project.service.EstheticianService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estheticians")
@RequiredArgsConstructor
public class EstheticianResource {

    private final EstheticianService estheticianService;

    @GetMapping("/me")
    public ResponseEntity<EstheticianDTO> getAuthenticatedUser(@AuthenticationPrincipal EstheticianUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        EstheticianDTO dto = estheticianService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }

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
