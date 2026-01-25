package com.pw.essask8.repository;

import com.pw.essask8.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByNameContainingIgnoreCase(String phrase);
    List<Product> findTop2ByOrderByIdDesc();
}