package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class OrderSummaryDto {

    private Integer id;

    private String orderNumber;

    private BigDecimal price;  
    
    private LocalDate date;

    private String customerEmail;
}