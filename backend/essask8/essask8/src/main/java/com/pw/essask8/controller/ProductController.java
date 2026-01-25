package com.pw.essask8.controller;

import com.pw.essask8.domain.Product;
import com.pw.essask8.dto.ProductDetailsDto;
import com.pw.essask8.dto.ProductSummaryDto;
import com.pw.essask8.dto.CreateProductDto;
import com.pw.essask8.service.PhotoService; 
import com.pw.essask8.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products") 
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final PhotoService photoService; 

    // GET http://localhost:8080/api/products?sortBy=price_desc
    @GetMapping
    public ResponseEntity<List<ProductSummaryDto>> getAllProducts(@RequestParam(required = false) String sortBy) {
        return ResponseEntity.ok(productService.getAllProductsSummary(sortBy));
    }

    // GET http://localhost:8080/api/products/1
    @GetMapping("/{id}")    
    public ResponseEntity<ProductDetailsDto> getProductById(@PathVariable Integer id) {
        ProductDetailsDto product = productService.getProductDetails(id);
        return ResponseEntity.ok(product);
    }
    
    // GET http://localhost:8080/api/products/search?phrase=santa
    @GetMapping("/search")
    public ResponseEntity<List<ProductSummaryDto>> searchProducts(@RequestParam String phrase) {
        return ResponseEntity.ok(productService.searchProducts(phrase));
    }

    // POST http://localhost:8080/api/products/1/photo
    @PostMapping("/{id}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable Integer id, 
                                              @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Plik nie może być pusty");
        }
        
        photoService.uploadPhoto(id, file);
        return ResponseEntity.ok("Zdjęcie dodane pomyślnie");
    }
}