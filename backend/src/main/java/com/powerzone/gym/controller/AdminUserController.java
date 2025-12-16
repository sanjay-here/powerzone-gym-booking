package com.powerzone.gym.controller;

import com.powerzone.gym.dto.ApiResponse;
import com.powerzone.gym.dto.CreateUserRequest;
import com.powerzone.gym.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Create a new user (admin-only)
     * Replaces: create-user Edge Function
     */
    @PostMapping
    public ResponseEntity<ApiResponse> createUser(
            @RequestBody CreateUserRequest request,
            Authentication authentication
    ) {
        String requestingUserId = (String) authentication.getPrincipal();

        userService.createUser(requestingUserId, request);

        return ResponseEntity.ok(
                new ApiResponse(true, "User created successfully")
        );
    }

    /**
     * Delete a user (admin-only)
     * Replaces: delete-user Edge Function
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<ApiResponse> deleteUser(
            @PathVariable String userId,
            Authentication authentication
    ) {
        String requestingUserId = (String) authentication.getPrincipal();

        userService.deleteUser(requestingUserId, userId);

        return ResponseEntity.ok(
                new ApiResponse(true, "User deleted successfully")
        );
    }
}
