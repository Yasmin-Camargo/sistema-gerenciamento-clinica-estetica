package com.project.resources;

import com.project.dto.AppointmentDTO;
import com.project.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentResource {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> listAll() {
        return ResponseEntity.ok(appointmentService.listAll());
    }

    @GetMapping("/{estheticianCpf}/{clientCpf}/{dateTime}")
    public ResponseEntity<AppointmentDTO> findById(
            @PathVariable String estheticianCpf,
            @PathVariable String clientCpf,
            @PathVariable String dateTime
    ) {
        return ResponseEntity.ok(appointmentService.findById(estheticianCpf, clientCpf, dateTime));
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> create(@Valid @RequestBody AppointmentDTO dto) {
        return ResponseEntity.ok(appointmentService.create(dto));
    }

    @PutMapping("/{estheticianCpf}/{clientCpf}/{dateTime}")
    public ResponseEntity<AppointmentDTO> update(
            @PathVariable String estheticianCpf,
            @PathVariable String clientCpf,
            @PathVariable String dateTime,
            @Valid @RequestBody AppointmentDTO dto
    ) {
        return ResponseEntity.ok(appointmentService.update(estheticianCpf, clientCpf, dateTime, dto));
    }

    @DeleteMapping("/{estheticianCpf}/{clientCpf}/{dateTime}")
    public ResponseEntity<Void> delete(
            @PathVariable String estheticianCpf,
            @PathVariable String clientCpf,
            @PathVariable String dateTime
    ) {
        appointmentService.delete(estheticianCpf, clientCpf, dateTime);
        return ResponseEntity.noContent().build();
    }
}
