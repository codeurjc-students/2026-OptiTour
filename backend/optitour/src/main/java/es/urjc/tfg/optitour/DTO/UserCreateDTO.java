package es.urjc.tfg.optitour.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreateDTO(
        @NotBlank(message = "El correo electrónico es obligatorio.")
        @Email(message = "El correo electrónico debe tener un formato válido con un carácter '@'.")
        @Size(max = 30, message = "El correo electrónico no puede superar los 30 caracteres.")
        String email,

        @Size(max = 9, message = "El teléfono no puede superar los 9 caracteres.")
        @Pattern(regexp = "^\\+?[0-9 ]+$", message = "El teléfono solo puede contener números, espacios y opcionalmente el símbolo '+' al inicio.")
        String phoneNumber,

        @NotBlank(message = "El nombre de usuario es obligatiorio")
        @Size(min = 5, max = 20, message = "El nombre de usuario debe tener entre 5 y 20 caracteres.")
        String userName,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 8, max = 20, message = "La contraseña debe tener entre 8 y 20 caracteres")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número.")
        String password) {
}