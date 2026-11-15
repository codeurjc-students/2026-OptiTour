package es.urjc.tfg.optitour.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;

@Service
public class PointOfInterestService {
    private final PointOfInterestRepository repository;

    public PointOfInterestService(PointOfInterestRepository repository) {
        this.repository = repository;
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

    public boolean validateUniqueName(String name) {
        return !repository.findByName(name).isPresent();
    }

    public PointOfInterest saveNewPoi(PointOfInterestCreateDTO newPoi) {
        if (!validateUniqueName(newPoi.name()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Ya exisite un punto de interés con este nombre. Prueba con otro punto de interés e inténtalo de nuevo");

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
}