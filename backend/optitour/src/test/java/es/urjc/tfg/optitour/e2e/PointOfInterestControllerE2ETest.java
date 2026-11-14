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
import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.DTO.PointOfInterestDTO;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.ImageRepository;
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
        private ImageRepository imageRepository;

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

                User adminUser = new User("admin@optitour.com", passwordEncoder.encode("Admin1234"), "admin",
                                "111 111 111",
                                false, "USER", "ADMIN");
                userRepository.save(adminUser);

                User newUser = new User("example@example.com", passwordEncoder.encode("demo1234"), "example",
                                "111 111 111",
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

                        PointOfInterest poi = new PointOfInterest(name, desc, "sample city", "sample address",
                                        "sample coords");
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
                assertEquals("sample city", result.city());
                assertEquals("sample address", result.address());
                assertEquals("sample coords", result.coords());
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
                        assertThat(result.get(i).city(), equalTo("sample city"));
                        assertThat(result.get(i).address(), equalTo("sample address"));
                        assertThat(result.get(i).coords(), equalTo("sample coords"));
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
        @DisplayName("createPoi controller should make a POST request and create a new poi")
        public void createPoiE2ETest() {
                String adminToken = getAdminAuthToken();

                PointOfInterestDTO result = given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(new PointOfInterestCreateDTO("New POI", "New POI desc", "Test city",
                                                "Test Address",
                                                "1.11111,1.11111"))
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(201)
                                .extract().as(PointOfInterestDTO.class);

                // We check if both DTO and domain object are correct
                assertNotNull(result);
                assertEquals("New POI", result.name());
                assertEquals("New POI desc", result.description());
                assertEquals("Test city", result.city());
                assertEquals("Test Address", result.address());
                assertEquals("1.11111,1.11111", result.coords());

                PointOfInterest createdPoiObject = repository.findByName("New POI").get();
                assertNotNull(createdPoiObject);
                assertEquals("New POI", createdPoiObject.getName());
                assertEquals("New POI desc", createdPoiObject.getDescription());
                assertEquals("Test city", createdPoiObject.getCity());
                assertEquals("Test Address", createdPoiObject.getAddress());
                assertEquals("1.11111,1.11111", createdPoiObject.getCoords());
        }

        @Test
        @DisplayName("uploading multiple images to a poi should return and persist all images")
        void uploadMultipleImagesToPoiE2ETest() {
                String adminToken = getAdminAuthToken();
                long firstId = getFirstId();
                byte[] firstImage = { 4, 5, 6 };
                byte[] secondImage = { 7, 8, 9 };

                ImageDTO[] result = given()
                                .cookie("AuthToken", adminToken)
                                .multiPart("file", "first-image.jpg", firstImage, "image/jpeg")
                                .multiPart("file", "second-image.jpg", secondImage, "image/jpeg")
                                .when()
                                .post("/api/v1/point-of-interest/" + firstId + "/image")
                                .then()
                                .statusCode(201)
                                .extract().as(ImageDTO[].class);

                assertNotNull(result);
                assertEquals(2, result.length);
                assertTrue(result[0].id() > 0);
                assertTrue(result[1].id() > 0);

                Image firstCreatedImage = imageRepository.findById(result[0].id()).orElseThrow();
                Image secondCreatedImage = imageRepository.findById(result[1].id()).orElseThrow();
                assertEquals(firstId, firstCreatedImage.getPoi().getId());
                assertEquals(firstId, secondCreatedImage.getPoi().getId());
        }

        // ---------------- FIELD VALIDATION TESTS --------------------------------

        // ---------------- NAME VALIDATION TESTS --------------------------------

        @Test
        @DisplayName("create poi with blank name should return 400 status code")
        void blankNameCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "", "New POI desc", "Test city", "Test Address", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("El nombre es obligatorio"));
        }

        @Test
        @DisplayName("create poi with more than 30 characters in name should return 400 status code")
        void tooMuchCharsNameCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "a".repeat(31), "New POI desc", "Test city", "Test Address", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("El nombre no puede superar los 30 caracteres"));
        }

        // ---------------- DESCRIPTION VALIDATION TESTS
        // --------------------------------

        @Test
        @DisplayName("create poi with blank description should return 400 status code")
        void blankDescriptionCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "", "Test city", "Test Address", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("La descripción es obligatoria"));
        }

        @Test
        @DisplayName("create poi with more than 300 characters in description should return 400 status code")
        void tooMuchCharsDescriptionCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "a".repeat(301), "Test city", "Test Address", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("La descripción no puede superar los 300 caracteres"));
        }

        // ---------------- CITY VALIDATION TESTS --------------------------------

        @Test
        @DisplayName("create poi with blank city should return 400 status code")
        void blankCityCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "New POI desc", "", "Test Address", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("La ciudad es obligatoria"));
        }

        @Test
        @DisplayName("create poi with more than 30 characters in city should return 400 status code")
        void tooMuchCharsCityCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "New POI desc", "a".repeat(31), "Test Address", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("La ciudad no puede superar los 30 caracteres"));
        }

        // ---------------- ADDRESS VALIDATION TESTS --------------------------------

        @Test
        @DisplayName("create poi with blank address should return 400 status code")
        void blankAddressCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "New POI desc", "Test city", "", "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("La dirección es obligatoria"));
        }

        @Test
        @DisplayName("create poi with more than 60 characters in address should return 400 status code")
        void tooMuchCharsAddressCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "New POI desc", "Test city", "a".repeat(61), "1.11111,1.11111");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("La dirección no puede superar los 60 caracteres"));
        }

        // ---------------- COORDINATES VALIDATION TESTS
        // --------------------------------

        @Test
        @DisplayName("create poi with blank coordinates should return 400 status code")
        void blankCoordsCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "New POI desc", "Test city", "Test Address", "");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo("Las coordenadas son obligatorias"));
        }

        @Test
        @DisplayName("create poi with invalid coordinates should return 400 status code")
        void invalidCoordsCreatePoiE2ETest() {
                String adminToken = getAdminAuthToken();
                PointOfInterestCreateDTO dto = new PointOfInterestCreateDTO(
                                "New POI", "New POI desc", "Test city", "Test Address", "invalid");

                given()
                                .cookie("AuthToken", adminToken)
                                .contentType(ContentType.JSON)
                                .body(dto)
                                .when()
                                .post("/api/v1/point-of-interest/")
                                .then()
                                .statusCode(400)
                                .body("message", equalTo(
                                                "El formato debe ser 'latitud,longitud' con decimales (ej: 40.4137818,-3.6921271)"));
        }

        @AfterEach
        void tearDown() {
                jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY CASCADE");
                jdbcTemplate.execute("TRUNCATE TABLE point_of_interest RESTART IDENTITY CASCADE");
        }
}
