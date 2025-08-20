package com.project.resources;

import com.project.dto.AppointmentDTO;
import com.project.models.AppointmentStatus;
import com.project.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentResource {

    private final AppointmentService appointmentService;

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> listAll() {
        return ResponseEntity.ok(appointmentService.listAll());
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping("/filter")
    public ResponseEntity<List<AppointmentDTO>> filterAppointments(
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String procedureName,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(appointmentService.filterAppointments(clientName, procedureName, status, date));
    }


    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional(readOnly = true)
    @GetMapping("/{estheticianCpf}/{clientCpf}/{dateTime}")
    public ResponseEntity<AppointmentDTO> findById(
            @PathVariable String estheticianCpf,
            @PathVariable String clientCpf,
            @PathVariable String dateTime
    ) {
        return ResponseEntity.ok(appointmentService.findById(estheticianCpf, clientCpf, dateTime));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @PostMapping
    public ResponseEntity<AppointmentDTO> create(@Valid @RequestBody AppointmentDTO dto) {
        return ResponseEntity.ok(appointmentService.create(dto));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
    @PutMapping("/{estheticianCpf}/{clientCpf}/{dateTime}")
    public ResponseEntity<AppointmentDTO> update(
            @PathVariable String estheticianCpf,
            @PathVariable String clientCpf,
            @PathVariable String dateTime,
            @Valid @RequestBody AppointmentDTO dto
    ) {
        return ResponseEntity.ok(appointmentService.update(estheticianCpf, clientCpf, dateTime, dto));
    }

    @PreAuthorize("hasRole('ESTHETICIAN')")
    @Transactional
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
