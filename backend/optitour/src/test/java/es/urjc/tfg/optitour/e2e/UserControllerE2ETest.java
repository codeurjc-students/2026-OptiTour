package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.nio.charset.StandardCharsets;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.DTO.UserDTO;
import es.urjc.tfg.optitour.DTO.ImageDTO;
import es.urjc.tfg.optitour.mapper.UserMapper;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.security.jwt.LoginRequest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerE2ETest extends BaseIntegrationTest {
    @Autowired
    private UserRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserMapper mapper;

    @LocalServerPort
    private int port;

    @BeforeEach
    void setup() throws SerialException, SQLException {
        RestAssured.port = port;
        RestAssured.baseURI = "https://localhost";
        RestAssured.useRelaxedHTTPSValidation();
        jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY CASCADE");
        jdbcTemplate.execute("TRUNCATE TABLE point_of_interest RESTART IDENTITY CASCADE");

        repository.deleteAll();

        User newUser = new User("example@example.com", encoder.encode("demo1234"), "example", "111 111 111", false,
                "USER");

        Blob imageFile = new SerialBlob("fake image".getBytes(StandardCharsets.UTF_8));
        newUser.setProfileImage(imageFile);

        repository.save(newUser);
    }

    @Test
    @DisplayName("Calling api at /user/{id}/image should return correct user id")
    public void downloadImageTestE2ETest() {
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        long firstId = all.get(0).getId();

        byte[] result = get("/api/v1/user/" + firstId + "/image")
                .then()
                .statusCode(200)
                .extract().asByteArray();

        assertNotNull(result);
        assertArrayEquals("fake image".getBytes(StandardCharsets.UTF_8), result);
    }

    @Test
    @DisplayName("Calling api at /user/{id}/image with incorrect id should respond with 404")
    public void downloadImageTestBadIdE2ETest() {
        get("/api/v1/user/1000/image")
                .then()
                .statusCode(404);
    }

    @Test
    @DisplayName("Posting at /user should create a new user")
    public void signUpE2ETest() throws SerialException, SQLException {
        User newUser = new User("other@example.com", encoder.encode("demo1234"), "other", "111 111 111", false,
                "USER");

        UserDTO createdDTO = given()
                .contentType(ContentType.JSON)
                .body(mapper.toDTO(newUser))
                .when()
                .post("api/v1/user/")
                .then()
                .statusCode(201)
                .extract().as(UserDTO.class);

        Optional<User> createdOp = repository.findById(createdDTO.id());
        User created = createdOp.get();

        assertNotNull(created);
        assertEquals("other@example.com", created.getEmail());
        assertEquals("other", created.getUserName());
    }

    @Test
    @DisplayName("Posting at /user/{id}/image should create a new profile image in correct user")
    public void uploadImageE2ETest() throws SerialException, SQLException {
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        long firstId = all.get(0).getId();

        // It's necessary to be logged in in order to upload images
        LoginRequest credentials = new LoginRequest("example@example.com", "demo1234");
        String authToken = given()
                .contentType(ContentType.JSON)
                .body(credentials)
                .when()
                .post("api/v1/auth/login")
                .then()
                .statusCode(200)
                .extract().cookie("AuthToken");

        ImageDTO result = given()
                .cookie("AuthToken", authToken)
                .multiPart("file", "profile-image.jpg",
                        "new image".getBytes(StandardCharsets.UTF_8), "image/jpeg")
                .when()
                .post("/api/v1/user/" + firstId + "/image")
                .then()
                .statusCode(201)
                .extract().as(ImageDTO.class);

        assertNotNull(result);
        User user = repository.findById(firstId).get();
        assertNotNull(user.getProfileImage());
    }

    @Test
    @DisplayName("Posting at /user/{id}/image with bad id should response with 404")
    public void uploadImageBadIdE2ETest() {
        LoginRequest credentials = new LoginRequest("example@example.com", "demo1234");
        String authToken = given()
                .contentType(ContentType.JSON)
                .body(credentials)
                .when()
                .post("api/v1/auth/login")
                .then()
                .statusCode(200)
                .extract().cookie("AuthToken");

        given()
                .cookie("AuthToken", authToken)
                .multiPart("file", "profile-image.jpg",
                        "new image".getBytes(StandardCharsets.UTF_8), "image/jpeg")
                .when()
                .post("/api/v1/user/1000/image")
                .then()
                .statusCode(404);
    }

    @Test
    @DisplayName("Posting at /user/{id}/image with empty image should respond with 400")
    public void uploadImageEmptyImageE2ETest() {
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        long firstId = all.get(0).getId();

        LoginRequest credentials = new LoginRequest("example@example.com", "demo1234");
        String authToken = given()
                .contentType(ContentType.JSON)
                .body(credentials)
                .when()
                .post("api/v1/auth/login")
                .then()
                .statusCode(200)
                .extract().cookie("AuthToken");

        given()
                .cookie("AuthToken", authToken)
                .multiPart("file", "empty-image.jpg", new byte[0], "image/jpeg")
                .when()
                .post("/api/v1/user/" + firstId + "/image")
                .then()
                .statusCode(400);
    }
}
