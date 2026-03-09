package com.example.aic.service;

import com.example.aic.dto.ConditionsDTO;
import com.example.aic.model.Conditions;
import com.example.aic.model.User;
import com.example.aic.repository.ConditionsRepository;
import com.example.aic.repository.MassifRepository;
import com.example.aic.repository.RegionRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConditionsService {

    @Autowired
    private ConditionsRepository conditionsRepository;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private MassifRepository massifRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Page<ConditionsDTO> getAllConditions(Pageable pageable) {
        return conditionsRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public ConditionsDTO getConditionsById(Integer id) {
        Conditions conditions = conditionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conditions not found with id: " + id));
        return convertToDto(conditions);
    }

    public Page<ConditionsDTO> search(String title, Integer regionId, Integer massifId,
            java.time.LocalDate startDate, java.time.LocalDate endDate, Pageable pageable) {
        return conditionsRepository.findAll(com.example.aic.repository.specification.ConditionsSpecification.filterBy(
                title, regionId, massifId, startDate, endDate), pageable)
                .map(this::convertToDto);
    }

    public ConditionsDTO createConditions(ConditionsDTO dto, User user) {
        Conditions conditions = modelMapper.map(dto, Conditions.class);
        conditions.setContributor(user);

        if (dto.getRegionId() != null) {
            conditions.setRegion(regionRepository.findById(dto.getRegionId()).orElse(null));
        }
        if (dto.getMassifId() != null) {
            conditions.setMassif(massifRepository.findById(dto.getMassifId()).orElse(null));
        }

        Conditions saved = conditionsRepository.save(conditions);
        return convertToDto(saved);
    }

    private ConditionsDTO convertToDto(Conditions conditions) {
        ConditionsDTO dto = modelMapper.map(conditions, ConditionsDTO.class);
        if (conditions.getRegion() != null)
            dto.setRegionId(conditions.getRegion().getId());
        if (conditions.getMassif() != null)
            dto.setMassifId(conditions.getMassif().getId());
        if (conditions.getContributor() != null)
            dto.setContributorId(conditions.getContributor().getId());
        return dto;
    }

    public void deleteConditions(Integer id) {
        conditionsRepository.deleteById(id);
    }
}
