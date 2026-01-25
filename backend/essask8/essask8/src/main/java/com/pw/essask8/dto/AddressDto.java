package com.pw.essask8.dto;

import lombok.*;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class AddressDto {

    private String country;

    private String city;

    private String street;

    private String buildingNumber;

    private String apartmentNumber;
    
    private String postalCode;
}