package es.urjc.tfg.optitour.controller;

import java.sql.Blob;
import java.sql.SQLException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<Object> downloadImage(@PathVariable long id) throws SQLException {
        User user = userService.getUserById(id); // We get the user we want it's image

        if (user.getProfileImage() != null) {
            // Now, if image is not null, we get image file and return it in a
            // ResponseEntity
            Blob image = user.getProfileImage();
            InputStreamResource imageFile = new InputStreamResource(image.getBinaryStream());

            // We obtain the filetype (image format or jpeg by default) to indicate it in
            // ResponseEntity
            MediaType mediaType = MediaTypeFactory.getMediaType(imageFile).orElse(MediaType.IMAGE_JPEG);

            // We return the image
            return ResponseEntity
                    .ok()
                    .contentType(mediaType) // We indicate the type of the file in body
                    .body(imageFile); // We set the body of the response to an image
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
