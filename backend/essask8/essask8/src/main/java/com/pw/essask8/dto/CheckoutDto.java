package com.pw.essask8.dto;

import lombok.*;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutDto {

    private String deliveryMethod;
    
    private String paymentMethod;
}