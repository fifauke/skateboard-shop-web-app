package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {

    private Long productId;

    private String productName;

    private int quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

    private String photoPath;
    
    private String manufacturer;
}