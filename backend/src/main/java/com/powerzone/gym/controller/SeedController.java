package com.powerzone.gym.controller;

import com.powerzone.gym.dto.ApiResponse;
import com.powerzone.gym.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/seed")
public class SeedController {

    private final UserService userService;

    public SeedController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Seed default users (admin-only)
     * Replaces: seed-users Edge Function
     */
    @PostMapping
    public ResponseEntity<ApiResponse> seedUsers(Authentication authentication) {

        String requestingUserId = (String) authentication.getPrincipal();

        userService.seedDefaultUsers(requestingUserId);

        return ResponseEntity.ok(
                new ApiResponse(true, "Users seeded successfully")
        );
    }
}
