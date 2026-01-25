package com.pw.essask8.service;

import com.pw.essask8.domain.Photo;
import com.pw.essask8.domain.Product;
import com.pw.essask8.repository.PhotoRepository;
import com.pw.essask8.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final ProductRepository productRepository;

    private final String UPLOAD_DIR = "uploads"; 

    @Transactional
    public void uploadPhoto(Integer productId, MultipartFile file) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Produkt nie istnieje"));

            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;

            Path filePath = uploadPath.resolve(uniqueFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            Photo photo = new Photo();
            photo.setPath(uniqueFileName);
            photo.setProduct(product);
            
            photoRepository.save(photo);

        } catch (IOException e) {
            throw new RuntimeException("Nie udało się zapisać pliku: " + e.getMessage());
        }
    }
}