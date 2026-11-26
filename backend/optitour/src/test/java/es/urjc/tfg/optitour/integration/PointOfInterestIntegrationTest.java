package es.urjc.tfg.optitour.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import java.sql.Blob;
import java.sql.SQLException;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.testcontainers.junit.jupiter.Testcontainers;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.PointOfInterestService;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
public class PointOfInterestIntegrationTest extends BaseIntegrationTest {
    @Autowired
    private PointOfInterestService service;

    @Autowired
    private PointOfInterestRepository repository;

    @Autowired
    private TourRepository tourRepository;

    @BeforeEach
    public void initSampleData() throws SerialException, SQLException {
        tourRepository.deleteAll();
        repository.deleteAll();

        List<Tour> tours = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            tours.add(new Tour("Test tour " + i, "Test desc " + i));
        }

        List<PointOfInterest> savedPois = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            PointOfInterest poi = new PointOfInterest("Poi name " + i, "Poi desc " + i, "sample city", "sample adress",
                    "sample coords");

            List<Image> images = new ArrayList<>();
            for (int j = 1; j <= 3; j++) {
                Blob imageFile = new SerialBlob("fake image".getBytes(StandardCharsets.UTF_8));
                Image image = new Image();
                image.setImageFile(imageFile);
                image.setPoi(poi);
                images.add(image);
            }

            poi.setImages(images);
            poi.setTours(tours);
            savedPois.add(repository.save(poi));
        }

        for (Tour tour : tours) {
            tour.setPois(savedPois);
            tourRepository.save(tour);
        }
    }

    @AfterEach
    public void tearDown() {
        tourRepository.deleteAll();
        repository.deleteAll();
    }

    private long getFirstPoiId() {
        List<PointOfInterest> all = new ArrayList<>();
        all = repository.findAll();
        return all.get(0).getId();
    }

    private long getFirstTourId() {
        List<Tour> all = new ArrayList<>();
        all = tourRepository.findAll();
        return all.get(0).getId();
    }

    @Test
    @DisplayName("getPointOfInterestById should return correctly requested poi data from actual database")
    public void getPointOfInterestByIdIntegrationTest() {
        Long targetId = repository.findAll().stream()
                .filter(p -> "Poi name 1".equals(p.getName()))
                .findFirst()
                .map(PointOfInterest::getId)
                .orElseThrow();

        // When: we call service method
        PointOfInterest correctResult = service.getPointOfInterestById(targetId);

        // Then: the received data is correct and not null
        assertNotNull(correctResult);
        assertEquals("Poi name 1", correctResult.getName());
        assertEquals("Poi desc 1", correctResult.getDescription());
        assertEquals("sample city", correctResult.getCity());
        assertEquals("sample adress", correctResult.getAddress());
        assertEquals("sample coords", correctResult.getCoords());
        assertNotNull(correctResult.getTours());

        // When: we call service method with incorrect id:
        long invalidId = 999999L;
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            service.getPointOfInterestById(invalidId);
        });

        assertEquals("404 NOT_FOUND \"No existe ningún punto de interés con el ID " + invalidId + ".\"",
                ex.getMessage());
    }

    @Test
    @DisplayName("getPagedPois method should return the requested page from the database")
    void getPagedPoisTest() {
        Page<PointOfInterest> result = service.getPagedPois(PageRequest.of(1, 2));

        assertEquals(1, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals("Poi name 2", result.getContent().get(0).getName());
    }

    @Test
    @DisplayName("saveNewPoi should save a new poi in database")
    public void saveNewPoiIntegrationTest() {
        service.saveNewPoi(new PointOfInterestCreateDTO("New POI", "New POI desc", "Test city", "Test address",
                "1.11111,1.11111"));

        PointOfInterest result = repository.findByName("New POI").get();

        assertNotNull(result);
        assertEquals("New POI", result.getName());
        assertEquals("New POI desc", result.getDescription());
        assertEquals("Test city", result.getCity());
        assertEquals("Test address", result.getAddress());
        assertEquals("1.11111,1.11111", result.getCoords());
    }

    @Test
    @DisplayName("deletePoiById should delete the correct poi from database, and disattach corresponding tours")
    public void deletePoiByIdIntegrationTest() {
        // Given: We want to delete the first POI
        Long firstId = getFirstPoiId();

        // When: We call service method
        service.deletePoiById(firstId);

        // Then: POI should have been deleted and tours disattached from this POI
        Optional<PointOfInterest> op = repository.findById(firstId);
        assertTrue(op.isEmpty());

        Tour firstTour = tourRepository.findById(getFirstTourId()).get();
        List<PointOfInterest> tourPois = firstTour.getPois();

        // We don't know exactly which poi will be the first one.
        // But we know that, if poi was removed from tour's list,
        // length should be 2 (in integration tests there are 3 pois per tour)

        assertEquals(2, tourPois.size());
    }

    @Test
    @DisplayName("editPoiById should change correct poi data in database")
    public void editPoiByIdIntegrationTest() {
        PointOfInterestCreateDTO editedDTO = new PointOfInterestCreateDTO("Edited poi name", "Edited poi desc",
                "Edited city", "Edited address", "Edited coords");

        long firstId = getFirstPoiId();

        PointOfInterest result = service.editPoiById(firstId, editedDTO);
        PointOfInterest actual = repository.findById(firstId).get();

        assertEquals(actual.getName(), result.getName());
        assertEquals(actual.getDescription(), result.getDescription());
        assertEquals(actual.getCity(), result.getCity());
        assertEquals(actual.getAddress(), result.getAddress());
        assertEquals(actual.getCoords(), result.getCoords());
    }

    @Test
    @DisplayName("deleteImageFromPoi should remove correct image from poi image list")
    public void deleteImageFromPoiIntegrationTest() {
        PointOfInterest poi = repository.findById(getFirstPoiId()).get();
        long imageIdToDelete = poi.getImages().get(0).getId();

        service.deleteImageFromPoi(poi.getId(), imageIdToDelete);
        PointOfInterest result = repository.findById(poi.getId()).get();
        List<Image> resultImages = result.getImages();

        assertEquals(2, resultImages.size());

        for (Image image : resultImages)
            assertNotEquals(imageIdToDelete, image.getId());
    }
}