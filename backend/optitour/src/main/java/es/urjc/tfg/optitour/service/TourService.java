package es.urjc.tfg.optitour.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;

@Service
public class TourService {
    private final TourRepository repository;

    public TourService(TourRepository repository) {
        this.repository = repository;
    }

    public List<Tour> getAllTours() {
        return repository.findAll();
    }

    public void saveTour(Tour tour) {
        repository.save(tour);
    }

    public Tour getTourById(long id) throws ResponseStatusException {
        Optional<Tour> op = repository.findById(id);

        if (op.isPresent()) {
            Tour tour = op.get();
            return tour;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe ningún tour con el id " + id);
    }
}
