package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class AdminProductSummaryDto {

    private Integer id;

    private String name;

    private BigDecimal price;

    private int instock;

    private String brandName;
    
    private String photoPath;
}