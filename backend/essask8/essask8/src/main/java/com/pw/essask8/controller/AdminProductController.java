package com.pw.essask8.controller;

import com.pw.essask8.domain.Product;
import com.pw.essask8.dto.AdminProductSummaryDto;
import com.pw.essask8.dto.ProductDetailsDto;
import com.pw.essask8.dto.CreateProductDto;
import com.pw.essask8.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products") 
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    // GET http://localhost:8080/api/admin/products
    @GetMapping
    public ResponseEntity<List<AdminProductSummaryDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllAdminProductSummary());
    }

    // DELETE http://localhost:8080/api/admin/products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    // PUT http://localhost:8080/api/admin/products/1
    @PutMapping("/{id}")
    public ResponseEntity<AdminProductSummaryDto> updateProduct(@PathVariable Integer id, @RequestBody ProductDetailsDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    // POST http://localhost:8080/api/admin/products
    @PostMapping()
    public ResponseEntity<AdminProductSummaryDto> addProduct(@RequestBody CreateProductDto product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }
}