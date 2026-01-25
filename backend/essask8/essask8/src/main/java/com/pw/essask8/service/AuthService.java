package com.pw.essask8.service;

import com.pw.essask8.domain.Address;
import com.pw.essask8.domain.User;
import com.pw.essask8.domain.Employee;
import com.pw.essask8.domain.Store;
import com.pw.essask8.dto.LoginDto;
import com.pw.essask8.dto.RegisterDto;
import com.pw.essask8.dto.EmployeeRegisterDto;
import com.pw.essask8.repository.AddressRepository;
import com.pw.essask8.repository.EmployeeRepository;
import com.pw.essask8.repository.StoreRepository;
import com.pw.essask8.repository.UserRepository;
import com.pw.essask8.exception.BusinessValidationException;
import com.pw.essask8.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final StoreRepository storeRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(RegisterDto dto) {
        Map<String, String> validationErrors = new HashMap<>();

        if (userRepository.existsByUsername(dto.getUsername())) {
             validationErrors.put("username", "Username taken");
        }

        if (userRepository.existsByEmailAddress(dto.getEmail())) {
            validationErrors.put("email", "Email address taken");
        }

        if (!validationErrors.isEmpty()) {
            throw new BusinessValidationException(validationErrors);
        }

        Address address = new Address();
        address.setCountry(dto.getCountry());
        address.setCity(dto.getCity());
        address.setStreet(dto.getStreet());
        address.setBuildingNumber(dto.getBuildingNumber());
        address.setApartmentNumber(dto.getApartmentNumber());
        address.setPostalCode(dto.getPostalCode());
        Address savedAddress = addressRepository.save(address);

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmailAddress(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setSecondName(dto.getSecondName());
        user.setCreationDate(LocalDate.now());
        user.setStaff(false);
        user.setAddress(savedAddress);

        userRepository.save(user);
    }

    @Transactional
    public void registerEmployee(EmployeeRegisterDto dto) {
        Map<String, String> validationErrors = new HashMap<>();

        Store store = storeRepository.findById(dto.getStoreId()).orElse(null);
        if (store == null) {
            validationErrors.put("storeId", "Store not found");
        }

        if (dto.getBirthDate().plusYears(18).isAfter(LocalDate.now())) {
            validationErrors.put("birthDate", "Invalid birth date");
        }

        if (dto.getBirthDate().isAfter(dto.getHireDate())) {
            validationErrors.put("hireDate", "Invalid dates");
        }

        if (userRepository.existsByUsername(dto.getUsername())) {
             validationErrors.put("username", "Username taken");
        }

        if (userRepository.existsByEmailAddress(dto.getEmail())) {
            validationErrors.put("email", "Email address taken");
        }

        if (!validationErrors.isEmpty()) {
            throw new BusinessValidationException(validationErrors);
        }

        Address address = new Address();
        address.setCountry(dto.getCountry());
        address.setCity(dto.getCity());
        address.setStreet(dto.getStreet());
        address.setBuildingNumber(dto.getBuildingNumber());
        address.setApartmentNumber(dto.getApartmentNumber());
        address.setPostalCode(dto.getPostalCode());
        Address savedAddress = addressRepository.save(address);

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmailAddress(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setName(dto.getName());
        user.setLastName(dto.getLastName());
        user.setSecondName(dto.getSecondName());
        user.setCreationDate(LocalDate.now());
        user.setStaff(true);
        user.setAddress(savedAddress);

        userRepository.save(user);

        Employee employee = new Employee();
        employee.setGender(dto.getGender());
        employee.setBirthDate(dto.getBirthDate());
        employee.setPesel(dto.getPesel());
        employee.setHireDate(dto.getHireDate());
        employee.setBankAccountNumber(dto.getBankAccountNumber());
        employee.setStore(store);
        employee.setUser(user);

        employeeRepository.save(employee);
    }

    public String login(LoginDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles(user.getStaff() ? "ADMIN" : "USER")
                .build();

        return jwtService.generateToken(userDetails);
    }
}