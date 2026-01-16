package com.pw.essask8.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_details")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orders_details_id_seq")
    @SequenceGenerator(name = "orders_details_id_seq", sequenceName = "orders_details_id_seq", allocationSize = 1)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "orders_id", nullable = false)
    private Order ordersId;

    @ManyToOne
    @JoinColumn(name = "products_id", nullable = false)
    private Product productsId;

    @Column(nullable = false)
    private Integer quantity;
}