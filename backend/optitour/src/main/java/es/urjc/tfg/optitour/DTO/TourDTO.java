package es.urjc.tfg.optitour.DTO;

import java.util.List;

public record TourDTO(
        long id,
        String name,
        String description,
        List<PointOfInterestNoListDTO> pois,
        List<ImageDTO> images) {
}