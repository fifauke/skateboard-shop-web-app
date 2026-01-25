package com.pw.essask8.dto;

import lombok.*;
import jakarta.validation.constraints.*;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {
    
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

    @NotBlank(message = "Country is necessary")
    private String country;

    @NotBlank(message = "City is necessary")
    private String city;

    @NotBlank(message = "Street is necessary")
    private String street;

    @NotBlank(message = "Building number is necessary")
    private String buildingNumber;

    private String apartmentNumber;

    @NotBlank(message = "Country is necessary")
    private String postalCode;
}