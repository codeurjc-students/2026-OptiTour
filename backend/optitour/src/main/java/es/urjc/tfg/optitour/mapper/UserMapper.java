package es.urjc.tfg.optitour.mapper;

import java.util.Collection;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import es.urjc.tfg.optitour.DTO.UserDTO;
import es.urjc.tfg.optitour.model.User;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserDTO toDTO(User user);

    User toDomain(UserDTO userDTO);

    List<UserDTO> toDTOs(Collection<User> tours);

    List<User> toDomain(Collection<UserDTO> tours);
}
