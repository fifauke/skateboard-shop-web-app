package com.pw.essask8.controller;

import com.pw.essask8.dto.EmployeeDashboardDto;
import com.pw.essask8.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // GET http://localhost:8080/api/employee/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<EmployeeDashboardDto> getDashboard() {
        return ResponseEntity.ok(employeeService.getDashboardData());
    }
}