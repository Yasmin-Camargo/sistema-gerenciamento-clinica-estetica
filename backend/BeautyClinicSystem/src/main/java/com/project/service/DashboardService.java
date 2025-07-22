package com.project.service;

import com.project.dto.AppointmentDTO;
import com.project.dto.ClinicOverviewDTO;
import com.project.dto.HomePageDTO;
import com.project.dto.PopularProceduresDTO;
import com.project.mappers.AppointmentMapper;
import com.project.models.AppointmentStatus;
import com.project.repositories.AppointmentRepository;
import com.project.repositories.ClientRepository;
import com.project.repositories.EstheticianRepository;
import com.project.repositories.ProcedureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ClientRepository clientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ProcedureRepository procedureRepository;

    public ClinicOverviewDTO getSummary() {
        int totalClients = (int) clientRepository.count();
        int totalAppointments = (int) appointmentRepository.count();
        int totalProcedures = (int) procedureRepository.count();

        return new ClinicOverviewDTO(totalClients, totalAppointments, totalProcedures);
    }

    public HomePageDTO getHomePageData() {
        OffsetDateTime now = OffsetDateTime.now();

        List<AppointmentDTO> nextAppointments = appointmentRepository.findNextAppointments(now).stream()
                .map(AppointmentMapper::fromEntityToDto)
                .toList();

        List<PopularProceduresDTO> popularProcedures = procedureRepository.findTopProcedures().stream()
                .limit(3)
                .toList();

        Double totalRevenue = Optional.ofNullable(appointmentRepository.getTotalRevenueFromCompletedAppointments(AppointmentStatus.COMPLETED))
                .orElse(0.0);

        return new HomePageDTO(nextAppointments, popularProcedures, totalRevenue);
    }
}
