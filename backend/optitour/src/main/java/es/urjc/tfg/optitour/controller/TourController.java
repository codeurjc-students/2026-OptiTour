package es.urjc.tfg.optitour.controller;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import es.urjc.tfg.optitour.service.TourService;
import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.mapper.TourMapper;

@RestController
public class TourController {
    @Autowired
    private TourService service;

    @Autowired
    private TourMapper mapper;

    @GetMapping("/tour/all")
    public Collection<TourDTO> getTours() {
        return mapper.toDTOs(service.getAllTours());
    }

}
