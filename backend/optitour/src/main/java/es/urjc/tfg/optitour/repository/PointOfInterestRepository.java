package es.urjc.tfg.optitour.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.urjc.tfg.optitour.model.PointOfInterest;
import java.util.Optional;

public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Long> {
    Optional<PointOfInterest> findById(long id);
}
