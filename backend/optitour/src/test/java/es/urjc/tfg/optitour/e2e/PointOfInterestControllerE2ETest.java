package es.urjc.tfg.optitour.e2e;

import es.urjc.tfg.optitour.BaseIntegrationTest;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PointOfInterestControllerE2ETest extends BaseIntegrationTest {
    @Autowired
    private PointOfInterestRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @LocalServerPort
    private int port;

    @BeforeEach
    void setup() {
        RestAssured.port = port;
        RestAssured.baseURI = "https://localhost";
        RestAssured.useRelaxedHTTPSValidation();

        jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE point_of_interest RESTART IDENTITY CASCADE");

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
    @DisplayName("Checks if getPointOfInterestById endpoint returns the correct POI")
    void getPointOfInterestByIdE2ETest() {
        List<PointOfInterest> allList = repository.findAll();
        long firstId = allList.get(0).getId();

        PointOfInterestDTO result = get("/api/v1/point-of-interest/" + firstId)
                .then()
                .statusCode(200)
                .extract().as(PointOfInterestDTO.class);

        assertNotNull(result);
        assertEquals("Poi name 0", result.name());
        assertEquals("Poi desc 0", result.description());
        assertNotNull(result.tours());
    }

    @Test
    @DisplayName("Checks if getPointOfInterestById endopint responds with 404 code if id is not correct")
    void getPointOfInterestByIdIncorrectIdE2ETest() {
        long invalidId = 100000000;
        get("/api/v1/tour/" + invalidId)
                .then()
                .statusCode(404);
    }
}
