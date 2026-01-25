package com.pw.essask8.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserProfileDto {
    
    private String username;

    private String password;

    private String emailAddress;

    private String name;

    private String lastName;

    private String secondName;

    private String phoneNumber;

    private AddressDto address;
}