package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.hamcrest.Matchers.equalTo;

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
import es.urjc.tfg.optitour.DTO.UserCreateDTO;
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
        UserCreateDTO newUser = new UserCreateDTO(
                "other@example.com",
                "111 111 111",
                "other",
                "Demo1234");

        UserDTO createdDTO = given()
                .contentType(ContentType.JSON)
                .body(newUser)
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

    // FIELD VALIDATION TESTS

    @Test
    @DisplayName("signup user with blank email should return 400 status code")
    public void blankEmailSingupE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "",
                "111 111 111",
                "example",
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El correo electrónico es obligatorio."));
    }

    @Test
    @DisplayName("signup user with invalid email should return 400 status code")
    public void invalidEmailSingupE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "invalid",
                "111 111 111",
                "example",
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El correo electrónico debe tener un formato válido con un carácter '@'."));
    }

    @Test
    @DisplayName("signup user with 30+ character email should return 400 status code")
    public void thirtyCharsEmailSingupE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "aaaaaasaaaaaaaa@aaaaaaaaaaa.com", // Email with 31 characters
                "111 111 111",
                "example",
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El correo electrónico no puede superar los 30 caracteres."));
    }

    @Test
    @DisplayName("signup user with 12+ character phone should return 400 status code")
    public void twelveCharPhoneE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111 111 111", // Phone with 15 characters
                "example",
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El teléfono no puede superar los 12 caracteres."));
    }

    @Test
    @DisplayName("signup user with phone with non-number chars should return 400 status code")
    public void notNumberPhoneE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "invalid", // Phone with 15 characters
                "example",
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El teléfono solo puede contener números, espacios y opcionalmente el símbolo '+' al inicio."));
    }

    @Test
    @DisplayName("signup user with blank username should return 400 status code")
    public void notBlankUserE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "",
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El nombre de usuario es obligatiorio"));
    }

    @Test
    @DisplayName("signup user with 5- char username should return 400 status code")
    public void tooFewCharsUsernameE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "inv", // username with 3 characters
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El nombre de usuario debe tener entre 5 y 20 caracteres."));
    }

    @Test
    @DisplayName("signup user with 20+ char username should return 400 status code")
    public void tooMuchCharsUsernameE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "invalidinvalidinvalid", // username with 21 characters
                "Demo1234");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "El nombre de usuario debe tener entre 5 y 20 caracteres."));
    }

    @Test
    @DisplayName("signup user with blank password should return 400 status code")
    public void blankPasswordE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "example",
                "");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "La contraseña es obligatoria"));
    }

    @Test
    @DisplayName("signup user with 8- char password should return 400 status code")
    public void tooFewCharPasswordE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "example",
                "inv"); // 3 char password
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "La contraseña debe tener entre 8 y 20 caracteres"));
    }

    @Test
    @DisplayName("signup user with 8- char password should return 400 status code")
    public void tooMuchCharPasswordE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "example",
                "invalidinvalidinvalI1"); // 21 characteres password
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "La contraseña debe tener entre 8 y 20 caracteres"));
    }

    @Test
    @DisplayName("signup user with password with no capital letter and not numbers should return 400 status code")
    public void noSecurePasswordE2ETest() {
        UserCreateDTO dto = new UserCreateDTO(
                "example@example.com",
                "111 111 111",
                "example",
                "insecurepassword");
        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/api/v1/user/")
                .then()
                .statusCode(400)
                .body("message", equalTo(
                        "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número."));
    }
}
