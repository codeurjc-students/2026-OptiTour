package es.urjc.tfg.optitour.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.mapper.PointOfInterestMapper;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;

@Service
public class PointOfInterestService {
    private final PointOfInterestRepository repository;
    private PointOfInterestMapper mapper;
    private TourService tourService;

    public PointOfInterestService(PointOfInterestRepository repository, PointOfInterestMapper mapper,
            TourService tourService) {
        this.repository = repository;
        this.mapper = mapper;
        this.tourService = tourService;
    }

    public PointOfInterest getPointOfInterestById(long id) throws ResponseStatusException {
        Optional<PointOfInterest> op = repository.findById(id);

        if (op.isPresent()) {
            PointOfInterest poi = op.get();
            return poi;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "No existe ningún punto de interés con el ID " + id + ".");
    }

    public void savePoi(PointOfInterest poi) {
        repository.save(poi);
    }

    public Page<PointOfInterest> getPagedPois(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public void validateUniqueName(String name) {
        if (repository.findByName(name).isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ya exisite un punto de interés con este nombre. Prueba con otro punto de interés e inténtalo de nuevo");

    }

    public PointOfInterest saveNewPoi(PointOfInterestCreateDTO newPoi) {
        validateUniqueName(newPoi.name());

        PointOfInterest savedPoi = new PointOfInterest(newPoi.name(), newPoi.description(), newPoi.city(),
                newPoi.address(), newPoi.coords());
        repository.save(savedPoi);
        return savedPoi;
    }

    public List<Image> addImagesToPoi(long id, List<Image> images) {
        PointOfInterest targetPoi = getPointOfInterestById(id);
        for (Image image : images) {
            image.setPoi(targetPoi);
        }
        targetPoi.getImages().addAll(images);
        PointOfInterest savedPoi = repository.save(targetPoi);
        int firstNewImageIndex = savedPoi.getImages().size() - images.size();
        return new ArrayList<>(savedPoi.getImages().subList(firstNewImageIndex, savedPoi.getImages().size()));
    }

    public PointOfInterestDTO deletePoiById(long id) {
        PointOfInterest deleted = getPointOfInterestById(id);

        /**
         * It's necessary to map the dto here, because in controller
         * it won't be possible to map it due to references to other tables,
         * like tours or images. This causes that Hibernate cannot search for
         * tours and images attached to a deleted (this is, unexisiting) poi,
         * so return 504 status code instead of the deleted POI DTO
         */

        PointOfInterestDTO dto = mapper.toDTO(deleted);

        /*
         * Also, it's neccessary to delete manually attached tours.
         * This is because, being a many-to-many relationship, both tours and poi tables
         * are related thanks to a middle table: tour_poi. This table has foreign keys
         * to
         * tour and poi tables. So, in order to delete a poi, it's necessary to
         * disconnect this middle
         * table's the corresponding tour foreign key.
         */

        List<Tour> attachedTours = deleted.getTours();
        for (Tour tour : attachedTours) {
            tour.getPois().remove(deleted);
            tourService.saveTour(tour);
        }

        repository.delete(deleted);
        return dto;
    }

    public PointOfInterest editPoiById(long id, PointOfInterestCreateDTO newPoi) {
        PointOfInterest target = getPointOfInterestById(id);

        if (!target.getName().equals(newPoi.name()))
            validateUniqueName(newPoi.name());

        target.setName(newPoi.name());
        target.setDescription(newPoi.description());
        target.setCity(newPoi.city());
        target.setAddress(newPoi.address());
        target.setCoords(newPoi.coords());

        repository.save(target);
        return target;
    }

    public void deleteImageFromPoi(long poiId, long imageId) {
        PointOfInterest target = getPointOfInterestById(poiId);
        boolean removed = target.getImages().removeIf(image -> {
            if (image.getId() == imageId) {
                image.setPoi(null);
                return true;
            }
            return false;
        });

        if (!removed)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No existe ninguna imagen con el id " + imageId + " en el punto de interés " + poiId);

        repository.save(target);
    }

    public List<LocalDateTime> getPoisDates() {
        return repository.findAllDates();
    }
}