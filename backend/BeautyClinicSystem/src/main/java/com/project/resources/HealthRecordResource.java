package com.project.resources;

import com.project.dto.HealthRecordDTO;
import com.project.service.HealthRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health-records")
@RequiredArgsConstructor
public class HealthRecordResource {

    private final HealthRecordService healthRecordService;

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping("/{clientCpf}")
    public ResponseEntity<HealthRecordDTO> findByClientCpf(@PathVariable String clientCpf) {
        return ResponseEntity.ok(healthRecordService.findByClientCpf(clientCpf));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @PutMapping("/{clientCpf}")
    public ResponseEntity<HealthRecordDTO> createOrUpdate(
            @PathVariable String clientCpf,
            @Valid @RequestBody HealthRecordDTO dto) {
        return ResponseEntity.ok(healthRecordService.createOrUpdate(clientCpf, dto));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @DeleteMapping("/{clientCpf}")
    public ResponseEntity<Void> delete(@PathVariable String clientCpf) {
        healthRecordService.delete(clientCpf);
        return ResponseEntity.noContent().build();
    }
}
