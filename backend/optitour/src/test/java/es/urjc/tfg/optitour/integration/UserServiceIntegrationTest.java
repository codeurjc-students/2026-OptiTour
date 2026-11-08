package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
import es.urjc.tfg.optitour.DTO.PasswordEditDTO;
import es.urjc.tfg.optitour.DTO.UserCreateDTO;
import es.urjc.tfg.optitour.DTO.UserEditDTO;
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

        for (int i = 0; i < 3; i++) {
            repository.save(
                    new User("example" + i + "@example.com", encoder.encode("demo1234"), "example" + i, "111 111 111",
                            false, "USER"));
        }
    }

    private long getFirstId() {
        List<User> all = new ArrayList<>();
        all = repository.findAll();
        return all.get(0).getId();
    }

    @Test
    @DisplayName("getUserByEmail method should return the corresponding user")
    void getUserByEmailTest() {
        User result = service.getUserByEmail("example1@example.com");

        assertEquals(result.getUserName(), "example1");
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
        User result = service.getUserById(getFirstId());

        assertNotNull(result);
        assertEquals("example0@example.com", result.getEmail());
        assertEquals("example0", result.getUserName());
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
    @DisplayName("signupUser should save user in repository and must be possible recovering it")
    public void signupUserIntegrationTest() {
        service.signupUser(
                new UserCreateDTO("other@example.com", "111 111 111", "other", "Demo1234"), "USER");

        User recoverUser = service.getUserByEmail("other@example.com");
        assertNotNull(recoverUser);
        assertEquals("other", recoverUser.getUserName());
    }

    @Test
    @DisplayName("addImageToUser should save imageFile in database")
    public void addImageToUserIntegrationTest() throws SerialException, SQLException {
        // Given: we need first user id (it's no deterministic because of before each
        // method)
        long firstId = getFirstId();

        // We also need a fake blob for image
        Blob imageFile = new SerialBlob("fake image".getBytes(StandardCharsets.UTF_8));
        Image image = new Image();
        image.setImageFile(imageFile);

        service.addImageToUser(firstId, image, "example0@example.com");

        User testUser = service.getUserByEmail("example0@example.com");

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
        service.signupUser(
                new UserCreateDTO("other@example.com", "111 111 111", "other", "Demo1234"), "USER");

        // We asume that logged user is the first one saved in database
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.addImageToUser(getFirstId(), null, "other@example.com");
        });

        assertEquals("403 FORBIDDEN \"No tienes permiso para modificar la imagen de perfil de otros usuarios.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("verifyUniqueEmail with repeated email should throw exception")
    public void UniqueEmailIntegrationTest() {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.validateUniqueEmail("example1@example.com");
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
            service.validateUniqueUserName("example1");
        });

        assertEquals(
                "400 BAD_REQUEST \"El nombre de usuario escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro nombre de usuario e inténtalo de nuevo.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("getAllUsers method should return all users in database")
    public void getAllUsersIntegrationTest() {
        List<User> allUsers = new ArrayList<>();
        allUsers = service.getAllUsers();

        assertEquals(3, allUsers.size());

        for (int i = 0; i < 3; i++) {
            assertEquals("example" + i + "@example.com", allUsers.get(i).getEmail());
        }
    }

    @Test
    @DisplayName("getAllUsers method should throw if there is no users")
    public void getAllUsersWithNoUsersIntegrationTest() {
        repository.deleteAll();

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service.getAllUsers();
        });

        assertEquals(e.getMessage(), "404 NOT_FOUND \"No hay ningún usuario registrado.\"");
    }

    @Test
    @DisplayName("deleteById method should delete user with correct pass")
    public void deleteUserByIdIntegrationTest() {
        long firstId = getFirstId();
        User targetUser = service.getUserById(firstId);
        service.deleteUserById(targetUser.getEmail(), "demo1234");

        List<User> remainingUsers = new ArrayList<>();
        remainingUsers = service.getAllUsers();

        assertEquals(2, remainingUsers.size());

        int i = 1;
        for (User u : remainingUsers) {
            assertEquals("example" + i + "@example.com", u.getEmail());
            i++;
        }

        assertTrue(repository.findById(firstId).isEmpty());
    }

    @Test
    @DisplayName("editLoggedUser method should update user in database")
    public void editLoggedUserIntegrationTest() {
        long targetId = service.getUserByEmail("example0@example.com").getId();
        UserEditDTO editedUser = new UserEditDTO("updated@example.com", "111 111 111", "updated");
        service.editLoggedUser("example0@example.com", editedUser);

        User updatedUser = service.getUserById(targetId);
        assertEquals(editedUser.email(), updatedUser.getEmail());
        assertEquals(editedUser.phoneNumber(), updatedUser.getPhoneNumber());
        assertEquals(editedUser.userName(), updatedUser.getUserName());
    }

    @Test
    @DisplayName("editLoggedPassword should change logged user password in database")
    public void editLoggedPasswordIntegrationTest() {
        long targetId = getFirstId();
        User targetUser = service.getUserById(targetId);

        service.editLoggedPassword(targetUser.getEmail(),
                new PasswordEditDTO("demo1234", "Edited1234"));

        User editedUser = service.getUserById(targetId);
        assertTrue(service.checkUserPassword(editedUser, "Edited1234"));
    }
}