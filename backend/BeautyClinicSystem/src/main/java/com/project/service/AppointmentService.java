package com.project.service;

import com.project.dto.AppointmentDTO;
import com.project.mappers.AppointmentMapper;
import com.project.models.Appointment;
import com.project.models.Client;
import com.project.models.Esthetician;
import com.project.models.Procedure;
import com.project.models.AppointmentId;
import com.project.repositories.AppointmentRepository;
import com.project.repositories.ClientRepository;
import com.project.repositories.EstheticianRepository;
import com.project.repositories.ProcedureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ClientRepository clientRepository;
    private final EstheticianRepository estheticianRepository;
    private final ProcedureRepository procedureRepository;

    @Transactional(readOnly = true)
    public List<AppointmentDTO> listAll() {
        return appointmentRepository.findAll().stream()
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
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "appointment-not-found"));

        return AppointmentMapper.fromEntityToDto(appointment);
    }

    @Transactional
    public AppointmentDTO create(AppointmentDTO dto) {
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

        List<Procedure> procedures = procedureRepository.findAllById(dto.proceduresName());

        Appointment appointment = AppointmentMapper.fromDtoToEntity(dto, client, esthetician, procedures);
        appointmentRepository.save(appointment);

        return AppointmentMapper.fromEntityToDto(appointment);
    }

    @Transactional
    public AppointmentDTO update(String estheticianCpf, String clientCpf, String dateTime, AppointmentDTO dto) {
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
