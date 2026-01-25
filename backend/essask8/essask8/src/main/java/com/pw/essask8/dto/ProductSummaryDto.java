package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class ProductSummaryDto {
    
    private Integer id;

    private String name;

    private BigDecimal price;

    private String brandName;
    
    private String photoPath;
}