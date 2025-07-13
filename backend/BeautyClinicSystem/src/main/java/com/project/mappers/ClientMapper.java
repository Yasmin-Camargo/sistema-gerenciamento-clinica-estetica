package com.project.mappers;

import com.project.dto.ClientDTO;
import com.project.models.Client;

public class ClientMapper {
    public static ClientDTO fromEntityToDto(Client client) {
        return new ClientDTO(
                client.getCpf(),
                client.getName(),
                client.getPhone(),
                client.getBirthDate(),
                client.getEmail(),
                client.getAddress(),
                client.getRegistrationDate(),
                client.isActive(),
                client.getLastConsultationDate()
        );
    }

    public static Client fromDtoToEntity(ClientDTO dto) {
        Client client = new Client();
        client.setCpf(dto.cpf());
        client.setName(dto.name());
        client.setPhone(dto.phone());
        client.setBirthDate(dto.birthDate());
        client.setEmail(dto.email());
        client.setAddress(dto.address());
        client.setRegistrationDate(dto.registrationDate());
        client.setActive(dto.isActive());
        client.setLastConsultationDate(dto.lastConsultationDate());
        return client;
    }
}
