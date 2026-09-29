package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.TourService;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
// We need to isolate this test class from SampleDataService. With this conifg,
// container will get sample tours from SampleDataService, but the database
// container mustn't depend on production code. To solve this, we create a
// profile.
// This class has the test profile, and SampleDataService excludes this profile
// so it won't execute the sample data injection if the app is being executed
// with the test.

public class TourServiceIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private TourService service;

    @Autowired
    private TourRepository repository;

    @BeforeEach // Given: We have a testcontainers database running in docker envoronment with
                // some sample data:
    public void initSampleData() {
        // If in future we add more test, they'll use the same container. It's necessary
        // to delete data before each test
        repository.deleteAll();

        for (int i = 0; i < 3; i++) {
            Tour tour = new Tour("Test tour " + i, "Test description " + i);

            List<PointOfInterest> pois = new ArrayList<PointOfInterest>(); // We add the POI list

            for (int j = 0; j < 3; j++) {
                pois.add(new PointOfInterest("Test POI " + j, "Test desc " + j, "Test city", "TestAddress",
                        "TestCoords"));
            }

            tour.setPois(pois);
            service.saveTour(tour);
        }
    }

    @Test
    @DisplayName("getAllTours method should return the Testcontainers databse example tours")
    void getAllToursTest() {
        List<Tour> testTours = service.getAllTours();

        assertEquals(3, testTours.size());

        for (Tour tour : testTours) {
            assertTrue(tour.getName().contains("Test tour "));
            assertTrue(tour.getDescription().contains("Test description "));
        }
    }

    @Test
    @DisplayName("getTourById method should return the Testcontainers database example tours.")
    void getToursByIdTest() {
        // repository.deleteAll() deletes the content of tables, but does not reset
        // Spring Data ids.
        // So, in this test, we have IDs 4, 5, and 6 corresponding with 0, 1 and 2 in
        // test strings, respectively
        // We get the id directly from first tour so we don't need to deduct new ids in
        // sucesive tests

        List<Tour> allTours = service.getAllTours();
        Long firstTourId = allTours.get(0).getId();

        // When: we call the method with correct ID
        Tour correctResult = service.getTourById(firstTourId);

        // Then: the tour received is the correct one and it has the poi list.

        assertNotNull(correctResult);
        assertEquals("Test tour 0", correctResult.getName());
        assertEquals("Test description 0", correctResult.getDescription());
        assertNotNull(correctResult.getPois());

        List<PointOfInterest> resultList = correctResult.getPois();
        assertNotNull(resultList);
        assertEquals("Test POI 1", resultList.get(1).getName());
        assertEquals("Test desc 1", resultList.get(1).getDescription());

        Long invalidId = firstTourId + 1000;
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            service.getTourById(invalidId);
        });

        assertEquals("404 NOT_FOUND \"No existe ningún tour con el ID " + invalidId + ".\"", ex.getMessage());
    }

}
