package es.urjc.tfg.optitour.e2e;

import java.sql.SQLException;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.repository.ImageRepository;
import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ImageControllerE2ETest extends BaseIntegrationTest {
    @Autowired
    private ImageRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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

        byte[] bytes = { 1, 2, 3 };
        Image image = new Image();
        image.setImageFile(new SerialBlob(bytes));

        repository.save(image);
    }

    @Test
    @DisplayName("Check if getImageFile endpoint works properly. If id is correct, 200 ok and binary data should be returned")
    void getImageFileE2ETest() {
        List<Image> allList = repository.findAll();
        long firstId = allList.get(0).getId();
        byte[] result = get("/api/v1/image/" + firstId)
                .then()
                .statusCode(200)
                .extract().asByteArray();

        assertNotNull(result);
        assertArrayEquals(new byte[] { 1, 2, 3 }, result);
    }

    @Test
    @DisplayName("Check if getImageFile endpoint responds with 404 code with incorrect id")
    void getImageFileIncorrectIdE2ETest() {
        get("/api/v1/image/1000000")
                .then()
                .statusCode(404);
    }
}
