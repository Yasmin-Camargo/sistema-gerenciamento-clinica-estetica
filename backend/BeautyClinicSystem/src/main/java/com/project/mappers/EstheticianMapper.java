package com.project.mappers;

import com.project.dto.EstheticianDTO;
import com.project.models.Esthetician;

public class EstheticianMapper {
    public static EstheticianDTO fromEntityToDto(Esthetician esthetician) {
        return new EstheticianDTO(
                esthetician.getCpf(),
                esthetician.getName(),
                esthetician.getPhone(),
                esthetician.getBirthDate(),
                esthetician.getEmail(),
                esthetician.getAddress(),
                esthetician.getProfessionalRegistrationNumber(),
                esthetician.getSpecializations(),
                esthetician.getPassword()
        );
    }

    public static Esthetician fromDtoToEntity(EstheticianDTO dto) {
        Esthetician esthetician = new Esthetician();
        esthetician.setCpf(dto.cpf());
        esthetician.setName(dto.name());
        esthetician.setPhone(dto.phone());
        esthetician.setBirthDate(dto.birthDate());
        esthetician.setEmail(dto.email());
        esthetician.setAddress(dto.address());
        esthetician.setProfessionalRegistrationNumber(dto.professionalRegistrationNumber());
        esthetician.setSpecializations(dto.specializations());
        esthetician.setPassword(dto.password());
        return esthetician;
    }
}
