package com.example.aic.controller;

import com.example.aic.dto.AvalancheDTO;
import com.example.aic.model.User;
import com.example.aic.repository.UserRepository;
import com.example.aic.service.AvalancheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/avalanches")
public class AvalancheController {

    @Autowired
    private AvalancheService avalancheService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Page<AvalancheDTO> getAll(Pageable pageable) {
        return avalancheService.getAllAvalanches(pageable);
    }

    @GetMapping("/validated")
    public Page<AvalancheDTO> getValidated(Pageable pageable) {
        return avalancheService.getValidatedAvalanches(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvalancheDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(avalancheService.getAvalancheById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AvalancheDTO>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer massifId,
            @RequestParam(required = false) Integer typeId,
            @RequestParam(required = false) Integer causeId,
            @RequestParam(required = false) Integer orientationId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(required = false) Integer minAltitude,
            @RequestParam(required = false) Integer maxAltitude,
            @RequestParam(required = false) Integer minSlope,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Boolean hasVictims,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        return ResponseEntity.ok(avalancheService.search(title, massifId, typeId, causeId, orientationId,
                startDate, endDate, minAltitude, maxAltitude, minSlope, size, hasVictims, status, pageable));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AvalancheDTO> create(@RequestBody AvalancheDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(avalancheService.createAvalanche(dto, user));
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPERT')")
    public ResponseEntity<AvalancheDTO> validate(@PathVariable Integer id) {
        return ResponseEntity.ok(avalancheService.validateAvalanche(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        avalancheService.deleteAvalanche(id);
        return ResponseEntity.ok().build();
    }
}
