package com.project.service;

import com.project.dto.ProcedureDTO;
import com.project.dto.ProductReferenceDTO;
import com.project.mappers.ProcedureMapper;
import com.project.models.Procedure;
import com.project.models.Product;
import com.project.repositories.EstheticianRepository;
import com.project.repositories.ProcedureRepository;
import com.project.repositories.ProductRepository;
import com.project.security.AuthService;
import com.project.specification.ProcedureSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class ProcedureService {
    private final ProcedureRepository procedureRepository;
    private final AuthService authService;
    private final EstheticianRepository estheticianRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProcedureDTO> listAll() {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Specification<Procedure> spec = ProcedureSpecification.byEsthetician(loggedInEstheticianCpf);

        return procedureRepository.findAll(spec).stream()
                .map(ProcedureMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProcedureDTO> filterProcedures(String name) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Specification<Procedure> spec = ProcedureSpecification.byEsthetician(loggedInEstheticianCpf);

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
                .filter(a -> a.getEsthetician().getCpf().equals(authService.getLoggedInEstheticianCpf()))
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "procedure-not-found"));
        return ProcedureMapper.fromEntityToDto(procedure);
    }

    @Transactional
    public ProcedureDTO create(ProcedureDTO createDTO) {
        if (procedureRepository.existsById(createDTO.name())) {
            throw new ResponseStatusException(BAD_REQUEST, "procedure-already-registered");
        }

        List<Product> products = createDTO.products() != null
                ? productRepository.findAllById(createDTO.products().stream().map(ProductReferenceDTO::id).toList())
                : List.of();
        if (createDTO.products() != null && (products.size() != createDTO.products().size())) {
            throw new ResponseStatusException(BAD_REQUEST, "one-or-more-products-not-found");
        }

        Procedure entity = ProcedureMapper.fromDtoToEntity(createDTO, products);
        entity.setEsthetician(estheticianRepository.getReferenceById(authService.getLoggedInEstheticianCpf()));
        Procedure savedEntity = procedureRepository.save(entity);
        return ProcedureMapper.fromEntityToDto(savedEntity);
    }

    @Transactional
    public ProcedureDTO update(String name, ProcedureDTO updateDTO) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Procedure entity = procedureRepository.findById(name)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "procedure-not-found"));

        if (!entity.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-update-procedure-for-another-esthetician");
        }

        entity.setDescription(updateDTO.description());
        entity.setEstimatedDuration(updateDTO.estimatedDuration());
        entity.setCost(updateDTO.cost());

        Procedure updatedEntity = procedureRepository.save(entity);
        return ProcedureMapper.fromEntityToDto(updatedEntity);
    }

    @Transactional
    public void delete(String name) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Procedure procedure = procedureRepository.findById(name)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "procedure-not-found"));

        if (!procedure.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-delete-procedure-for-another-esthetician");
        }

        procedureRepository.deleteById(name);
    }
}
