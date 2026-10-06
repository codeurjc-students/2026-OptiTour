package es.urjc.tfg.optitour.DTO;

public record UserCreateDTO(
        String email,
        String phoneNumber,
        String userName,
        String password) {
}