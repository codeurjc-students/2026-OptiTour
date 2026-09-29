package es.urjc.tfg.optitour.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import es.urjc.tfg.optitour.model.Tour;

public interface TourRepository extends JpaRepository<Tour, Long> {
    public Optional<Tour> findById(long id);
}
