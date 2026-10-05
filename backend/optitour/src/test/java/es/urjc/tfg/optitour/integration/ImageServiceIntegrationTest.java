package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

import java.io.IOException;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.repository.ImageRepository;
import es.urjc.tfg.optitour.service.ImageService;
import org.springframework.core.io.Resource;
import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class ImageServiceIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private ImageService service;

    @Autowired
    private ImageRepository repository;

    @BeforeEach
    void deleteall() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("Checks if database saves and return correct images")
    public void getImageFileIntegrationTest() throws SerialException, SQLException, IOException {
        byte[] bytes = { 1, 2, 3 };

        Image image = new Image();
        image.setImageFile(new SerialBlob(bytes));
        Image savedImage = repository.save(image);

        Resource result = service.getImageFile(savedImage.getId());

        assertArrayEquals(bytes, result.getInputStream().readAllBytes());
    }
}
