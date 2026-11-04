package es.urjc.tfg.optitour.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import es.urjc.tfg.optitour.DTO.PasswordDTO;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PasswordMapper {
    default PasswordDTO toDTO(String password) {
        return password != null ? new PasswordDTO(password) : null;
    }

    default String toDomain(PasswordDTO password) {
        return password != null ? password.password() : null;
    }
}
