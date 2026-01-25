package com.pw.essask8.dto;

import lombok.*;
import com.pw.essask8.dto.AddressDto;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    
    private String username;

    private String emailAddress;

    private String name;

    private String lastName;

    private String phoneNumber;

    private String secondName;

    private boolean staff;

    private AddressDto address;
}