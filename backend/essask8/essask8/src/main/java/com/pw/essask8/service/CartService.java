package com.pw.essask8.service;

import com.pw.essask8.domain.*;
import com.pw.essask8.dto.AddToCartDto;
import com.pw.essask8.dto.CartDto;
import com.pw.essask8.dto.CartItemDto;
import com.pw.essask8.dto.CheckoutDto;
import com.pw.essask8.repository.CartRepository;
import com.pw.essask8.repository.OrderRepository;
import com.pw.essask8.repository.ProductRepository;
import com.pw.essask8.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public void addToCart(AddToCartDto request, String username) {
        Cart cart = cartRepository.findByUserUsername(username)
                .orElseGet(() -> createCartForUser(username));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Produkt nie istnieje"));

        if (product.getInstock() < request.getQuantity()) {
            throw new RuntimeException("Za mało towaru w magazynie!");
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart);
    }

    @Transactional(readOnly = true)
    public CartDto getCart(String username) {
        Cart cart = cartRepository.findByUserUsername(username)
                .orElseGet(() -> createCartForUser(username));

        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(item -> {
                    BigDecimal totalLinePrice = item.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));

                    String photo = null;
                    if (item.getProduct().getPhotos() != null && !item.getProduct().getPhotos().isEmpty()) {
                        photo = item.getProduct().getPhotos().get(0).getPath(); 
                    }

                    String manufName = "";
                    if (item.getProduct().getManufacturer() != null) {
                        manufName = item.getProduct().getManufacturer().getName();
                    }

                    return CartItemDto.builder()
                            .productId(Long.valueOf(item.getProduct().getId()))
                            .productName(item.getProduct().getName())
                            .quantity(item.getQuantity())
                            .unitPrice(item.getProduct().getPrice())
                            .totalPrice(totalLinePrice)
                            .photoPath(photo)
                            .manufacturer(manufName)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal totalCartPrice = itemDtos.stream()
                .map(CartItemDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.builder()
                .cartId(cart.getId())
                .items(itemDtos)
                .totalCartPrice(totalCartPrice)
                .build();
    }

    private Cart createCartForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Transactional
    public void checkout(String username, CheckoutDto request) {
        Cart cart = cartRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Koszyk jest pusty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Koszyk jest pusty");
        }

        BigDecimal shippingCost = BigDecimal.ZERO;
        if ("COURIER".equalsIgnoreCase(request.getDeliveryMethod())) {
            shippingCost = new BigDecimal("15.00");
        } else if ("PARCEL_LOCKER".equalsIgnoreCase(request.getDeliveryMethod())) {
            shippingCost = new BigDecimal("12.00");
        }

        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus("NEW");
        order.setOrderDetails(new ArrayList<>());

        order.setDeliveryMethod(request.getDeliveryMethod());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingCost(shippingCost);

        BigDecimal productsTotal = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();

            if (product.getInstock() < item.getQuantity()) {
                throw new RuntimeException("Brak towaru: " + product.getName());
            }

            product.setInstock(product.getInstock() - item.getQuantity());
            productRepository.save(product);

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantity(item.getQuantity());
            detail.setFixedPrice(product.getPrice());

            order.getOrderDetails().add(detail);

            BigDecimal lineValue = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            productsTotal = productsTotal.add(lineValue);
        }

        order.setPrice(productsTotal);
        order.setTotalAmount(productsTotal.add(shippingCost));

        try {
            orderRepository.save(order);
        } catch (Exception e) {
            throw e;
        }

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Transactional
    public void updateItemQuantity(String username, Integer productId, int newQuantity) {
        Cart cart = cartRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Koszyk nie istnieje"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Produkt nie znajduje się w koszyku"));

        item.setQuantity(newQuantity);

        cartRepository.save(cart);
    }

    @Transactional
    public void removeFromCart(String username, Integer productId) {
        Cart cart = cartRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Koszyk nie istnieje"));

        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Nie znaleziono produktu w koszyku"));

        cart.getItems().remove(itemToRemove);

        itemToRemove.setCart(null);

        cartRepository.save(cart);
    }
}