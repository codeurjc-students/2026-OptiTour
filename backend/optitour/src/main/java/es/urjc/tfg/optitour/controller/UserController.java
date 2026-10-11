package es.urjc.tfg.optitour.controller;

import java.io.IOException;
import java.net.URI;
import java.security.Principal;
import java.sql.Blob;
import java.sql.SQLException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.web.servlet.support.ServletUriComponentsBuilder.fromCurrentRequest;

import es.urjc.tfg.optitour.DTO.ImageDTO;
import es.urjc.tfg.optitour.DTO.UserCreateDTO;
import es.urjc.tfg.optitour.DTO.UserDTO;
import es.urjc.tfg.optitour.mapper.ImageMapper;
import es.urjc.tfg.optitour.mapper.UserMapper;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.service.ImageService;
import es.urjc.tfg.optitour.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    private final PasswordEncoder encoder;

    private final UserMapper mapper;

    private final ImageService imageService;

    private final ImageMapper imageMapper;

    public UserController(UserService userService, PasswordEncoder encoder, UserMapper mapper,
            ImageService imageService, ImageMapper imageMapper) {
        this.userService = userService;
        this.encoder = encoder;
        this.mapper = mapper;
        this.imageService = imageService;
        this.imageMapper = imageMapper;
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Object> downloadImage(@PathVariable long id) throws SQLException {
        byte[] image = userService.getProfileImage(id);

        if (image != null) {
            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(image);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/")
    public ResponseEntity<UserDTO> signupUser(@RequestBody UserCreateDTO newUserDTO) {
        User newUser = new User(newUserDTO.email(), encoder.encode(newUserDTO.password()), newUserDTO.userName(),
                newUserDTO.phoneNumber(), false,
                (Blob) null, "USER");

        userService.saveUser(newUser);

        UserDTO responseDTO = mapper.toDTO(newUser);
        URI location = fromCurrentRequest().path("/{id}").buildAndExpand(newUser.getId()).toUri();
        return ResponseEntity.created(location).body(responseDTO);
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<ImageDTO> uploadImage(@PathVariable long id, @RequestParam("file") MultipartFile imageFile,
            HttpServletRequest request) throws IOException {
        if (imageFile.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo de la imagen no puede estar vacío");

        Principal principal = request.getUserPrincipal();

        if (principal == null)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Se necesita iniciar sesión para modificar la foto de perfil.");

        String loggedEmail = principal.getName();
        Image image = imageService.createImage(imageFile.getInputStream());
        userService.addImageToUser(id, image, loggedEmail);

        URI location = fromCurrentRequest().path("/api/v1/image/{id}").buildAndExpand(image.getId()).toUri();

        return ResponseEntity.created(location).body(imageMapper.toDTO(image));
    }

}
