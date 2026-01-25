package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailDto {

    private String productName;

    private int quantity;

    private BigDecimal fixedPrice;
    
    private BigDecimal lineTotal;
}