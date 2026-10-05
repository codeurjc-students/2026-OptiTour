package es.urjc.tfg.optitour.unit;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Optional;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.Resource;

import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.repository.ImageRepository;
import es.urjc.tfg.optitour.service.ImageService;

public class ImageServiceTest {
    ImageRepository repositoryMock;
    ImageService service;

    @BeforeEach
    void setUpMocks() {
        repositoryMock = mock(ImageRepository.class);
        service = new ImageService(repositoryMock);
    }

    @Test
    @DisplayName("Checks if getImageFile method throws when image is not available")
    void getImageFileNoImageTest() {
        // When image doesn't exist, then exception should be thrown.
        // Here id 1 doesen't exist because mock will return an empty optional object,
        // so we expect a exception to be thrown.
        when(repositoryMock.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> service.getImageFile(1L));
    }

    @Test
    @DisplayName("Checks if getImageFile throws if imageFile is empty")
    void getImageFileEmptyFileTest() {
        // Now we create a fake image to return it in an existent id.
        Image emptyImage = new Image();
        emptyImage.setImageFile(null);

        // When image exists but has an empty file, then exception should be thrown.
        // Here id 2 exisits but it's file is empty, so we expect a exception to be
        // thrown
        when(repositoryMock.findById(2L)).thenReturn(Optional.of(emptyImage));
        assertThrows(RuntimeException.class, () -> service.getImageFile(2L));
    }

    @Test
    @DisplayName("Checks if getImageById throws if image file exists")
    void getImageFileTest() throws SerialException, SQLException {
        // When image exists and it's file is not empty
        byte[] imageBytes = { 1, 2, 3 };

        Image image = new Image();
        image.setImageFile(new SerialBlob(imageBytes));

        when(repositoryMock.findById(3L)).thenReturn(Optional.of(image));

        Resource result = service.getImageFile(3L);
        assertNotNull(result);
    }

    @Test
    @DisplayName("Checks if createImage method with empty stream throws exception")
    void createImageEmptyStreamTest() {
        assertThrows(IOException.class, () -> {
            service.createImage(null);
        });
    }

    @Test
    @DisplayName("Checks if createImage method returns image properly")
    void createImageTest() throws IOException {
        byte[] bytes = { 1, 2, 3 };

        Image image = service.createImage(new ByteArrayInputStream(bytes));
        assertNotNull(image);
        assertNotNull(image.getImageFile());
    }

}
