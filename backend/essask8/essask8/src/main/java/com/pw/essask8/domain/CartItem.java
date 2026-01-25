package com.pw.essask8.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer quantity;

    @ManyToOne 
    @JoinColumn(name = "carts_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "products_id")
    private Product product;
}