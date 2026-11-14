package es.urjc.tfg.optitour.mapper;

import java.util.Collection;
import java.util.List;

import org.mapstruct.Mapper;

import es.urjc.tfg.optitour.DTO.ImageDTO;
import es.urjc.tfg.optitour.model.Image;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    ImageDTO toDTO(Image image);

    List<ImageDTO> toDTOs(Collection<Image> images);
}
