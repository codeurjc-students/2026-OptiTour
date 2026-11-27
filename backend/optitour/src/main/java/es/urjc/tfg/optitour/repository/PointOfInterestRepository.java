package es.urjc.tfg.optitour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import es.urjc.tfg.optitour.model.PointOfInterest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Long> {
    Optional<PointOfInterest> findById(long id);

    Optional<PointOfInterest> findByName(String name);

    @Query("SELECT p.createdAt FROM PointOfInterest p")
    List<LocalDateTime> findAllDates();
}
