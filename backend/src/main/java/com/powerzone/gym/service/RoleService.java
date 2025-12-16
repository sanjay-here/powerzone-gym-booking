package com.powerzone.gym.service;

import com.powerzone.gym.exception.ForbiddenException;
import com.powerzone.gym.repository.UserRoleRepository;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    private final UserRoleRepository userRoleRepository;

    public RoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    /**
     * Check whether a user is admin
     * Equivalent to: has_role(auth.uid(), 'admin')
     */
    public boolean isAdmin(String userId) {
        return userRoleRepository.existsByUserIdAndRole(userId, "admin");
    }

    /**
     * Assert admin role, else throw exception
     */
    public void assertAdmin(String userId) {
        if (!isAdmin(userId)) {
            throw new ForbiddenException("Admin privileges required");
        }
    }

    /**
     * Assign admin role to a user
     * Equivalent to inserting into user_roles
     */
    public void assignAdminRole(String userId) {
        if (!isAdmin(userId)) {
            userRoleRepository.insertRole(userId, "admin");
        }
    }

    /**
     * Remove admin role from a user
     */
    public void removeAdminRole(String userId) {
        userRoleRepository.deleteRole(userId, "admin");
    }
}
