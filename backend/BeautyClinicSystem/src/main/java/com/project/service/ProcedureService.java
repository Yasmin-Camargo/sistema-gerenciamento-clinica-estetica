package com.project.service;

import com.project.dto.ProcedureDTO;
import com.project.mappers.ProcedureMapper;
import com.project.models.Procedure;
import com.project.repositories.ProcedureRepository;
import com.project.specification.ProcedureSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ProcedureService {

    private final ProcedureRepository procedureRepository;

    @Transactional(readOnly = true)
    public List<ProcedureDTO> listAll() {
        return procedureRepository.findAll().stream()
                .map(ProcedureMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProcedureDTO> filterProcedures(String name) {
        Specification<Procedure> spec = Specification.where(null);

        if (name != null && !name.isBlank()) {
            spec = spec.and(ProcedureSpecification.nameContains(name));
        }

        return procedureRepository.findAll(spec)
                .stream()
                .map(ProcedureMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProcedureDTO findByName(String name) {
        Procedure procedure = procedureRepository.findById(name)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "procedure-not-found"));
        return ProcedureMapper.fromEntityToDto(procedure);
    }

    @Transactional
    public ProcedureDTO create(ProcedureDTO createDTO) {
        if (procedureRepository.existsById(createDTO.name())) {
            throw new ResponseStatusException(BAD_REQUEST, "procedure-already-registered");
        }

        Procedure entity = ProcedureMapper.fromDtoToEntity(createDTO);
        Procedure savedEntity = procedureRepository.save(entity);
        return ProcedureMapper.fromEntityToDto(savedEntity);
    }

    @Transactional
    public ProcedureDTO update(String name, ProcedureDTO updateDTO) {
        Procedure entity = procedureRepository.findById(name)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "procedure-not-found"));

        entity.setDescription(updateDTO.description());
        entity.setEstimatedDuration(updateDTO.estimatedDuration());
        entity.setCost(updateDTO.cost());

        Procedure updatedEntity = procedureRepository.save(entity);
        return ProcedureMapper.fromEntityToDto(updatedEntity);
    }

    @Transactional
    public void delete(String name) {
        if (!procedureRepository.existsById(name)) {
            throw new ResponseStatusException(NOT_FOUND, "procedure-not-found");
        }
        procedureRepository.deleteById(name);
    }
}
