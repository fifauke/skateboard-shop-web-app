package com.pw.essask8.dto;

import lombok.*;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class AddToCartDto {

    private Integer productId;
    
    private Integer quantity;
}