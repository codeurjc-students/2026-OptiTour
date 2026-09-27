package es.urjc.tfg.optitour.mapper;

import java.util.Collection;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.model.PointOfInterest;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PointOfInterestMapper {

    PointOfInterestDTO toDTO(PointOfInterest poi);

    PointOfInterest toDomain(PointOfInterestDTO poiDto);

    List<PointOfInterestDTO> toDTOs(Collection<PointOfInterest> pois);

    List<PointOfInterest> toDomain(Collection<PointOfInterestDTO> poiDtos);
}
