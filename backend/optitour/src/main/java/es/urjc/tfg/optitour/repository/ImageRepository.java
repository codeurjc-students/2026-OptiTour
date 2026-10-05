package es.urjc.tfg.optitour.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import es.urjc.tfg.optitour.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {

}
