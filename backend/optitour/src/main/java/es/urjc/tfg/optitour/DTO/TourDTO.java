package es.urjc.tfg.optitour.DTO;

import java.util.List;

public record TourDTO(
                long id,
                String name,
                String description,
                List<PointOfInterestDTO> pois) {
}