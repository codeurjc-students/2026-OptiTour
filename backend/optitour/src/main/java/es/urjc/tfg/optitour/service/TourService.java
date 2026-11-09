package es.urjc.tfg.optitour.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public void saveTour(Tour tour) {
        repository.save(tour);
    }

    public Tour getTourById(long id) throws ResponseStatusException {
        Optional<Tour> op = repository.findById(id);

        if (op.isPresent()) {
            Tour tour = op.get();
            return tour;
        }

        // We set the exception message in Spanish because we want to show it on screen
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe ningún tour con el ID " + id + ".");
    }

    public Page<Tour> getPagedTours(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
