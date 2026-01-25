package com.pw.essask8.dto;

import lombok.*;          
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder           
@NoArgsConstructor 
@AllArgsConstructor 
public class ProductDetailsDto {

    private Integer id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer instock;

    private List<String> photoNames;

    private String size;

    private String material;

    private String tracks;

    private String concave;

    private String wheels;
    
    private String bearings;
    
    private Integer manufacturersId; 
}