package com.example.aic.service;

import com.example.aic.dto.UserDTO;
import com.example.aic.model.Role;
import com.example.aic.model.User;
import com.example.aic.repository.RoleRepository;
import com.example.aic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUserRole(Integer userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);
        return convertToDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    private UserDTO convertToDto(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : null);
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
