package com.pw.essask8.controller;

import com.pw.essask8.dto.AddToCartDto;
import com.pw.essask8.dto.CheckoutDto;
import com.pw.essask8.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.pw.essask8.dto.CartDto;
@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // URL: POST http://localhost:8080/api/cart/add
    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody AddToCartDto request, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).body("Użytkownik nie jest zalogowany");
        }

        String username = authentication.getName();
        
        cartService.addToCart(request, username);
        
        return ResponseEntity.ok("Produkt dodany do koszyka!");
    }

    // POST http://localhost:8080/api/cart/checkout
    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestBody CheckoutDto request, Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).body("Brak autoryzacji");
        }

        String username = authentication.getName();

        try {
            cartService.checkout(username, request);
            
            return ResponseEntity.ok("Zamówienie przyjęte!");

        } catch (Exception e) {
            e.printStackTrace();
            
            throw e; 
        }
    }

    // GET http://localhost:8080/api/cart
    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        String username = authentication.getName();
        CartDto cartDto = cartService.getCart(username);
        
        return ResponseEntity.ok(cartDto);
    }

    // URL: DELETE http://localhost:8080/api/cart/remove/1
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<String> removeFromCart(@PathVariable Integer productId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        String username = authentication.getName();
        
        cartService.removeFromCart(username, productId);
        
        return ResponseEntity.ok("Produkt usunięty z koszyka");
    }

    // URL: PUT http://localhost:8080/api/cart/update/{productId}?quantity=5
    @PutMapping("/update/{productId}")
    public ResponseEntity<String> updateItemQuantity(
            @PathVariable Integer productId, 
            @RequestParam int quantity, 
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        String username = authentication.getName();
        cartService.updateItemQuantity(username, productId, quantity);
        
        return ResponseEntity.ok("Ilość zaktualizowana");
    }
}