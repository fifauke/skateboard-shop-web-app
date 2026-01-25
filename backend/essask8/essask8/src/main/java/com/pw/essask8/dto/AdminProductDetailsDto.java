package com.pw.essask8.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class AdminProductDetailsDto {

    private Integer id;

    private String name;

    private String description;

    private BigDecimal price;

    private String size;

    private String material;

    private String tracks;

    private String concave;

    private String wheels;

    private String bearings;

    private Integer instock;

    private Integer manufacturersId;
     
    private List<String> photoPaths; 
}