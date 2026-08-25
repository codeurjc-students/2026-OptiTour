package es.urjc.tfg.optitour.service;

import org.springframework.stereotype.Service;

import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;
import jakarta.annotation.PostConstruct;

@Service
public class SampleDataService {

    private final TourRepository repository;

    SampleDataService(TourRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() {

        // We insert some example tours with a for loop, only if there are no tours in
        // database.
        if (repository.count() == 0) {
            for (int i = 0; i < 5; i++) {
                repository.save(new Tour("Tour " + (i + 1), "Tour de ejemplo numero " + (i + 1)));
            }
        }
    }
}
