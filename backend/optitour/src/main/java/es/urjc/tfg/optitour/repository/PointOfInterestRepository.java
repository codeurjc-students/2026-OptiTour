package es.urjc.tfg.optitour.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import es.urjc.tfg.optitour.model.PointOfInterest;

public interface PointOfInterestRepository extends JpaRepository<PointOfInterest, Long> {

}
