package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.PointOfInterestService;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class PointOfInterestIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private PointOfInterestService service;

    @Autowired
    private PointOfInterestRepository repository;

    @Autowired
    private TourRepository tourRepository;

    @BeforeEach
    public void initSampleData() {
        tourRepository.deleteAll();
        repository.deleteAll();

        List<Tour> tours = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            tours.add(new Tour("Test tour " + i, "Test desc " + i));
        }

        List<PointOfInterest> savedPois = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            PointOfInterest poi = new PointOfInterest("Poi name " + i, "Poi desc " + i, "sample city", "sample adress",
                    "sample coords");
            poi.setTours(tours);
            savedPois.add(repository.save(poi));
        }

        for (Tour tour : tours) {
            tour.setPois(savedPois);
            tourRepository.save(tour);
        }
    }

    @AfterEach
    public void tearDown() {
        tourRepository.deleteAll();
        repository.deleteAll();
    }

    @Test
    @DisplayName("getPointOfInterestById should return correctly requested poi data from actual database")
    public void getPointOfInterestByIdIntegrationTest() {
        Long targetId = repository.findAll().stream()
                .filter(p -> "Poi name 1".equals(p.getName()))
                .findFirst()
                .map(PointOfInterest::getId)
                .orElseThrow();

        // When: we call service method
        PointOfInterest correctResult = service.getPointOfInterestById(targetId);

        // Then: the received data is correct and not null
        assertNotNull(correctResult);
        assertEquals("Poi name 1", correctResult.getName());
        assertEquals("Poi desc 1", correctResult.getDescription());
        assertEquals("sample city", correctResult.getCity());
        assertEquals("sample adress", correctResult.getAddress());
        assertEquals("sample coords", correctResult.getCoords());
        assertNotNull(correctResult.getTours());

        // When: we call service method with incorrect id:
        long invalidId = 999999L;
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            service.getPointOfInterestById(invalidId);
        });

        assertEquals("404 NOT_FOUND \"No existe ningún punto de interés con el ID " + invalidId + ".\"",
                ex.getMessage());
    }

    @Test
    @DisplayName("getPagedPois method should return the requested page from the database")
    void getPagedPoisTest() {
        Page<PointOfInterest> result = service.getPagedPois(PageRequest.of(1, 2));

        assertEquals(1, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals("Poi name 2", result.getContent().get(0).getName());
    }

    @Test
    @DisplayName("saveNewPoi should save a new poi in database")
    public void saveNewPoiIntegrationTest() {
        service.saveNewPoi(new PointOfInterestCreateDTO("New POI", "New POI desc", "Test city", "Test address",
                "1.11111,1.11111"));

        PointOfInterest result = repository.findByName("New POI").get();

        assertNotNull(result);
        assertEquals("New POI", result.getName());
        assertEquals("New POI desc", result.getDescription());
        assertEquals("Test city", result.getCity());
        assertEquals("Test address", result.getAddress());
        assertEquals("1.11111,1.11111", result.getCoords());
    }
}