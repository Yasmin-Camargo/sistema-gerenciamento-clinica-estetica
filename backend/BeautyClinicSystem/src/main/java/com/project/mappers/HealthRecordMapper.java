package com.project.mappers;

import com.project.dto.HealthRecordDTO;
import com.project.models.HealthRecord;

public class HealthRecordMapper {

    public static HealthRecordDTO fromEntityToDto(HealthRecord entity) {
        if (entity == null) {
            return null;
        }
        return new HealthRecordDTO(
                entity.getClientCpf(),
                entity.getAllergies(),
                entity.getMedications(),
                entity.getBloodType(),
                entity.getChronicDiseases(),
                entity.getSkinType(),
                entity.getObservations(),
                entity.getHeight(),
                entity.getWeight(),
                entity.getImc(),
                entity.getPreviousProcedures(),
                entity.getPhototype(),
                entity.getLastUpdated()
        );
    }

    public static void updateEntityFromDto(HealthRecord entity, HealthRecordDTO dto) {
        entity.setAllergies(dto.allergies());
        entity.setMedications(dto.medications());
        entity.setBloodType(dto.bloodType());
        entity.setChronicDiseases(dto.chronicDiseases());
        entity.setSkinType(dto.skinType());
        entity.setObservations(dto.observations());
        entity.setHeight(dto.height());
        entity.setWeight(dto.weight());
        entity.setPreviousProcedures(dto.previousProcedures());
        entity.setPhototype(dto.phototype());
    }
}
