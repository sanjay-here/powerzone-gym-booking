package com.powerzone.gym.service;

import com.powerzone.gym.dto.CreateUserRequest;
import com.powerzone.gym.exception.ForbiddenException;
import com.powerzone.gym.exception.UnauthorizedException;
import com.powerzone.gym.repository.UserRoleRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRoleRepository userRoleRepository;
    private final WebClient webClient;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    public UserService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
        this.webClient = WebClient.builder().build();
    }

    /* =========================
       Public APIs
       ========================= */

    public void createUser(String requestingUserId, CreateUserRequest request) {

        assertAdmin(requestingUserId);

        Map<String, Object> body = Map.of(
                "email", request.getEmail(),
                "password", request.getPassword(),
                "email_confirm", true,
                "user_metadata", Map.of(
                        "username", request.getUsername(),
                        "full_name", request.getFullName()
                )
        );

        Map<String, Object> response = webClient.post()
                .uri(supabaseUrl + "/auth/v1/admin/users")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response == null || !response.containsKey("id")) {
            throw new RuntimeException("Failed to create user");
        }

        String newUserId = (String) response.get("id");

        if ("admin".equalsIgnoreCase(request.getRole())) {
            userRoleRepository.insertRole(newUserId, "admin");
        }
    }

    public void deleteUser(String requestingUserId, String userIdToDelete) {

        assertAdmin(requestingUserId);

        if (requestingUserId.equals(userIdToDelete)) {
            throw new ForbiddenException("Cannot delete your own account");
        }

        webClient.delete()
                .uri(supabaseUrl + "/auth/v1/admin/users/" + userIdToDelete)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .retrieve()
                .toBodilessEntity()
                .block();
    }

    public void seedDefaultUsers(String requestingUserId) {

        assertAdmin(requestingUserId);

        List<CreateUserRequest> users = List.of(
                new CreateUserRequest(
                        "admin@powerzone.com",
                        "admin123",
                        "admin",
                        "Gym Admin",
                        "admin"
                ),
                new CreateUserRequest(
                        "member@powerzone.com",
                        "member123",
                        "johndoe",
                        "John Doe",
                        "user"
                )
        );

        for (CreateUserRequest user : users) {
            try {
                createUser(requestingUserId, user);
            } catch (Exception ignored) {
                // User may already exist
            }
        }
    }

    /* =========================
       Internal helpers
       ========================= */

    private void assertAdmin(String userId) {

        boolean isAdmin = userRoleRepository.existsByUserIdAndRole(userId, "admin");

        if (!isAdmin) {
            throw new UnauthorizedException("Admin privileges required");
        }
    }
}
