package es.urjc.tfg.optitour.DTO;

import java.util.List;

public record PointOfInterestNoListDTO(
                Long id,
                String name,
                String description,
                List<ImageDTO> images) {

}
