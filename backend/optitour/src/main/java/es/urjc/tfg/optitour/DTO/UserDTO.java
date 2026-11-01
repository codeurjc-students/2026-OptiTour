package es.urjc.tfg.optitour.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;

public record UserDTO(
        Long id,
        String email,
        String userName,
        String phoneNumber,
        Boolean isBanned,
        LocalDateTime createdAt,
        ArrayList<String> roles) {
}