package com.pw.essask8.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeRegisterDto {
    
    @NotBlank(message = "Login is necessary")
    private String username;

    @NotBlank(message = "Password is necessary")
    @Size(min = 6, message = "Min. 6 characters")
    private String password;

    @NotBlank(message = "Email is necessary")
    @Email(message = "Wrong email format")
    private String email;

    @NotBlank(message = "Phone number is necessary")
    @Size(min = 9, max = 9, message = "Phone number must have 9 digits")
    private String phoneNumber;

    @NotBlank(message = "Name is necessary")
    private String name;

    @NotBlank(message = "Last name is necessary")
    private String lastName;

    private String secondName;

    @NotBlank(message = "Gender is necessary")
    @Pattern(regexp = "[kKmM]", message = "Gender is either 'K' or 'M'")
    private String gender;

    @NotNull(message = "Birth date is necessary")
    @Past(message = "Invalid birth date")
    private LocalDate birthDate;

    @Size(min = 11, max = 11, message = "PESEL must have 11 digits")
    private String pesel;

    @NotNull(message = "Hire date is necessary")
    private LocalDate hireDate;

    @Size(min = 26, max = 26, message = "Bank account number must have 26 digits")
    private String bankAccountNumber;

    @NotBlank(message = "Country is necessary")
    private String country;

    @NotBlank(message = "City is necessary")
    private String city;

    @NotBlank(message = "Street is necessary")
    private String street;

    @NotBlank(message = "Building number is necessary")
    private String buildingNumber;

    private String apartmentNumber;

    @NotBlank(message = "Postal code is necessary")
    private String postalCode;

    @NotNull(message = "Store not found") 
    private Integer storeId;
}