package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.TourService;

@SpringBootTest
@Testcontainers

// We need to isolate this test class from SampleDataService. With this conifg,
// container will get sample tours from SampleDataService, but the database
// container mustn't depend on production code. To solve this, we create a
// profile.
// This class has the test profile, and SampleDataService excludes this profile
// so it won't execute the sample data injection if the app is being executed
// with the test.

@ActiveProfiles("test")
public class TourServiceIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private TourService service;

    @Autowired
    private TourRepository repository;

    // Configuration for integrating the container with the Spring Boot project.
    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name",
                () -> "org.postgresql.Driver");
        registry.add("spring.jpa.database-platform",
                () -> "org.hibernate.dialect.PostgreSQLDialect");
        registry.add("spring.jpa.properties.hibernate.dialect",
                () -> "org.hibernate.dialect.PostgreSQLDialect");
    }

    @BeforeEach
    public void initSampleData() {
        // If in future we add more test, they'll use the same container. It's necessary
        // to delete data before each test
        repository.deleteAll();

        for (int i = 0; i < 2; i++) {
            service.saveTour(new Tour("Test tour " + i, "Test description " + i));
        }
    }

    @Test
    @DisplayName("getAllTours method should return the SampleDataService example tours")
    void getAllToursTest() {
        List<Tour> testTours = service.getAllTours();

        assertEquals(2, testTours.size());

        for (Tour tour : testTours) {
            assertTrue(tour.getName().contains("Test tour "));
            assertTrue(tour.getDescription().contains("Test description "));
        }
    }

}
