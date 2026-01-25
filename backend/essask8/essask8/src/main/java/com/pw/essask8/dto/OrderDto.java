package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class OrderDto {

    private Integer orderId;

    private LocalDate orderDate;

    private String status;

    private String deliveryMethod;

    private String paymentMethod;

    private BigDecimal shippingCost;

    private BigDecimal totalAmount;
    
    private List<OrderDetailDto> items;
}