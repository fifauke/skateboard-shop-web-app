package com.pw.essask8.service;

import com.pw.essask8.domain.Order;
import com.pw.essask8.dto.OrderDetailDto;
import com.pw.essask8.dto.OrderDto;
import com.pw.essask8.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(String username) {
        List<Order> orders = orderRepository.findByUserUsername(username); 
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        List<OrderDetailDto> itemDtos = order.getOrderDetails().stream()
                .map(detail -> OrderDetailDto.builder()
                        .productName(detail.getProduct().getName())
                        .quantity(detail.getQuantity())
                        .fixedPrice(detail.getFixedPrice())
                        .lineTotal(detail.getFixedPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .status(order.getOrderStatus())
                .deliveryMethod(order.getDeliveryMethod())
                .paymentMethod(order.getPaymentMethod())
                .shippingCost(order.getShippingCost())
                .totalAmount(order.getTotalAmount())
                .items(itemDtos)
                .build();
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

        @Transactional
        public void deleteOrder(Integer orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Zamówienie o podanym ID nie istnieje");
        }
        orderRepository.deleteById(orderId);
    }
}