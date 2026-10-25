package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import java.sql.Blob;
import java.sql.SQLException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.service.UserService;
import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class UserServiceIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private UserService service;

    @Autowired
    private UserRepository repository;

    @Autowired
    PasswordEncoder encoder;

    @BeforeEach
    public void initSampleData() {
        repository.deleteAll();

        repository.save(
                new User("example@example.com", encoder.encode("demo1234"), "example", "111 111 111", false, "USER"));
    }

    @Test
    @DisplayName("getUserByEmail method should return the corresponding user")
    void getUserByEmailTest() {
        User result = service.getUserByEmail("example@example.com");

        assertEquals(result.getUserName(), "example");
        assertEquals(result.getPhoneNumber(), "111 111 111");
        assertFalse(result.getIsBanned());
    }

    @Test
    @DisplayName("getUserByEmail method shouldn't return any user if email doesn't exist")
    void getUserByBadEmailTest() {
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            User result = service.getUserByEmail("bademail@example.com");
            assertNull(result);
        });

        assertEquals("404 NOT_FOUND \"No se encontró el usuario con el email bademail@example.com\"", ex.getMessage());
    }

    @Test
    @DisplayName("getUserById with correct id should return correct user")
    public void getUserByIdIntegrationTest() {
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        long firstId = all.get(0).getId();
        User result = service.getUserById(firstId);

        assertNotNull(result);
        assertEquals("example@example.com", result.getEmail());
        assertEquals("example", result.getUserName());
    }

    @Test
    @DisplayName("getUserById with incorrect id should throw exception")
    public void getUserByIdIncorrectidIntegrationTest() {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.getUserById(1000);
        });

        assertEquals("404 NOT_FOUND \"No se encontró el usuario con el id 1000\"", e.getMessage());
    }

    @Test
    @DisplayName("saveUser should save user in repository and must be possible recovering it")
    public void saveUserIntegrationTest() {
        service.saveUser(
                new User("other@example.com", encoder.encode("demo1234"), "other", "111 111 111", false, "USER"));

        User recoverUser = service.getUserByEmail("other@example.com");
        assertNotNull(recoverUser);
        assertEquals("other", recoverUser.getUserName());
    }

    @Test
    @DisplayName("addImageToUser should save imageFile in database")
    public void addImageToUserIntegrationTest() throws SerialException, SQLException {
        // Given: we need first user id (it's no deterministic because of before each
        // method)
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        long firstId = all.get(0).getId();

        // We also need a fake blob for image
        Blob imageFile = new SerialBlob("fake image".getBytes(StandardCharsets.UTF_8));
        Image image = new Image();
        image.setImageFile(imageFile);

        service.addImageToUser(firstId, image, "example@example.com");

        User testUser = service.getUserByEmail("example@example.com");

        assertEquals("fake image", new String(
                testUser.getProfileImage().getBytes(1, (int) testUser.getProfileImage().length()),
                StandardCharsets.UTF_8));
    }

    @Test
    @DisplayName("addImageToUser with incorrect id should throw exception")
    public void addImageToUserBadIdIntegrationTest() {
        Exception e = assertThrows(ResponseStatusException.class, () -> {
            service.addImageToUser(1000, null, null);
        });

        assertEquals("404 NOT_FOUND \"No se encuentra ningún usuario con el id 1000 al que añadir la imagen.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("addImageToUser with other user's email should trhow exception")
    public void addImageToUserOtherEmailIntegrationTest() {
        // We asume that logged user is the first one saved in database
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        long firstId = all.get(0).getId();

        service.saveUser(
                new User("other@example.com", encoder.encode("demo1234"), "other", "111 111 111", false, "USER"));

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.addImageToUser(firstId, null, "other@example.com");
        });

        assertEquals("403 FORBIDDEN \"No tienes permiso para modificar la imagen de perfil de otros usuarios.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("verifyUniqueEmail with repeated email should throw exception")
    public void UniqueEmailIntegrationTest() {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.validateUniqueEmail("example@example.com");
        });

        assertEquals(
                "400 BAD_REQUEST \"El correo electrónico escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro correo electrónico e inténtalo de nuevo.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("verifyUniqueUser with repeated username should throw exception")
    public void UniqueUserIntegrationTest() {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.validateUniqueUserName("example");
        });

        assertEquals(
                "400 BAD_REQUEST \"El nombre de usuario escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro nombre de usuario e inténtalo de nuevo.\"",
                e.getMessage());
    }

}
