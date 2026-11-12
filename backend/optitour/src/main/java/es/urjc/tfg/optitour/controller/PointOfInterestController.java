package es.urjc.tfg.optitour.controller;

import org.springframework.web.bind.annotation.RestController;

import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.mapper.PointOfInterestMapper;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.service.PointOfInterestService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

import java.net.URI;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

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

    @GetMapping("/")
    public Page<PointOfInterestDTO> getPagedPois(
            @PageableDefault(sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return service.getPagedPois(pageable).map(mapper::toDTO);
    }

    @PostMapping("/")
    public ResponseEntity<PointOfInterestDTO> PointOfInterestDTO(
            @Valid @RequestBody PointOfInterestCreateDTO newPoiDTO) {
        PointOfInterest newPoi = service.saveNewPoi(newPoiDTO);
        URI location = fromCurrentRequest().path("/{id}").buildAndExpand(newPoi.getId()).toUri();
        return ResponseEntity.created(location).body(mapper.toDTO(newPoi));
    }

}
