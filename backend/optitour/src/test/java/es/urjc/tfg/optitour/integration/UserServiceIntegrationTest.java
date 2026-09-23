package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;
import es.urjc.tfg.optitour.service.UserService;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
public class UserServiceIntegrationTest {
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
        assertThrows(ResponseStatusException.class, () -> {
            User result = service.getUserByEmail("bademail@example.com");
            assertNull(result);
        });
    }
}
