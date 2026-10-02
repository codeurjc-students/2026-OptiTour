package es.urjc.tfg.optitour.DTO;

import java.util.List;

public record PointOfInterestDTO(
        Long id,
        String name,
        String description,
        String city,
        String address,
        String coords,
        List<TourNoListDTO> tours,
        List<ImageDTO> images) {
}
