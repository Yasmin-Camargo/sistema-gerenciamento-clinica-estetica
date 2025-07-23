package com.project.service;

import com.project.dto.AppointmentDTO;
import com.project.mappers.AppointmentMapper;
import com.project.models.*;
import com.project.repositories.AppointmentRepository;
import com.project.repositories.ClientRepository;
import com.project.repositories.EstheticianRepository;
import com.project.repositories.ProcedureRepository;
import com.project.security.AuthService;
import com.project.specification.AppointmentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ClientRepository clientRepository;
    private final EstheticianRepository estheticianRepository;
    private final ProcedureRepository procedureRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public List<AppointmentDTO> listAll() {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Specification<Appointment> spec = AppointmentSpecification.byEsthetician(loggedInEstheticianCpf);

        return appointmentRepository.findAll(spec).stream()
                .map(AppointmentMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AppointmentDTO> filterAppointments(String clientName, String procedureName, AppointmentStatus status, LocalDate date) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();

        Specification<Appointment> spec = Specification.where(AppointmentSpecification.byEsthetician(loggedInEstheticianCpf))
                .and(AppointmentSpecification.clientNameContains(clientName))
                .and(AppointmentSpecification.hasProcedure(procedureName))
                .and(AppointmentSpecification.hasStatus(status))
                .and(AppointmentSpecification.hasDate(date));

        return appointmentRepository.findAll(spec).stream()
                .map(AppointmentMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AppointmentDTO findById(String estheticianCpf, String clientCpf, String dateTime) {
        AppointmentId id = new AppointmentId();
        id.setEstheticianCpf(estheticianCpf);
        id.setClientCpf(clientCpf);
        id.setDateTime(java.time.OffsetDateTime.parse(dateTime));

        Appointment appointment = appointmentRepository.findById(id)
                .filter(a -> a.getEsthetician().getCpf().equals(authService.getLoggedInEstheticianCpf()))
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "appointment-not-found"));

        return AppointmentMapper.fromEntityToDto(appointment);
    }

    @Transactional
    public AppointmentDTO create(AppointmentDTO dto) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        if (!dto.esthetician().cpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-create-appointment-for-another-esthetician");
        }

        AppointmentId id = new AppointmentId();
        id.setEstheticianCpf(dto.esthetician().cpf());
        id.setClientCpf(dto.client().cpf());
        id.setDateTime(dto.dateTime());

        if (appointmentRepository.existsById(id)) {
            throw new ResponseStatusException(BAD_REQUEST, "appointment-already-registered");
        }

        Client client = clientRepository.findById(dto.client().cpf())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));

        Esthetician esthetician = estheticianRepository.findById(dto.esthetician().cpf())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "esthetician-not-found"));

        List<String> procedureNames = dto.proceduresName();
        List<Procedure> procedures = procedureRepository.findAllById(procedureNames);

        if (procedures.size() != procedureNames.size()) {
            throw new ResponseStatusException(BAD_REQUEST, "one-or-more-procedures-not-found");
        }

        Appointment appointment = AppointmentMapper.fromDtoToEntity(dto, client, esthetician, procedures);
        appointmentRepository.save(appointment);

        return AppointmentMapper.fromEntityToDto(appointment);
    }

    @Transactional
    public AppointmentDTO update(String estheticianCpf, String clientCpf, String dateTime, AppointmentDTO dto) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        if (!dto.esthetician().cpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-update-appointment-for-another-esthetician");
        }

        AppointmentId id = new AppointmentId();
        id.setEstheticianCpf(estheticianCpf);
        id.setClientCpf(clientCpf);
        id.setDateTime(java.time.OffsetDateTime.parse(dateTime));

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "appointment-not-found"));

        appointment.setClinicalNotes(dto.clinicalNotes());
        appointment.setValue(dto.value());
        appointment.setStatus(dto.status());

        List<Procedure> procedures = procedureRepository.findAllById(dto.proceduresName());
        appointment.setProcedures(procedures);

        appointmentRepository.save(appointment);
        return AppointmentMapper.fromEntityToDto(appointment);
    }

    @Transactional
    public void delete(String estheticianCpf, String clientCpf, String dateTime) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        if (!estheticianCpf.equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-delete-appointment-for-another-esthetician");
        }

        AppointmentId id = new AppointmentId();
        id.setEstheticianCpf(estheticianCpf);
        id.setClientCpf(clientCpf);
        id.setDateTime(java.time.OffsetDateTime.parse(dateTime));

        if (!appointmentRepository.existsById(id)) {
            throw new ResponseStatusException(NOT_FOUND, "appointment-not-found");
        }

        appointmentRepository.deleteById(id);
    }
}
