package com.pw.essask8.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductDto {

    @NotBlank(message = "Name is necessary")
    private String name;

    private String description;

    @NotNull
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private String size;

    private String material;

    private String tracks;

    private String concave;

    private String wheels;

    private String bearings;

    @Min(0)
    private Integer instock;

    @NotNull(message = "Manufacturer not found")
    private Integer manufacturersId; 

    @NotNull(message = "Store not found") 
    private Integer storeId;
    
    private List<String> photoPaths; 
}