package com.pw.essask8.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="stores")
public class Store {

    @Id
    @Column
    private Integer id;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(name="email_address", nullable = false, length = 30)
    private String emailAddress;

    @Column(name="phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "addresses_id", nullable = false, unique = true)
    private Address address;

    @OneToMany(mappedBy = "store")
    private List<Employee> employees;

    @OneToMany(mappedBy = "store")
    private List<Product> products;
}
