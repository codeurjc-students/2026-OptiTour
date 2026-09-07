package es.urjc.tfg.optitour.controller;

import java.util.Collection;

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

@RestController
public class TourController {
    private final TourService service;

    private final TourMapper mapper;

    TourController(TourService service, TourMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @Operation(summary = "Get all tours")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found tours", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Tour.class)) }),
    })
    @GetMapping("/tour/all")
    public Collection<TourDTO> getTours() {
        return mapper.toDTOs(service.getAllTours());
    }

}
