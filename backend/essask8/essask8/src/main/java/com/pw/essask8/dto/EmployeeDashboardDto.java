package com.pw.essask8.dto;

import lombok.*;
import java.util.List;

@Data
@Builder  
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDashboardDto {

    private List<ProductSummaryDto> recentProducts;
    
    private List<OrderSummaryDto> recentOrders;  
}