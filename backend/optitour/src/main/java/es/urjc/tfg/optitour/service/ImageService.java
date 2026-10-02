package es.urjc.tfg.optitour.service;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

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

    public Resource getImageFile(long id) throws SQLException {
        Image image = imageRepository.findById(id).orElseThrow();

        // If image file is not null we return the image file byte stream
        if (image.getImageFile() != null)
            return new InputStreamResource(image.getImageFile().getBinaryStream());
        throw new RuntimeException("Image file not found");
    }
}
