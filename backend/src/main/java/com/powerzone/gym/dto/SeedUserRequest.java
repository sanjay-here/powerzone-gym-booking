package com.powerzone.gym.dto;

public class SeedUserRequest {

    private String email;
    private String password;
    private String username;
    private String fullName;
    private boolean isAdmin;

    // Required by Spring
    public SeedUserRequest() {
    }

    public SeedUserRequest(
            String email,
            String password,
            String username,
            String fullName,
            boolean isAdmin
    ) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.fullName = fullName;
        this.isAdmin = isAdmin;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getUsername() {
        return username;
    }

    public String getFullName() {
        return fullName;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}
