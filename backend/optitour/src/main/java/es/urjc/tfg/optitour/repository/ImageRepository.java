package es.urjc.tfg.optitour.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import es.urjc.tfg.optitour.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {
    @Query("SELECT i.id FROM Image i")
    List<Long> findAllIds();
}
