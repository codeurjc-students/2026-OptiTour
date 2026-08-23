package es.urjc.tfg.optitour.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;

@Service
public class TourService {
    @Autowired
    private TourRepository repository;

    public List<Tour> getAllTours() {
        return repository.findAll();
    }
}
