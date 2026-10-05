package es.urjc.tfg.optitour.service;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.repository.ImageRepository;

@Service
public class ImageService {
    private final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Image createImage(InputStream imageFile) throws IOException {
        Image image = new Image();

        try { // We try to set file from imageFileParameter bytes
            image.setImageFile(new SerialBlob(imageFile.readAllBytes()));
        } catch (Exception e) {
            throw new IOException("Failed to create image", e);
        }

        return image;
    }

    public Image saveImage(Image image) {
        return imageRepository.save(image);
    }

    @Transactional(readOnly = true)
    public Resource getImageFile(long id) throws SQLException {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No existe ninguna imagen con el ID " + id));

        // Materialize the Blob while the database transaction is still open.
        if (image.getImageFile() != null) {
            long length = image.getImageFile().length();
            return new ByteArrayResource(image.getImageFile().getBytes(1, (int) length));
        }
        throw new RuntimeException("Image file not found");
    }
}
