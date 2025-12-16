package com.powerzone.gym.dto;

public class CreateUserRequest {

    private String email;
    private String password;
    private String username;
    private String fullName;
    private String role;

    // Default constructor (required by Spring)
    public CreateUserRequest() {
    }

    public CreateUserRequest(
            String email,
            String password,
            String username,
            String fullName,
            String role
    ) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
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

    public String getRole() {
        return role;
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

    public void setRole(String role) {
        this.role = role;
    }
}
