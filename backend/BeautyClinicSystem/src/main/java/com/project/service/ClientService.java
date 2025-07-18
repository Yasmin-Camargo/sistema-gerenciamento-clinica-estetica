package com.project.service;

import com.project.dto.ClientDTO;
import com.project.mappers.ClientMapper;
import com.project.models.Client;
import com.project.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<ClientDTO> listAll() {
        return clientRepository.findAll().stream()
                .map(ClientMapper::fromEntityToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientDTO findByCpf(String cpf) {
        Client client = clientRepository.findById(cpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));
        return ClientMapper.fromEntityToDto(client);
    }

    @Transactional
    public ClientDTO create(ClientDTO createDTO) {
        if (clientRepository.existsById(createDTO.cpf())) {
            throw new ResponseStatusException(BAD_REQUEST, "cpf-already-registered");
        }

        Client entity = ClientMapper.fromDtoToEntity(createDTO);
        Client savedEntity = clientRepository.save(entity);
        return ClientMapper.fromEntityToDto(savedEntity);
    }

    @Transactional
    public ClientDTO update(String cpf, ClientDTO updateDTO) {
        Client entity = clientRepository.findById(cpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));

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
        if (!clientRepository.existsById(cpf)) {
            throw new ResponseStatusException(NOT_FOUND, "client-not-found");
        }
        clientRepository.deleteById(cpf);
    }
}
