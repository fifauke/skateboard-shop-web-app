package com.pw.essask8.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "photos_id_seq")
    @SequenceGenerator(name = "photos_id_seq", sequenceName = "photos_id_seq", allocationSize = 1)
    private Integer id;

    @Column(name = "path", nullable = false, length = 100)
    private String path;

    @ManyToOne
    @JoinColumn(name = "products_id", nullable = false)
    private Product product;
}