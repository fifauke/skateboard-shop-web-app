package com.pw.essask8.service;

import com.pw.essask8.domain.Address;
import com.pw.essask8.domain.User;
import com.pw.essask8.dto.AddressDto;
import com.pw.essask8.dto.UpdateUserProfileDto;
import com.pw.essask8.dto.UserProfileDto;
import com.pw.essask8.exception.BusinessValidationException;
import com.pw.essask8.repository.AddressRepository;
import com.pw.essask8.repository.UserRepository;
import com.pw.essask8.repository.CartRepository;
import com.pw.essask8.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor 
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika: " + username));
    }

    public UserProfileDto getUserProfile(String username) {
        User user = findByUsername(username);
        return mapToDto(user);
    }

    @Transactional
    public UserProfileDto updateUser(UpdateUserProfileDto dto) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
            if (!dto.getUsername().equals(user.getUsername())) {
                if (userRepository.existsByUsername(dto.getUsername())) {
                    throw new BusinessValidationException("username", "Ten login jest już zajęty");
                }
                user.setUsername(dto.getUsername());
            }
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getEmailAddress() != null && !dto.getEmailAddress().isBlank()) {
            if (!dto.getEmailAddress().equals(user.getEmailAddress())) {
                if (userRepository.existsByEmailAddress(dto.getEmailAddress())) {
                    throw new BusinessValidationException("emailAddress", "Invalid Email");
                }
                user.setEmailAddress(dto.getEmailAddress());
            }
        }

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getSecondName() != null) user.setSecondName(dto.getSecondName());
        if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getAddress() != null) {
            Address address = user.getAddress();
            if (address == null) {
                address = new Address();
                user.setAddress(address);
            }
            
            if (dto.getAddress().getCountry() != null) address.setCountry(dto.getAddress().getCountry());
            if (dto.getAddress().getCity() != null) address.setCity(dto.getAddress().getCity());
            if (dto.getAddress().getStreet() != null) address.setStreet(dto.getAddress().getStreet());
            if (dto.getAddress().getBuildingNumber() != null) address.setBuildingNumber(dto.getAddress().getBuildingNumber());
            if (dto.getAddress().getApartmentNumber() != null) address.setApartmentNumber(dto.getAddress().getApartmentNumber());
            if (dto.getAddress().getPostalCode() != null) address.setPostalCode(dto.getAddress().getPostalCode());
        }

        User savedUser = userRepository.save(user);

        return mapToDto(savedUser);
    }  

    private UserProfileDto mapToDto(User user) {
        AddressDto addressDto = null;
        if (user.getAddress() != null) {
            addressDto = AddressDto.builder()
                .country(user.getAddress().getCountry())
                .city(user.getAddress().getCity())
                .street(user.getAddress().getStreet())
                .buildingNumber(user.getAddress().getBuildingNumber())
                .apartmentNumber(user.getAddress().getApartmentNumber())
                .postalCode(user.getAddress().getPostalCode())
                .build();
        }

        return UserProfileDto.builder()
            .username(user.getUsername())
            .emailAddress(user.getEmailAddress())
            .name(user.getName())
            .lastName(user.getLastName())
            .phoneNumber(user.getPhoneNumber())
            .secondName(user.getSecondName())
            .staff(user.getStaff())
            .address(addressDto)
            .build();
    }

    @Transactional
    public void deleteUser(Integer userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (user.getCart() != null) {
        cartRepository.delete(user.getCart());
    }

    if (user.getOrders() != null && !user.getOrders().isEmpty()) {
        orderRepository.deleteAll(user.getOrders());
    }

    userRepository.delete(user);
    }    
}