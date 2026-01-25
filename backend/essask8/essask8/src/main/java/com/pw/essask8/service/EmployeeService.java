package com.pw.essask8.service;

import com.pw.essask8.domain.Order;
import com.pw.essask8.domain.Product;
import com.pw.essask8.dto.EmployeeDashboardDto;
import com.pw.essask8.dto.OrderSummaryDto;
import com.pw.essask8.dto.ProductSummaryDto;
import com.pw.essask8.repository.OrderRepository;
import com.pw.essask8.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public EmployeeDashboardDto getDashboardData() {
        List<Product> products = productRepository.findTop2ByOrderByIdDesc();
        
        List<ProductSummaryDto> productDtos = products.stream()
            .map(p -> ProductSummaryDto.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .brandName(p.getManufacturer() != null ? p.getManufacturer().getName() : "Brak")
                .photoPath((p.getPhotos() != null && !p.getPhotos().isEmpty()) 
                    ? p.getPhotos().get(0).getPath() 
                    : null)
                .build())
            .toList();

        List<Order> orders = orderRepository.findTop2ByOrderByOrderDateDesc();
        
        List<OrderSummaryDto> orderDtos = orders.stream()
            .map(o -> OrderSummaryDto.builder()
                .id(o.getId())
                .orderNumber("Z-" + o.getId() + o.getOrderDate().toString().replace("-", "")) 
                .price(o.getTotalAmount()) 
                .date(o.getOrderDate())
                .customerEmail(o.getUser().getEmailAddress())
                .build())
            .toList();

        return EmployeeDashboardDto.builder()
            .recentProducts(productDtos) 
            .recentOrders(orderDtos)    
            .build();
    }

    
}