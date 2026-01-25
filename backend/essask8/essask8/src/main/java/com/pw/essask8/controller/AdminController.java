package com.pw.essask8.controller;

import com.pw.essask8.dto.LoginDto;
import com.pw.essask8.dto.OrderDto;
import com.pw.essask8.dto.RegisterDto;
import com.pw.essask8.dto.EmployeeRegisterDto;
import com.pw.essask8.service.AuthService;
import com.pw.essask8.service.OrderService;
import com.pw.essask8.service.UserService;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final OrderService orderService;
    private final UserService userService;

    @PostMapping("/register-employee")
    public ResponseEntity<?> registerEmployee(@Valid @RequestBody EmployeeRegisterDto dto) {
         try {
            authService.registerEmployee(dto);
            return ResponseEntity.ok("Pracownik dodany!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Integer id) {
    orderService.deleteOrder(id);
    return ResponseEntity.ok("Zamówienie zostało usunięte pomyślnie.");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
    userService.deleteUser(id);
    return ResponseEntity.ok("Użytkownik został usunięty.");
    }
}