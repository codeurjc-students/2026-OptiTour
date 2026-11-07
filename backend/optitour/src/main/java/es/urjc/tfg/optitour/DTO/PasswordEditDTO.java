package es.urjc.tfg.optitour.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordEditDTO(
        String oldPassword,

        @NotBlank(message = "La contraseña es obligatoria") @Size(min = 8, max = 20, message = "La contraseña debe tener entre 8 y 20 caracteres") @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.") String newPassword) {

}
