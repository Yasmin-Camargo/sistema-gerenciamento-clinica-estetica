package com.project.service;

import com.project.dto.ClientDTO;
import com.project.mappers.ClientMapper;
import com.project.models.Client;
import com.project.repositories.ClientRepository;
import com.project.repositories.EstheticianRepository;
import com.project.security.AuthService;
import com.project.specification.ClientSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final AuthService authService;
    private final EstheticianRepository estheticianRepository;

    @Transactional(readOnly = true)
    public List<ClientDTO> listAll() {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Specification<Client> spec = ClientSpecification.byEsthetician(loggedInEstheticianCpf);

        return clientRepository.findAll(spec).stream()
                .map(ClientMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ClientDTO> filterClients(String cpf, String name, OffsetDateTime startDate, OffsetDateTime endDate, Boolean isActive) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();

        Specification<Client> spec = Specification
                .where(ClientSpecification.byEsthetician(loggedInEstheticianCpf))
                .and(ClientSpecification.cpfContains(cpf))
                .and(ClientSpecification.nameContains(name))
                .and(ClientSpecification.lastConsultationOn(startDate))
                .and(ClientSpecification.lastConsultationOn(endDate))
                .and(ClientSpecification.isActive(isActive));

        return clientRepository.findAll(spec).stream()
                .map(ClientMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientDTO findByCpf(String cpf) {
        Client client = clientRepository.findById(cpf)
                .filter(a -> a.getEsthetician().getCpf().equals(authService.getLoggedInEstheticianCpf()))
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));
        return ClientMapper.fromEntityToDto(client);
    }

    @Transactional
    public ClientDTO create(ClientDTO createDTO) {
        if (clientRepository.existsById(createDTO.cpf())) {
            throw new ResponseStatusException(BAD_REQUEST, "cpf-already-registered");
        }

        Client entity = ClientMapper.fromDtoToEntity(createDTO);
        entity.setEsthetician(estheticianRepository.getReferenceById(authService.getLoggedInEstheticianCpf()));
        Client savedEntity = clientRepository.save(entity);
        return ClientMapper.fromEntityToDto(savedEntity);
    }

    @Transactional
    public ClientDTO update(String cpf, ClientDTO updateDTO) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Client entity = clientRepository.findById(cpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));

        if (!entity.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-update-client-for-another-esthetician");
        }

        entity.setName(updateDTO.name());
        entity.setPhone(updateDTO.phone());
        entity.setAddress(updateDTO.address());
        entity.setActive(updateDTO.isActive());
        entity.setLastConsultationDate(updateDTO.lastConsultationDate());

        Client updatedEntity = clientRepository.save(entity);
        return ClientMapper.fromEntityToDto(updatedEntity);
    }

    @Transactional
    public void delete(String cpf) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Client client = clientRepository.findById(cpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));

        if (!client.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "cannot-delete-client-for-another-esthetician");
        }

        clientRepository.deleteById(cpf);
    }
}
