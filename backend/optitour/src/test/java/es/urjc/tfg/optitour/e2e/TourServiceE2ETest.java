package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.repository.TourRepository;
import io.restassured.RestAssured;
import java.util.ArrayList;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TourServiceE2ETest extends BaseIntegrationTest {
        @Autowired
        private TourRepository repository;

        @Autowired
        private JdbcTemplate jdbcTemplate;

        // First of all, we configure the random port where the api will run:
        @LocalServerPort
        private int port;

        List<String> tourNames;
        List<String> tourDescriptions;

        @BeforeEach
        void setUp() {
                RestAssured.port = port;
                RestAssured.baseURI = "https://localhost";
                RestAssured.useRelaxedHTTPSValidation();
                jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY CASCADE");
                jdbcTemplate.execute("TRUNCATE TABLE point_of_interest RESTART IDENTITY CASCADE");

                repository.deleteAll();

                tourNames = new ArrayList<>();
                tourDescriptions = new ArrayList<>();

                for (int i = 0; i < 30; i++) {
                        String name = "Test tour " + i;
                        String desc = "Test description " + i;
                        tourNames.add(name);
                        tourDescriptions.add(desc);

                        Tour tour = new Tour(name, desc);
                        List<PointOfInterest> pois = new ArrayList<>();
                        for (int j = 0; j < 3; j++) {
                                pois.add(new PointOfInterest("Test POI " + j, "Test desc " + j, "Test city",
                                                "TestAddress", "TestCoords"));
                        }
                        tour.setPois(pois);
                        repository.save(tour);
                }
        }

        @Test
        @DisplayName("Calling api at /tour/all should return the SampleDataService example tours")
        public void tourServiceE2Etest() {
                // We make the api call, check the HTTP status code and get the sample tour list
                List<TourDTO> result = get("/api/v1/tour/all")
                                .then()
                                .statusCode(200)
                                .extract().jsonPath().getList("$", TourDTO.class);

                // Now, we can check if received data is correct:

                assertThat(result, hasSize(30));

                for (int i = 0; i < 30; i++) {
                        assertThat(result.get(i).id(), equalTo((long) i + 1));
                        assertThat(result.get(i).name(), equalTo(tourNames.get(i)));
                        assertThat(result.get(i).description(), equalTo(tourDescriptions.get(i)));
                }
        }

        @Test
        @DisplayName("Checks if pageable tour endpoint works properly")
        void pagaebleToursTest() {
                List<TourDTO> result = get("/api/v1/tour/?page=0&size=5")
                                .then()
                                .statusCode(200)
                                .extract().jsonPath().getList("content", TourDTO.class);

                assertThat(result, hasSize(5));

                for (int i = 0; i < 5; i++) {
                        assertThat(result.get(i).id(), equalTo((long) i + 1));
                        assertThat(result.get(i).name(), equalTo(tourNames.get(i)));
                        assertThat(result.get(i).description(), equalTo(tourDescriptions.get(i)));
                }
        }

        @Test
        @DisplayName("getToursById should return the correct tour and its points")
        void getTourByIdE2ETest() {
                List<Tour> allList = repository.findAll();
                long firstId = allList.get(0).getId();
                
                TourDTO correctResult = get("/api/v1/tour/" + firstId)
                                .then()
                                .statusCode(200)
                                .extract().as(TourDTO.class);

                assertNotNull(correctResult);
                assertEquals("Test tour 0", correctResult.name());
                assertEquals("Test description 0", correctResult.description());
                assertNotNull(correctResult.pois());

                List<es.urjc.tfg.optitour.DTO.PointOfInterestNoListDTO> resultList = correctResult.pois();
                assertNotNull(resultList);
                assertEquals("Test POI 1", resultList.get(1).name());
                assertEquals("Test desc 1", resultList.get(1).description());

                long invalidId = firstId + 1000;
                get("/api/v1/tour/" + invalidId) // With incorrect id
                                .then()
                                .statusCode(404);
        }
}
