package es.urjc.tfg.optitour.DTO;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PointOfInterestCreateDTO(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 30, message = "El nombre no puede superar los 30 caracteres")
        String name,

        @NotBlank(message = "La descripción es obligatoria")
        @Size(max = 300, message = "La descripción no puede superar los 300 caracteres")
        String description,

        @NotBlank(message = "La ciudad es obligatoria")
        @Size(max = 30, message = "La ciudad no puede superar los 30 caracteres")
        String city,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 60, message = "La dirección no puede superar los 60 caracteres")
        String address,

        @NotBlank(message = "Las coordenadas son obligatorias")
        @Pattern(
                regexp = "^-?\\d{1,2}\\.\\d+,-?\\d{1,3}\\.\\d+$",
                message = "El formato debe ser 'latitud,longitud' con decimales (ej: 40.4137818,-3.6921271)")
        String coords,

        List<ImageDTO> images
) {
}
