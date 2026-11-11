package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.DTO.ImageDTO;
import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.security.jwt.LoginRequest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PointOfInterestControllerE2ETest extends BaseIntegrationTest {
    @Autowired
    private PointOfInterestRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @LocalServerPort
    private int port;

    private List<String> poiNames;
    private List<String> poiDescriptions;

    @BeforeEach
    void setup() throws SQLException {
        RestAssured.port = port;
        RestAssured.baseURI = "https://localhost";
        RestAssured.useRelaxedHTTPSValidation();

        jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE point_of_interest RESTART IDENTITY CASCADE");

        repository.deleteAll();
        userRepository.deleteAll();

        User adminUser = new User("admin@optitour.com", passwordEncoder.encode("Admin1234"), "admin", "111 111 111",
                false, "USER", "ADMIN");
        userRepository.save(adminUser);

        User newUser = new User("example@example.com", passwordEncoder.encode("demo1234"), "example", "111 111 111",
                false,
                "USER");
        userRepository.save(newUser);

        poiNames = new ArrayList<>();
        poiDescriptions = new ArrayList<>();

        List<Tour> tours = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            tours.add(new Tour("Test tour " + i, "Test desc " + i));
        }

        for (int i = 0; i < 10; i++) {
            String name = "Poi name " + i;
            String desc = "Poi desc " + i;
            poiNames.add(name);
            poiDescriptions.add(desc);

            PointOfInterest poi = new PointOfInterest(name, desc, "sample city", "sample address", "sample coords");
            poi.setTours(tours);

            Image image = new Image();
            image.setImageFile(new SerialBlob(new byte[] { 1, 2, 3 }));
            image.setPoi(poi);
            poi.getImages().add(image);

            repository.save(poi);
        }
    }

    private String getAdminAuthToken() {
        LoginRequest credentials = new LoginRequest("admin@optitour.com", "Admin1234");
        return given()
                .contentType(ContentType.JSON)
                .body(credentials)
                .when()
                .post("/api/v1/auth/login")
                .then()
                .statusCode(200)
                .extract().cookie("AuthToken");
    }

    private String getUserAuthToken() {
        LoginRequest credentials = new LoginRequest("example@example.com", "demo1234");

        return given()
                .contentType(ContentType.JSON)
                .body(credentials)
                .when()
                .post("/api/v1/auth/login")
                .then()
                .statusCode(200)
                .extract().cookie("AuthToken");
    }

    private long getFirstId() {
        return repository.findAll().stream()
                .filter(p -> "Poi name 0".equals(p.getName()))
                .findFirst()
                .map(PointOfInterest::getId)
                .orElseThrow();
    }

    @Test
    @DisplayName("Checks if getPointOfInterestById endpoint returns the correct POI")
    void getPointOfInterestByIdE2ETest() {
        long firstId = getFirstId();

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
    @DisplayName("Checks if getPointOfInterestById endpoint responds with 404 code if id is not correct")
    void getPointOfInterestByIdIncorrectIdE2ETest() {
        long invalidId = 100000000;
        get("/api/v1/point-of-interest/" + invalidId)
                .then()
                .statusCode(404);
    }

    @Test
    @DisplayName("Checks if pageable point of interest endpoint works properly")
    void pageablePoisE2ETest() {
        String adminToken = getAdminAuthToken();

        List<PointOfInterestDTO> result = given()
                .cookie("AuthToken", adminToken)
                .when()
                .get("/api/v1/point-of-interest/?page=0&size=5")
                .then()
                .statusCode(200)
                .extract().jsonPath().getList("content", PointOfInterestDTO.class);

        assertThat(result, hasSize(5));

        for (int i = 0; i < 5; i++) {
            assertThat(result.get(i).id(), equalTo((long) i + 1));
            assertThat(result.get(i).name(), equalTo(poiNames.get(i)));
            assertThat(result.get(i).description(), equalTo(poiDescriptions.get(i)));
        }

        for (PointOfInterestDTO poi : result) {
            assertNotNull(poi.images());
            assertFalse(poi.images().isEmpty());
            for (ImageDTO image : poi.images()) {
                assertTrue(image.id() > 0);
            }
        }
    }

    @Test
    @DisplayName("Checks if pageable point of interest endpoint works properly")
    void pageablePoisNoAuthE2ETest() {
        String userToken = getUserAuthToken();

        given()
                .cookie("AuthToken", userToken)
                .when()
                .get("/api/v1/point-of-interest/?page=0&size=2")
                .then()
                .statusCode(403);
    }

    @AfterEach
    void tearDown() {
        jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE point_of_interest RESTART IDENTITY CASCADE");
    }
}
