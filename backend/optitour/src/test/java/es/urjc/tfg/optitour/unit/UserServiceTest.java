package es.urjc.tfg.optitour.unit;

import static org.mockito.ArgumentMatchers.any;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.DTO.UserEditDTO;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.service.UserService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class UserServiceTest {

    UserRepository repositoryMock;
    UserService testService;
    User testUser, testAdmin;
    PasswordEncoder encoder = new BCryptPasswordEncoder();;

    @BeforeEach
    void setUpMocks() throws SerialException, SQLException {
        // Given: Set up mocks and sample data
        repositoryMock = mock(UserRepository.class);
        testService = new UserService(repositoryMock, encoder);

        testUser = new User("example@example.com", encoder.encode("demo1234"), "example", "111 111 111", false,
                "USER");
        testAdmin = new User("admin@optitour.com", encoder.encode("admin1234"), "admin", "111 111 111", false,
                "USER", "ADMIN");
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

    @Test
    @DisplayName("Test user creation with repeated email")
    public void testUniqueEmail() {
        // Given: we have one user saved (see before each method)
        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        // When: we verify this email exists. Then: exception shouls be thrown

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.validateUniqueEmail("example@example.com");
        });

        assertEquals(
                "400 BAD_REQUEST \"El correo electrónico escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro correo electrónico e inténtalo de nuevo.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("Test user creation with repeated user")
    public void testUniqueUsername() {
        when(repositoryMock.findByUserName("example")).thenReturn(Optional.of(testUser));

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.validateUniqueUserName("example");
        });

        assertEquals(
                "400 BAD_REQUEST \"El nombre de usuario escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro nombre de usuario e inténtalo de nuevo.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("changeIsUserBanner should negate current is banned state in a user")
    public void changeIsUserBannerTest() {
        when(repositoryMock.findById(1)).thenReturn(Optional.of(testUser));

        User result = testService.changeIsUserBanned(1);

        assertTrue(result.getIsBanned());
    }

    @Test
    @DisplayName("changeIsUserBanner should throw exception if user is admin")
    public void changeIsAdminBannedTest() {
        when(repositoryMock.findById(2)).thenReturn(Optional.of(testAdmin));

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.changeIsUserBanned(2);
        });

        assertEquals("403 FORBIDDEN \"No puedes bloquear la cuenta de un administrador.\"", e.getMessage());
    }

    @Test
    @DisplayName("checkUserPassword method should determine properly if a password is correct for a user")
    public void checkUserPasswordTest() {
        assertTrue(testService.checkUserPassword(testUser, "demo1234"));
    }

    @Test
    @DisplayName("checkUserPassword method should determine properly if a password is not correct for a user or not")
    public void checkUserIncorrectPasswordTest() {
        assertFalse(testService.checkUserPassword(testUser, "Admin1234"));
    }

    @Test
    @DisplayName("deleteUserById should throw if password is incorrect")
    public void deleteUserByIdIncorrectPasswordTest() {
        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.deleteUserById("example@example.com", "incorrectPass");
        });

        assertEquals("403 FORBIDDEN \"La contraseña no es correcta.\"", e.getMessage());
    }

    @Test
    @DisplayName("deleteUserById should throw if want to delete the unique admin account available")
    public void deleteUserByIdUniqueAdminTest() {
        when(repositoryMock.findByEmail("admin@optitour.com")).thenReturn(Optional.of(testAdmin));
        when(repositoryMock.countByRoles("ADMIN")).thenReturn(1);

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.deleteUserById("admin@optitour.com", "admin1234");
        });

        assertEquals("403 FORBIDDEN \"No puedes eliminar esta cuenta de administrador porque es la única disponible\"",
                e.getMessage());
    }

    @Test
    @DisplayName("deleteUserById should delete an admin if there are more than one admin")
    public void deleteUserByIdSeveralAdminsTest() {
        when(repositoryMock.findByEmail("admin@optitour.com")).thenReturn(Optional.of(testAdmin));
        when(repositoryMock.countByRoles("ADMIN")).thenReturn(2);

        testService.deleteUserById("admin@optitour.com", "admin1234");

        verify(repositoryMock).delete(any(User.class));
    }

    @Test
    @DisplayName("editLoggeduser should throw exception if new email is already in database")
    public void editLoggedUserRepeatedEmailTest() {
        when(repositoryMock.findByEmail("admin@optitour.com")).thenReturn(Optional.of(testAdmin));
        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        UserEditDTO editedUser = new UserEditDTO("admin@optitour.com", "", "example");

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.editLoggedUser("example@example.com", editedUser);
        });

        assertEquals(
                "400 BAD_REQUEST \"El correo electrónico escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro correo electrónico e inténtalo de nuevo.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("editLoggeduser should throw exception if new email is already in database")
    public void editLoggedUserRepeatedUsernameTest() {
        when(repositoryMock.findByUserName("admin")).thenReturn(Optional.of(testAdmin));
        when(repositoryMock.findByUserName("example")).thenReturn(Optional.of(testUser));
        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        UserEditDTO editedUser = new UserEditDTO("example@example.com", "", "admin");

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            testService.editLoggedUser("example@example.com", editedUser);
        });

        assertEquals(
                "400 BAD_REQUEST \"El nombre de usuario escogido ya está siendo utilizado por otro usuario.\n"
                        + "Introduce otro nombre de usuario e inténtalo de nuevo.\"",
                e.getMessage());
    }

    @Test
    @DisplayName("editLoggedUser should call svae method in repository with correct data an return updated user")
    public void editLoggedUserTest() {
        when(repositoryMock.findByEmail("example@example.com")).thenReturn(Optional.of(testUser));

        UserEditDTO editedUser = new UserEditDTO("updated@example.com", "111 111 111", "updated");
        User updatedUser = testService.editLoggedUser("example@example.com", editedUser);

        verify(repositoryMock).save(any(User.class));

        assertEquals(editedUser.email(), updatedUser.getEmail());
        assertEquals(editedUser.phoneNumber(), updatedUser.getPhoneNumber());
        assertEquals(editedUser.userName(), updatedUser.getUserName());
    }
}