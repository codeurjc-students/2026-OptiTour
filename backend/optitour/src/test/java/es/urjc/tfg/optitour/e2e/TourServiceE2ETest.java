package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import es.urjc.tfg.optitour.DTO.TourDTO;
import io.restassured.RestAssured;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TourServiceE2ETest {
    // First of all, we configure the random port where the api will run:

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    @DisplayName("Calling api at /api/v1/tour/all should return the SampleDataService example tours")
    public void tourServiceE2Etest() {
        // We make the api call, check the HTTP status code and get the sample tour list
        List<TourDTO> result = get("/api/v1/tour/all")
                .then()
                .statusCode(200)
                .extract().jsonPath().getList("$", TourDTO.class);

        // Now, we can check if received data is correct:

        assertThat(result, hasSize(5));

        for (int i = 0; i < 5; i++) {
            assertThat(result.get(i).id(), equalTo((long) i + 1));
            assertThat(result.get(i).name(), equalTo("Tour " + (i + 1)));
            assertThat(result.get(i).description(), equalTo("Tour de ejemplo numero " + (i + 1)));
        }

    }
}
