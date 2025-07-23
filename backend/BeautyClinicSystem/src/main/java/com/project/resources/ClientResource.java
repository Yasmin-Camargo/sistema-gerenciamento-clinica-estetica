package com.project.resources;

import com.project.dto.ClientDTO;
import com.project.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientResource {

    private final ClientService clientService;

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping
    public ResponseEntity<List<ClientDTO>> listAll() {
        List<ClientDTO> list = clientService.listAll();
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping("/filter")
    public ResponseEntity<List<ClientDTO>> filterClients(
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate,
            @RequestParam(required = false) Boolean isActive
    ) {
        return ResponseEntity.ok(
            clientService.filterClients(cpf, name, startDate, endDate, isActive)
        );
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @GetMapping("/{cpf}")
    public ResponseEntity<ClientDTO> findByCpf(@PathVariable String cpf) {
        ClientDTO dto = clientService.findByCpf(cpf);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @PostMapping
    public ResponseEntity<ClientDTO> create(@Valid @RequestBody ClientDTO dto) {
        ClientDTO createdDto = clientService.create(dto);
        return ResponseEntity.ok(createdDto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @PutMapping("/{cpf}")
    public ResponseEntity<ClientDTO> update(@PathVariable String cpf, @Valid @RequestBody ClientDTO dto) {
        ClientDTO updatedDto = clientService.update(cpf, dto);
        return ResponseEntity.ok(updatedDto);
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> delete(@PathVariable String cpf) {
        clientService.delete(cpf);
        return ResponseEntity.noContent().build();
    }
}
