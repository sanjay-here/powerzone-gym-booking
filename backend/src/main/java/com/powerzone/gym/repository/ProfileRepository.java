package com.powerzone.gym.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProfileRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Check if profile exists for a user
     * Equivalent to:
     * SELECT 1 FROM profiles WHERE user_id = ?
     */
    public boolean existsByUserId(String userId) {

        String sql = """
            SELECT EXISTS (
                SELECT 1
                FROM public.profiles
                WHERE user_id = ?
            )
        """;

        return Boolean.TRUE.equals(
                jdbcTemplate.queryForObject(sql, Boolean.class, userId)
        );
    }

    /**
     * Create profile for a user
     * Usually called after user creation
     */
    public void createProfile(String userId, String username, String fullName) {

        String sql = """
            INSERT INTO public.profiles (user_id, username, full_name)
            VALUES (?, ?, ?)
            ON CONFLICT (user_id) DO NOTHING
        """;

        jdbcTemplate.update(sql, userId, username, fullName);
    }

    /**
     * Fetch profile by user_id
     */
    public Optional<ProfileRow> findByUserId(String userId) {

        String sql = """
            SELECT id, user_id, username, full_name, created_at
            FROM public.profiles
            WHERE user_id = ?
        """;

        return jdbcTemplate.query(sql, rs -> {
            if (rs.next()) {
                return Optional.of(
                        new ProfileRow(
                                rs.getString("id"),
                                rs.getString("user_id"),
                                rs.getString("username"),
                                rs.getString("full_name"),
                                rs.getTimestamp("created_at").toInstant()
                        )
                );
            }
            return Optional.empty();
        }, userId);
    }

    /**
     * Simple immutable projection (no entity / JPA needed)
     */
    public record ProfileRow(
            String id,
            String userId,
            String username,
            String fullName,
            java.time.Instant createdAt
    ) {}
}
