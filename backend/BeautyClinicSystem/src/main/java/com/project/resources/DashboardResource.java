package com.project.resources;

import com.project.dto.ClinicOverviewDTO;
import com.project.dto.HomePageDTO;
import com.project.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardResource {
    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ClinicOverviewDTO getClinicOverview() {
        return dashboardService.getSummary();
    }

    @GetMapping("/home")
    public HomePageDTO getHomePageData() {
        return dashboardService.getHomePageData();
    }
}
