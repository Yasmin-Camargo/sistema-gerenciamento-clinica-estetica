package com.project.service;

import com.project.dto.EstheticianDTO;
import com.project.mappers.EstheticianMapper;
import com.project.models.Esthetician;
import com.project.repositories.EstheticianRepository;
import com.project.repositories.AppointmentRepository;
import com.project.repositories.ProcedureRepository;
import com.project.repositories.ProductRepository;
import com.project.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class EstheticianService {

    private final EstheticianRepository estheticianRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentRepository appointmentRepository;
    private final ProcedureRepository procedureRepository;
    private final ProductRepository productRepository;
    private final ClientRepository clientRepository;


    @Transactional(readOnly = true)
    public List<EstheticianDTO> listAll() {
        return estheticianRepository.findAll().stream()
                .map(EstheticianMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public EstheticianDTO findByCpf(String cpf) {
        Esthetician esthetician = estheticianRepository.findById(cpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "esthetician-not-found"));
        return EstheticianMapper.fromEntityToDto(esthetician);
    }

    @Transactional(readOnly = true)
    public EstheticianDTO findByEmail(String email) {
        Esthetician esthetician = estheticianRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "esthetician-not-found"));
        return EstheticianMapper.fromEntityToDto(esthetician);
    }

    @Transactional
    public EstheticianDTO create(EstheticianDTO createDTO) {
        if (estheticianRepository.existsById(createDTO.cpf())) {
            throw new ResponseStatusException(BAD_REQUEST, "cpf-already-registered");
        }
        if (estheticianRepository.findByEmail(createDTO.email()).isPresent()) {
            throw new ResponseStatusException(BAD_REQUEST, "email-already-registered");
        }

        Esthetician entity = EstheticianMapper.fromDtoToEntity(createDTO);

        entity.setPassword(passwordEncoder.encode(createDTO.password()));

        Esthetician savedEntity = estheticianRepository.save(entity);
        return EstheticianMapper.fromEntityToDto(savedEntity);
    }

    @Transactional
    public EstheticianDTO update(String cpf, EstheticianDTO updateDTO) {
        Esthetician entity = estheticianRepository.findById(cpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "esthetician-not-found"));

        entity.setName(updateDTO.name());
        entity.setPhone(updateDTO.phone());
        entity.setAddress(updateDTO.address());

        Esthetician updatedEntity = estheticianRepository.save(entity);
        return EstheticianMapper.fromEntityToDto(updatedEntity);
    }

    @Transactional
    public void delete(String cpf) {
        if (!estheticianRepository.existsById(cpf)) {
            throw new ResponseStatusException(NOT_FOUND, "esthetician-not-found");
        }

        appointmentRepository.deleteAppointmentProceduresByEstheticianCpf(cpf);
        appointmentRepository.deleteByEstheticianCpf(cpf);
        procedureRepository.deleteProcedureProductsByEstheticianCpf(cpf);
        procedureRepository.deleteByEstheticianCpf(cpf);
        productRepository.deleteByEstheticianCpf(cpf);
        clientRepository.deleteAll(clientRepository.findByEstheticianCpf(cpf));
        estheticianRepository.deleteById(cpf);
    }
}
