package es.urjc.tfg.optitour.DTO;

import java.util.List;

/**
 * This DTO is created to avoid circular references caused by the N:M
 * relationship between Tour and PointOfInterest
 */

public record TourNoListDTO(
                long id,
                String name,
                List<ImageDTO> images) {
}