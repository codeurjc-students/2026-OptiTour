package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import es.urjc.tfg.optitour.service.PointOfInterestService;
import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class PointOfInterestIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private PointOfInterestService service;

    @Autowired
    private PointOfInterestRepository repository;

    @BeforeEach
    public void initSampleData() {
        repository.deleteAll();

        List<Tour> tours = new ArrayList<Tour>();

        for (int i = 0; i < 3; i++) {
            tours.add(new Tour("Test tour " + i, "Test desc " + i));
        }

        for (int i = 0; i < 3; i++) {
            PointOfInterest poi = new PointOfInterest("Poi name " + i, "Poi desc " + i, "sample city", "sample adress",
                    "sample coords");
            poi.setTours(tours);
            repository.save(poi);
        }
    }

    @Test
    @DisplayName("getPointOfInterestById should return correctly requested poi data from actual database")
    private void getPointOfInterestByIdIntegrationTest() {
        // When: we call service method
        PointOfInterest correctResult = service.getPointOfInterestById(1);

        // Then: the received data is correct and not null
        assertNotNull(correctResult);
        assertEquals(correctResult.getName(), "Poi name 1");
        assertEquals(correctResult.getDescription(), "Poi desc 1");
        assertNotNull(correctResult.getTours());

        // When: we call service method with incorrect id:
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            service.getPointOfInterestById(5);
        });

        assertEquals("404 NOT_FOUND \"No existe ningún punto de interés con el ID 5\"", ex.getMessage());
    }
}
