package es.urjc.tfg.optitour.DTO;

import java.time.LocalDateTime;
import java.util.List;

public record PointOfInterestStatsDTO(
        List<LocalDateTime> createdDates) {
}