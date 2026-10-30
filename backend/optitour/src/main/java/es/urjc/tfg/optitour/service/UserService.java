package es.urjc.tfg.optitour.service;

import java.sql.SQLException;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.Image;
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
                "No se encontró el usuario con el email " + email);
    }

    public User getUserById(long id) {
        Optional<User> op = userRepository.findById(id);

        if (op.isPresent()) {
            User user = op.get();
            return user;
        }

        throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                "No se encontró el usuario con el id " + id);
    }

    @Transactional(readOnly = true)
    public byte[] getProfileImage(long id) throws SQLException {
        User user = getUserById(id);

        if (user.getProfileImage() == null) {
            return null;
        }

        return user.getProfileImage().getBytes(1, (int) user.getProfileImage().length());
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public void addImageToUser(long id, Image image, String loggedEmail) {
        Optional<User> op = userRepository.findById(id);

        if (!op.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No se encuentra ningún usuario con el id " + id + " al que añadir la imagen.");
        else {
            User targetUser = op.get();

            // If target user is not logged, image can't be modified
            if (!targetUser.getEmail().equals(getUserByEmail(loggedEmail).getEmail()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "No tienes permiso para modificar la imagen de perfil de otros usuarios.");

            targetUser.setProfileImage(image.getImageFile());
            saveUser(targetUser);
        }

    }

    public void validateUniqueEmail(String email) {
        Optional<User> op = userRepository.findByEmail(email);

        if (op.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El correo electrónico escogido ya está siendo utilizado por otro usuario.\n"
                            + "Introduce otro correo electrónico e inténtalo de nuevo.");
        }
    }

    public void validateUniqueUserName(String userName) {
        Optional<User> op = userRepository.findByUserName(userName);

        if (op.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El nombre de usuario escogido ya está siendo utilizado por otro usuario.\n"
                            + "Introduce otro nombre de usuario e inténtalo de nuevo.");
        }
    }
}
