package es.urjc.tfg.optitour.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import es.urjc.tfg.optitour.DTO.ImageDTO;
import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.mapper.ImageMapper;
import es.urjc.tfg.optitour.mapper.PointOfInterestMapper;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.service.ImageService;
import es.urjc.tfg.optitour.service.PointOfInterestService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
    private final ImageService imageService;
    private final ImageMapper imageMapper;

    public PointOfInterestController(PointOfInterestService service, PointOfInterestMapper mapper,
            ImageService imageService, ImageMapper imageMapper) {
        this.service = service;
        this.mapper = mapper;
        this.imageService = imageService;
        this.imageMapper = imageMapper;
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

    @PostMapping("/{id}/image")
    public ResponseEntity<List<ImageDTO>> uploadImageFiles(@PathVariable long id,
            @RequestParam("file") Collection<MultipartFile> imageFiles) throws IOException {
        List<InputStream> streams = new ArrayList<>();

        for (MultipartFile imageFile : imageFiles)
            streams.add(imageFile.getInputStream());

        List<Image> images = imageService.createImageList(streams);
        images = service.addImagesToPoi(id, images);

        URI location = fromCurrentRequest().build().toUri();

        return ResponseEntity.created(location).body(imageMapper.toDTOs(images));
    }

}
