package com.powerzone.gym.config;

import com.powerzone.gym.repository.UserRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDefaultUsers(
            JdbcTemplate jdbcTemplate,
            UserRoleRepository userRoleRepository
    ) {
        return args -> {

            // Check if admin role already exists
            Boolean adminExists = jdbcTemplate.queryForObject("""
                SELECT EXISTS (
                    SELECT 1 FROM public.user_roles WHERE role = 'admin'
                )
            """, Boolean.class);

            if (Boolean.TRUE.equals(adminExists)) {
                return; // Already seeded
            }

            // ⚠️ NOTE:
            // Supabase auth users CANNOT be created via direct DB insert.
            // This initializer only assigns roles to existing users.

            List<Map<String, String>> defaultUsers = List.of(
                    Map.of(
                            "email", "admin@powerzone.com",
                            "role", "admin"
                    ),
                    Map.of(
                            "email", "member@powerzone.com",
                            "role", "user"
                    )
            );

            for (Map<String, String> user : defaultUsers) {

                String userId = jdbcTemplate.queryForObject("""
                    SELECT id FROM auth.users WHERE email = ?
                """, String.class, user.get("email"));

                if (userId != null) {
                    userRoleRepository.insertRole(userId, user.get("role"));
                }
            }
        };
    }
}
