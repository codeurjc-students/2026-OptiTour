package es.urjc.tfg.optitour.DTO;

public record PointOfInterestDTO(
        Long id,
        String name,
        String description,
        String city,
        String address,
        String coords) {
}
