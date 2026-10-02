package es.urjc.tfg.optitour.mapper;

import java.util.Collection;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.model.Tour;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {
        PointOfInterestMapper.class, ImageMapper.class })
public interface TourMapper {

    TourDTO toDTO(Tour tour);

    @Mapping(target = "images", ignore = true)
    Tour toDomain(TourDTO tourDTO);

    List<TourDTO> toDTOs(Collection<Tour> tours);

    List<Tour> toDomain(Collection<TourDTO> tours);
}
