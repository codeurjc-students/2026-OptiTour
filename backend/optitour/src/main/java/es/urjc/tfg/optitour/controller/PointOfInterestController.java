package es.urjc.tfg.optitour.controller;

import org.springframework.web.bind.annotation.RestController;

import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.mapper.PointOfInterestMapper;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.service.PointOfInterestService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/point-of-interest")
public class PointOfInterestController {

    private final PointOfInterestService service;
    private final PointOfInterestMapper mapper;

    public PointOfInterestController(PointOfInterestService service, PointOfInterestMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/{id}")
    public PointOfInterestDTO getPoiById(@PathVariable long id) {
        PointOfInterest poi = service.getPointOfInterestById(id);
        return mapper.toDTO(poi);
    }

}
