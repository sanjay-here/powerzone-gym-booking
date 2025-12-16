package com.powerzone.gym.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRoleRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRoleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Check if a user has a specific role
     * Equivalent to:
     * SELECT 1 FROM user_roles WHERE user_id = ? AND role = ?
     */
    public boolean existsByUserIdAndRole(String userId, String role) {

        String sql = """
            SELECT EXISTS (
                SELECT 1
                FROM public.user_roles
                WHERE user_id = ?
                  AND role = ?
            )
        """;

        return Boolean.TRUE.equals(
                jdbcTemplate.queryForObject(sql, Boolean.class, userId, role)
        );
    }

    /**
     * Insert a role for a user
     * Equivalent to:
     * INSERT INTO user_roles (user_id, role) VALUES (?, ?)
     */
    public void insertRole(String userId, String role) {

        String sql = """
            INSERT INTO public.user_roles (user_id, role)
            VALUES (?, ?)
            ON CONFLICT DO NOTHING
        """;

        jdbcTemplate.update(sql, userId, role);
    }

    /**
     * Delete a role for a user
     */
    public void deleteRole(String userId, String role) {

        String sql = """
            DELETE FROM public.user_roles
            WHERE user_id = ?
              AND role = ?
        """;

        jdbcTemplate.update(sql, userId, role);
    }
}
