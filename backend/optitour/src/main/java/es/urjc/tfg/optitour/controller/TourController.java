package es.urjc.tfg.optitour.controller;

import es.urjc.tfg.optitour.mapper.TourMapperImpl;
import es.urjc.tfg.optitour.repository.TourRepository;
import java.util.Collection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import es.urjc.tfg.optitour.service.TourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.mapper.TourMapper;
import es.urjc.tfg.optitour.model.Tour;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/tour")
public class TourController {
    private final TourRepository tourRepository;

    private final TourService service;

    private final TourMapper mapper;

    TourController(TourService service, TourMapper mapper, TourRepository tourRepository,
            TourMapperImpl tourMapperImpl) {
        this.service = service;
        this.mapper = mapper;
        this.tourRepository = tourRepository;
    }

    @Operation(summary = "Get all tours")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found tours", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Tour.class)) }),
    })
    @GetMapping("/all")
    public Collection<TourDTO> getTours() {
        return mapper.toDTOs(service.getAllTours());
    }

    @GetMapping("/")
    public Page<TourDTO> getPagedTours(Pageable pageable) {
        return tourRepository.findAll(pageable).map(mapper::toDTO);
    }
}
