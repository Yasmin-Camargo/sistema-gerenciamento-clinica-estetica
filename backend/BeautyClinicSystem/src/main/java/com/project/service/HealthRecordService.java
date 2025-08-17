package com.project.service;

import com.project.dto.HealthRecordDTO;
import com.project.mappers.HealthRecordMapper;
import com.project.models.Client;
import com.project.models.HealthRecord;
import com.project.repositories.ClientRepository;
import com.project.repositories.HealthRecordRepository;
import com.project.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final ClientRepository clientRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public HealthRecordDTO findByClientCpf(String clientCpf) {
        validateClientOwnership(clientCpf);
        return healthRecordRepository.findById(clientCpf)
                .map(HealthRecordMapper::fromEntityToDto)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "health-record-not-found"));
    }

    @Transactional
    public HealthRecordDTO createOrUpdate(String clientCpf, HealthRecordDTO dto) {
        Client client = validateClientOwnership(clientCpf);

        HealthRecord healthRecord = healthRecordRepository.findById(clientCpf)
                .orElse(new HealthRecord());

        healthRecord.setClient(client);
        HealthRecordMapper.updateEntityFromDto(healthRecord, dto);

        HealthRecord savedEntity = healthRecordRepository.save(healthRecord);
        return HealthRecordMapper.fromEntityToDto(savedEntity);
    }

    @Transactional
    public void delete(String clientCpf) {
        validateClientOwnership(clientCpf);
        if (!healthRecordRepository.existsById(clientCpf)) {
            throw new ResponseStatusException(NOT_FOUND, "health-record-not-found");
        }
        healthRecordRepository.deleteById(clientCpf);
    }

    private Client validateClientOwnership(String clientCpf) {
        String loggedInEstheticianCpf = authService.getLoggedInEstheticianCpf();
        Client client = clientRepository.findById(clientCpf)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "client-not-found"));

        if (!client.getEsthetician().getCpf().equals(loggedInEstheticianCpf)) {
            throw new ResponseStatusException(FORBIDDEN, "client-does-not-belong-to-esthetician");
        }
        return client;
    }
}
