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
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "addresses_id_seq")
    @SequenceGenerator(name = "addresses_id_seq", sequenceName = "addresses_id_seq", allocationSize = 1)
    @Column
    private Integer id;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(nullable = false, length = 30)
    private String city;

    @Column(nullable = false, length = 30)
    private String street;

    @Column(name = "building_number", nullable = false, length = 5)
    private String buildingNumber;

    @Column(name = "apartment_number", length = 4)
    private String apartmentNumber;

    @Column(name = "postal_code", nullable = false, length = 6)
    private String postalCode;
}
