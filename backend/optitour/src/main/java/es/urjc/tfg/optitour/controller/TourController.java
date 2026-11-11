package es.urjc.tfg.optitour.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import es.urjc.tfg.optitour.service.TourService;
import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.mapper.TourMapper;
import es.urjc.tfg.optitour.model.Tour;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/tour")
public class TourController {
    private final TourService service;

    private final TourMapper mapper;

    TourController(TourService service, TourMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/")
    public Page<TourDTO> getPagedTours(@PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return service.getPagedTours(pageable).map(mapper::toDTO);
    }

    @GetMapping("/{id}")
    public TourDTO getTourById(@PathVariable long id) {
        Tour tour = service.getTourById(id);
        return mapper.toDTO(tour);
    }
}
