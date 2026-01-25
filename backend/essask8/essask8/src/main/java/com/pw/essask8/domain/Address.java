package com.pw.essask8.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String country;
    private String city;
    private String street;
    
    @Column(name = "building_number")
    private String buildingNumber;
    
    @Column(name = "apartment_number")
    private String apartmentNumber;
    
    @Column(name = "postal_code")
    private String postalCode;
}