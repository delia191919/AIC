package com.example.aic.service;

import com.example.aic.dto.AvalancheDTO;
import com.example.aic.model.*;
import com.example.aic.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvalancheService {

    @Autowired
    private AvalancheRepository avalancheRepository;

    @Autowired
    private MassifRepository massifRepository;

    @Autowired
    private AvalancheTypeRepository typeRepository;

    @Autowired
    private AvalancheCauseRepository causeRepository;

    @Autowired
    private OrientationRepository orientationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<AvalancheDTO> getAllAvalanches() {
        return avalancheRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AvalancheDTO> getValidatedAvalanches() {
        return avalancheRepository.findByStatus(Avalanche.Status.VALIDATED).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AvalancheDTO getAvalancheById(Integer id) {
        Avalanche avalanche = avalancheRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avalanche not found with id: " + id));
        return convertToDto(avalanche);
    }

    public List<AvalancheDTO> search(String title, Integer massifId, Integer typeId, Integer causeId,
            Integer orientationId, java.time.LocalDate startDate, java.time.LocalDate endDate,
            Integer minAltitude, Integer maxAltitude, Integer minSlope,
            String size, Boolean hasVictims, String status) {
        return avalancheRepository.findAll(com.example.aic.repository.specification.AvalancheSpecification.filterBy(
                title, massifId, typeId, causeId, orientationId, startDate, endDate,
                minAltitude, maxAltitude, minSlope, size, hasVictims, status))
                .stream()
                .map(this::convertToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Transactional
    public AvalancheDTO createAvalanche(AvalancheDTO dto, User user) {
        Avalanche avalanche = modelMapper.map(dto, Avalanche.class);

        avalanche.setContributor(user);

        // Validation logic
        String roleName = user.getRole().getName().toUpperCase();
        if (roleName.contains("ADMIN") || roleName.contains("EXPERT")) {
            avalanche.setStatus(Avalanche.Status.VALIDATED);
        } else {
            avalanche.setStatus(Avalanche.Status.PENDING);
        }

        // Set relations
        if (dto.getMassifId() != null) {
            avalanche.setMassif(massifRepository.findById(dto.getMassifId()).orElse(null));
        }
        if (dto.getTypeId() != null) {
            avalanche.setType(typeRepository.findById(dto.getTypeId()).orElse(null));
        }
        if (dto.getCauseId() != null) {
            avalanche.setCause(causeRepository.findById(dto.getCauseId()).orElse(null));
        }
        if (dto.getOrientationId() != null) {
            avalanche.setOrientation(orientationRepository.findById(dto.getOrientationId()).orElse(null));
        }

        // Handle nested entities
        if (avalanche.getTechnicalDetails() != null) {
            avalanche.getTechnicalDetails().setAvalanche(avalanche);
        }
        if (avalanche.getDamagesAndVictims() != null) {
            avalanche.getDamagesAndVictims().setAvalanche(avalanche);
        }

        Avalanche saved = avalancheRepository.save(avalanche);
        return convertToDto(saved);
    }

    public AvalancheDTO validateAvalanche(Integer id) {
        Avalanche avalanche = avalancheRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avalanche not found"));
        avalanche.setStatus(Avalanche.Status.VALIDATED);
        return convertToDto(avalancheRepository.save(avalanche));
    }

    private AvalancheDTO convertToDto(Avalanche avalanche) {
        AvalancheDTO dto = modelMapper.map(avalanche, AvalancheDTO.class);
        if (avalanche.getMassif() != null)
            dto.setMassifId(avalanche.getMassif().getId());
        if (avalanche.getType() != null)
            dto.setTypeId(avalanche.getType().getId());
        if (avalanche.getCause() != null)
            dto.setCauseId(avalanche.getCause().getId());
        if (avalanche.getOrientation() != null)
            dto.setOrientationId(avalanche.getOrientation().getId());
        if (avalanche.getContributor() != null)
            dto.setContributorId(avalanche.getContributor().getId());

        if (avalanche.getImages() != null) {
            dto.setImageUrls(avalanche.getImages().stream()
                    .map(AvalancheImage::getImageUrl)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public void deleteAvalanche(Integer id) {
        avalancheRepository.deleteById(id);
    }
}
