package com.project.mappers;

import com.project.dto.AppointmentDTO;
import com.project.dto.ReferenceDTO;
import com.project.models.*;

import java.util.List;
import java.util.stream.Collectors;

public class AppointmentMapper {
    public static AppointmentDTO fromEntityToDto(Appointment appointment) {
        return new AppointmentDTO(
                new ReferenceDTO(appointment.getEsthetician().getCpf(), appointment.getEsthetician().getName()),
                new ReferenceDTO(appointment.getClient().getCpf(), appointment.getClient().getName()),
                appointment.getId().getDateTime(),
                appointment.getClinicalNotes(),
                appointment.getValue(),
                appointment.getStatus(),
                appointment.getProcedures().stream().map(Procedure::getName).collect(Collectors.toList())
        );
    }

    public static Appointment fromDtoToEntity(AppointmentDTO dto, Client client, Esthetician esthetician, List<Procedure> procedures) {
        Appointment appointment = new Appointment();
        AppointmentId id = new AppointmentId();
        id.setClientCpf(dto.client().cpf());
        id.setEstheticianCpf(dto.esthetician().cpf());
        id.setDateTime(dto.dateTime());

        appointment.setId(id);
        appointment.setClient(client);
        appointment.setEsthetician(esthetician);
        appointment.setClinicalNotes(dto.clinicalNotes());
        appointment.setValue(dto.value());
        appointment.setStatus(dto.status());
        appointment.setProcedures(procedures);

        return appointment;
    }
}
