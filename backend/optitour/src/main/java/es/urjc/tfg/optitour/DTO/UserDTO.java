package es.urjc.tfg.optitour.DTO;

import java.util.ArrayList;

public record UserDTO(
                Long id,
                String email,
                String userName,
                String phoneNumber,
                Boolean isBanned,
                ArrayList<String> roles) {
}