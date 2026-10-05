package es.urjc.tfg.optitour.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
}
