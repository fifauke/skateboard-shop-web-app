package com.pw.essask8.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employees_id_seq")
    @SequenceGenerator(name = "employees_id_seq", sequenceName = "employees_id_seq", allocationSize = 1)
    private Integer id;

    @Column(nullable = false, length = 1)
    private String gender;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(length = 11)
    private String pesel;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "bank_account_number", length = 26)
    private String bankAccountNumber;

    @ManyToOne
    @JoinColumn(name = "stores_id", nullable = false)
    private Store store;

    @OneToOne
    @JoinColumn(name = "users_id", nullable = false, unique = true)
    private User user;
}
