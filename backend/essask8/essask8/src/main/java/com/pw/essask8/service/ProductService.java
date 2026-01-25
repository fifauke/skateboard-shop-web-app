package com.pw.essask8.service;

import com.pw.essask8.domain.Product;
import com.pw.essask8.domain.Store;
import com.pw.essask8.domain.Manufacturer;
import com.pw.essask8.domain.Photo;
import com.pw.essask8.dto.ProductSummaryDto;
import com.pw.essask8.dto.ProductDetailsDto;
import com.pw.essask8.dto.CreateProductDto;
import com.pw.essask8.dto.AdminProductSummaryDto;
import com.pw.essask8.exception.ResourceNotFoundException;
import com.pw.essask8.repository.ProductRepository;
import com.pw.essask8.repository.StoreRepository;
import com.pw.essask8.repository.ManufacturerRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final ManufacturerRepository manufacturerRepository;

    public List<Product> getAllProducts(String sortMode) {
        Sort sort = Sort.unsorted();
        if (sortMode != null) {
            switch (sortMode) {
                case "price_asc" -> sort = Sort.by("price").ascending();
                case "price_desc" -> sort = Sort.by("price").descending();
                case "name_asc" -> sort = Sort.by("name").ascending();
                case "name_desc" -> sort = Sort.by("name").descending();
            }
        }
        return productRepository.findAll(sort);
    }

    public List<ProductSummaryDto> getAllProductsSummary(String sortMode) {
        List<Product> products = getAllProducts(sortMode);
        return products.stream()
            .map(product -> ProductSummaryDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .brandName(product.getManufacturer() != null ? product.getManufacturer().getName() : "Unknown")
                .photoPath((product.getPhotos() != null && !product.getPhotos().isEmpty())
                    ? product.getPhotos().get(0).getPath()
                    : null)
                .build())
            .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailsDto getProductDetails(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produkt nie istnieje"));

        List<String> fileNames = (product.getPhotos() != null) 
            ? product.getPhotos().stream().map(Photo::getPath).toList()
            : List.of();

        return ProductDetailsDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .instock(product.getInstock())
                .photoNames(fileNames)
                .size(product.getSize())
                .material(product.getMaterial())
                .tracks(product.getTracks())
                .concave(product.getConcave())
                .wheels(product.getWheels())
                .bearings(product.getBearings())
                .build();
    }

    public List<ProductSummaryDto> searchProducts(String phrase) {
        return productRepository.findByNameContainingIgnoreCase(phrase).stream()
            .map(product -> ProductSummaryDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .brandName(product.getManufacturer() != null ? product.getManufacturer().getName() : "Unknown")
                .photoPath((product.getPhotos() != null && !product.getPhotos().isEmpty())
                    ? product.getPhotos().get(0).getPath()
                    : null)
                .build())
            .toList();
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono produktu o ID: " + id));
    }

    @Transactional
    public Product updateProduct(Integer id, Product details) {
        Product product = getProductById(id);
        product.setName(details.getName());
        product.setDescription(details.getDescription());
        product.setPrice(details.getPrice());
        product.setInstock(details.getInstock());
        product.setSize(details.getSize());
        product.setMaterial(details.getMaterial());
        product.setTracks(details.getTracks());
        product.setConcave(details.getConcave());
        product.setWheels(details.getWheels());
        product.setBearings(details.getBearings());
        product.setManufacturer(details.getManufacturer());
        product.setStore(details.getStore());
        product.setPhotos(details.getPhotos());
        return productRepository.save(product);
    }

    public List<AdminProductSummaryDto> getAllAdminProductSummary() {
        return productRepository.findAll().stream()
            .map(product -> AdminProductSummaryDto.builder() 
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .instock(product.getInstock())
                .brandName(product.getManufacturer() != null ? product.getManufacturer().getName() : "Brak")
                .photoPath((product.getPhotos() != null && !product.getPhotos().isEmpty())
                    ? product.getPhotos().get(0).getPath()
                    : null)
                .build())
            .toList();
    }

    @Transactional
    public AdminProductSummaryDto saveProduct(CreateProductDto request) {
        Store store = storeRepository.findById(request.getStoreId())
            .orElseThrow(() -> new RuntimeException("Sklep nie istnieje"));
        
        Manufacturer manufacturer = manufacturerRepository.findById(request.getManufacturersId())
            .orElseThrow(() -> new RuntimeException("Producent nie istnieje"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setSize(request.getSize());
        product.setMaterial(request.getMaterial());
        product.setTracks(request.getTracks());
        product.setConcave(request.getConcave());
        product.setWheels(request.getWheels());
        product.setBearings(request.getBearings());
        product.setInstock(request.getInstock());
        product.setStore(store);
        product.setManufacturer(manufacturer);

        if (request.getPhotoPaths() != null && !request.getPhotoPaths().isEmpty()) {
            product.setPhotos(new ArrayList<>());
            for (String path : request.getPhotoPaths()) {
                Photo photo = new Photo();
                photo.setPath(path);
                photo.setProduct(product);
                product.getPhotos().add(photo);
            }
        }

        Product savedProduct = productRepository.save(product);

        return AdminProductSummaryDto.builder() 
            .id(savedProduct.getId())
            .name(savedProduct.getName())
            .price(savedProduct.getPrice())
            .instock(savedProduct.getInstock())
            .brandName(savedProduct.getManufacturer().getName())
            .photoPath(null) 
            .build();
    }

    @Transactional
    public AdminProductSummaryDto updateProduct(Integer id, ProductDetailsDto dto) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Produkt nie istnieje"));

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getSize() != null) product.setSize(dto.getSize());
        if (dto.getMaterial() != null) product.setMaterial(dto.getMaterial());
        if (dto.getTracks() != null) product.setTracks(dto.getTracks());
        if (dto.getConcave() != null) product.setConcave(dto.getConcave());
        if (dto.getWheels() != null) product.setWheels(dto.getWheels());
        if (dto.getBearings() != null) product.setBearings(dto.getBearings());
        if (dto.getInstock() != null) product.setInstock(dto.getInstock());

        if (dto.getManufacturersId() != null) {
            Manufacturer manufacturer = manufacturerRepository.findById(dto.getManufacturersId())
                .orElseThrow(() -> new RuntimeException("Wybrany producent nie istnieje"));
            product.setManufacturer(manufacturer);
        }

        Product savedProduct = productRepository.save(product);

        String photoPath = (savedProduct.getPhotos() != null && !savedProduct.getPhotos().isEmpty())
            ? savedProduct.getPhotos().get(0).getPath()
            : null;

        String manufacturerName = (savedProduct.getManufacturer() != null) 
            ? savedProduct.getManufacturer().getName() 
            : "Brak producenta";

        return AdminProductSummaryDto.builder() 
            .id(savedProduct.getId())
            .name(savedProduct.getName())
            .price(savedProduct.getPrice())
            .instock(savedProduct.getInstock())
            .brandName(manufacturerName)
            .photoPath(photoPath)
            .build();
    }

    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
             .orElseThrow(() -> new ResourceNotFoundException("Nie można usunąć. Produkt o ID " + id + " nie istnieje."));

        productRepository.delete(product);
    }
}