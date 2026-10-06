package es.urjc.tfg.optitour.mapper;

import java.util.Collection;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import es.urjc.tfg.optitour.DTO.UserCreateDTO;
import es.urjc.tfg.optitour.model.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserCreateMapper {
    UserCreateDTO toDTO(User user);

    List<UserCreateDTO> toDTOs(Collection<User> users);

    User toDomain(UserCreateDTO userDTO);
}
