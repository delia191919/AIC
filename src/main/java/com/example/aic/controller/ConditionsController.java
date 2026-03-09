package com.example.aic.controller;

import com.example.aic.dto.ConditionsDTO;
import com.example.aic.model.User;
import com.example.aic.repository.UserRepository;
import com.example.aic.service.ConditionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/conditions")
public class ConditionsController {

    @Autowired
    private ConditionsService conditionsService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Page<ConditionsDTO> getAll(Pageable pageable) {
        return conditionsService.getAllConditions(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConditionsDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(conditionsService.getConditionsById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ConditionsDTO>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer regionId,
            @RequestParam(required = false) Integer massifId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            Pageable pageable) {
        return ResponseEntity.ok(conditionsService.search(title, regionId, massifId, startDate, endDate, pageable));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ConditionsDTO> create(@RequestBody ConditionsDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(conditionsService.createConditions(dto, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        conditionsService.deleteConditions(id);
        return ResponseEntity.ok().build();
    }
}
