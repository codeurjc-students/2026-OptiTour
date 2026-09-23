package es.urjc.tfg.optitour.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) throws ResponseStatusException {
        Optional<User> op = userRepository.findByEmail(email);

        if (op.isPresent()) {
            User user = op.get();
            return user;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "User with email " + email + " wasn't found.");
    }
}
