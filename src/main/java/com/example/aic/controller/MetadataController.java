package com.example.aic.controller;

import com.example.aic.model.*;
import com.example.aic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {

    @Autowired
    private MassifRepository massifRepository;

    @Autowired
    private AvalancheTypeRepository typeRepository;

    @Autowired
    private AvalancheCauseRepository causeRepository;

    @Autowired
    private OrientationRepository orientationRepository;

    @Autowired
    private RegionRepository regionRepository;

    @GetMapping("/massifs")
    public List<Massif> getMassifs() {
        return massifRepository.findAll();
    }

    @GetMapping("/types")
    public List<AvalancheType> getTypes() {
        return typeRepository.findAll();
    }

    @GetMapping("/causes")
    public List<AvalancheCause> getCauses() {
        return causeRepository.findAll();
    }

    @GetMapping("/orientations")
    public List<Orientation> getOrientations() {
        return orientationRepository.findAll();
    }

    @GetMapping("/regions")
    public List<Region> getRegions() {
        return regionRepository.findAll();
    }
}
