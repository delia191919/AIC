package com.example.aic.config;

import com.example.aic.model.Role;
import com.example.aic.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ADMIN"));
        }
        if (roleRepository.findByName("EXPERT").isEmpty()) {
            roleRepository.save(new Role(null, "EXPERT"));
        }
        if (roleRepository.findByName("CONTRIBUTOR").isEmpty()) {
            roleRepository.save(new Role(null, "CONTRIBUTOR"));
        }
        if (roleRepository.findByName("USER").isEmpty()) {
            roleRepository.save(new Role(null, "USER"));
        }
    }
}
