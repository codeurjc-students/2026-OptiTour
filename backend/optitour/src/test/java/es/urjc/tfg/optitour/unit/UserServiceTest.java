package es.urjc.tfg.optitour.unit;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.service.UserService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class UserServiceTest {

    UserRepository repositoryMock;
    UserService testService;
    User testUser;

    @BeforeEach
    void setUpMocks() {
        // Given: Set up mocks and sample data
        repositoryMock = mock(UserRepository.class);
        testService = new UserService(repositoryMock);

        testUser = new User("example@example.com", "demo1234", "example", "111 111 111", false, "USER");
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

        assertEquals("404 NOT_FOUND \"User with email bademail@example.com wasn't found.\"", ex.getMessage());
    }
}
