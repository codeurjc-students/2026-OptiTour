package es.urjc.tfg.optitour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import es.urjc.tfg.optitour.model.Tour;

public interface TourRepository extends JpaRepository<Tour, Long> {

}
