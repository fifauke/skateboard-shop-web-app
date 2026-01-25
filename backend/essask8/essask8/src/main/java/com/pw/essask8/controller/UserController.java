package com.pw.essask8.controller;

import com.pw.essask8.domain.User;
import com.pw.essask8.service.UserService;
import com.pw.essask8.dto.UpdateUserProfileDto;
import com.pw.essask8.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET http://localhost:8080/api/users/profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getMyProfile(Authentication authentication) {
        String username =  authentication.getName();

        return ResponseEntity.ok(userService.getUserProfile(username));
    }

    // PUT http://localhost:8080/api/users/profile/update
    @PutMapping("/profile/update")
    public ResponseEntity<UserProfileDto> updateUserProfile(@Valid @RequestBody UpdateUserProfileDto dto) {
        UserProfileDto updatedProfile = userService.updateUser(dto);
        
        return ResponseEntity.ok(updatedProfile);
    }
}