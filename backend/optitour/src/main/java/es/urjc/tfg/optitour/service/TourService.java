package es.urjc.tfg.optitour.service;

import java.util.List;

import org.springframework.stereotype.Service;

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
}
