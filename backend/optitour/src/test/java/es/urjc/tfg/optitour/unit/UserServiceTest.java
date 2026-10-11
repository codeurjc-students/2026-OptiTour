package es.urjc.tfg.optitour.unit;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;
import java.sql.Blob;
import javax.sql.rowset.serial.SerialException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.service.UserService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class UserServiceTest {

    UserRepository repositoryMock;
    UserService testService;
    User testUser;

    @BeforeEach
    void setUpMocks() throws SerialException, SQLException {
        // Given: Set up mocks and sample data
        repositoryMock = mock(UserRepository.class);
        testService = new UserService(repositoryMock);

        testUser = new User("example@example.com", "demo1234", "example", "111 111 111", false,
                "USER");
    }

    @Test
    @DisplayName("getUserByEmail with correct email should return the user with the specified email")
    void getUserByEmailTest() {
        // Given: Al mocks are created and we configure the method with a correct email

        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        // When: We call the method with correct email
        User result = testService.getUserByEmail("example@example.com");

        // Then: User must be the one that has the required email
        assertEquals(result.getUserName(), "example");
        assertEquals(result.getPassword(), "demo1234");
        assertEquals(result.getPhoneNumber(), "111 111 111");
    }

    @Test
    @DisplayName("getUserByEmail with incorrect email should throw a ResponseStatusException")
    void voidGetUserByBadEmailTest() {
        // When: We call the method with an incorrect email
        // Then: An exception must be thrown

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            testService.getUserByEmail("bademail@example.com");
        });

        assertEquals("404 NOT_FOUND \"No se encontró el usuario con el email bademail@example.com\"", ex.getMessage());
    }

    @Test
    @DisplayName("getUserById with correct id should return the correct user")
    public void getUserByIdTest() {
        // Given: For this test we'll asume that testUser has id 1:
        when(repositoryMock.findById(1)).thenReturn(Optional.of(testUser));

        // When: We call getUserById service method
        User result = testService.getUserById(1);

        // Then: received user is not null and has correct data
        assertNotNull(result);
        assertEquals("example@example.com", result.getEmail());
        assertEquals("example", result.getUserName());
    }

    @Test
    @DisplayName("getUserById with incorrect id throws execption")
    public void getUserByIdBadIdTest() {
        // When: We call getUserById service method
        // Then: It should throw an exception
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.getUserById(2);
        });

        assertEquals("404 NOT_FOUND \"No se encontró el usuario con el id 2\"", e.getMessage());
    }

    @Test
    @DisplayName("saveUser should call repository save method")
    public void saveUserTest() {
        // When: We call the save service method
        testService.saveUser(testUser);

        // Then: repository method must've been called
        verify(repositoryMock).save(testUser);
    }

    @Test
    @DisplayName("addImagetoUser should save image file")
    public void addImageToUserTest() throws SQLException {
        // Given: we have a user and a bytes array
        when(repositoryMock.findById(1)).thenReturn(Optional.of(testUser));
        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        Blob imageFile = new SerialBlob("fake image".getBytes(StandardCharsets.UTF_8));
        Image image = new Image();
        image.setImageFile(imageFile);

        // When: we call add image service method
        testService.addImageToUser(1, image, "example@example.com");

        // Then: the image must be assigned to the user and the user must be saved
        assertEquals("fake image", new String(
                testUser.getProfileImage().getBytes(1, (int) testUser.getProfileImage().length()),
                StandardCharsets.UTF_8));
        verify(repositoryMock).save(testUser);
    }

    @Test
    @DisplayName("addImageToUser with incorrect id should throw exception")
    public void addImageToUserTestBadIdTest() {
        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.addImageToUser(2, null, null);
        });

        assertEquals("404 NOT_FOUND \"No se encuentra ningún usuario con el id 2 al que añadir la imagen.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("addImageToUser with other user email should throw exception")
    public void addImageToUserBadEmailTest() {
        when(repositoryMock.findById(1)).thenReturn(Optional.of(testUser));
        when(repositoryMock.findByEmail("other@example.com")).thenReturn(Optional.of(
                new User("other@example.com", "demo1234", "example", "111 111 111", false,
                        "USER")));

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.addImageToUser(1, null, "other@example.com");
        });

        assertEquals("403 FORBIDDEN \"No tienes permiso para modificar la imagen de perfil de otros usuarios.\"",
                e.getMessage());
    }
}
