package es.urjc.tfg.optitour.mapper;

import java.util.Collection;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.model.Tour;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TourMapper {

    TourDTO toDTO(Tour tour);

    Tour toDomain(TourDTO tourDTO);

    @Mapping(source = "tour.id", target = "id")
    List<TourDTO> toDTOs(Collection<Tour> tours);

    @Mapping(source = "id", target = "tour.id")
    List<Tour> toDomain(Collection<TourDTO> tours);
}
