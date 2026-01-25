package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class CartDto {

    private Integer cartId;

    private List<CartItemDto> items;
    
    private BigDecimal totalCartPrice;
}