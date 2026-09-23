package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.security.jwt.LoginRequest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthE2ETest extends BaseIntegrationTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @LocalServerPort
    private int port;

    private String getAuthCookie(String email, String pass) {
        return given()
                .contentType("application/json")
                .body(new LoginRequest(email, pass))
                .when()
                .post("api/v1/auth/login")
                .getCookie("AuthToken");
    }

    private String getRefreshCookie(String email, String pass) {
        return given()
                .contentType(ContentType.JSON)
                .body(new LoginRequest(email, pass))
                .when()
                .post("/api/v1/auth/login")
                .getCookie("RefreshToken");
    }

    @BeforeEach
    void setUp() { // Given: We setup an example user in testcontainers database
        RestAssured.port = port;
        RestAssured.baseURI = "https://localhost";
        RestAssured.useRelaxedHTTPSValidation();
        userRepository.deleteAll();

        userRepository.save(
                new User("example@example.com", encoder.encode("demo1234"), "example", "111 111 111", false, "USER"));
    }

    @Test
    @DisplayName("Calling api at /auth/login with correct credentials should return a success message")
    void loginTest() {
        LoginRequest credentials = new LoginRequest("example@example.com", "demo1234");
        given()
                // We configure the POST petition:
                .contentType(ContentType.JSON)
                // We send correct credentials
                .body(credentials)
                .when()
                .post("/api/v1/auth/login")
                .then()
                .statusCode(200) // We check if login was correct with success code (200)
                .body("status", equalTo("SUCCESS")) // We check status field in received json
                .cookie("AuthToken") // We check the received cookie
                .extract().response();
    }

    @Test
    @DisplayName("Calling logout endpoint should invalidate session and delete cookies")
    void logoutTest() {
        // Given: we make a login and get cookies
        String authCookie = getAuthCookie("example@example.com", "demo1234");

        // When: We call the api inyecting cookie
        given()
                .cookie("AuthToken", authCookie)
                .when()
                .post("/api/v1/auth/logout")
                // Then: we check success code and deletedCookie
                .then()
                .statusCode(200)
                .cookie("AuthToken", equalTo(""));
    }

    @Test
    @DisplayName("calling refresh endpoint with valid refresh token should return a new auth token")
    void refreshTest() {
        // Given: We make a login and get the refresh cookie
        String refreshToken = getRefreshCookie("example@example.com", "demo1234");

        // When: we call the api inyecting cookie
        given()
                .cookie("RefreshToken", refreshToken)
                .when()
                .post("/api/v1/auth/refresh")
                // Then: we check sucess code and new cookie
                .then()
                .statusCode(200)
                .cookie("AuthToken");
    }

}
