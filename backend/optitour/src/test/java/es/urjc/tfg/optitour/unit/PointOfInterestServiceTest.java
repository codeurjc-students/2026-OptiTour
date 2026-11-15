package es.urjc.tfg.optitour.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.DTO.PointOfInterestCreateDTO;
import es.urjc.tfg.optitour.model.Image;
import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.PointOfInterestRepository;
import es.urjc.tfg.optitour.service.PointOfInterestService;

public class PointOfInterestServiceTest {

    PointOfInterestRepository repositoryMock;
    PointOfInterestService service;
    List<PointOfInterest> pois;

    @BeforeEach
    void setUpmocks() { // Given: a POI service with mocked repository and sample data
        repositoryMock = mock(PointOfInterestRepository.class);
        service = new PointOfInterestService(repositoryMock);

        pois = new ArrayList<PointOfInterest>();
        List<Tour> tours = new ArrayList<Tour>();

        for (int i = 0; i < 3; i++) {
            tours.add(new Tour("Test tour " + i, "Test desc " + i));
        }

        for (int i = 0; i < 3; i++) {
            PointOfInterest poi = new PointOfInterest("Poi name " + i, "Poi desc " + i, "sample city", "sample adress",
                    "sample coords");
            poi.setTours(tours);
            pois.add(poi);
        }
    }

    @Test
    @DisplayName("getPoiById should return the correct point of interest")
    void getPoiByIdTest() {
        // Given: the repository returns an optional object with the correct poi
        when(repositoryMock.findById(1)).thenReturn(Optional.of(pois.get(1)));

        // When: we call service method
        PointOfInterest correctResult = service.getPointOfInterestById(1);

        // Then: the received data is correct and not null
        assertNotNull(correctResult);
        assertEquals("Poi name 1", correctResult.getName());
        assertEquals("Poi desc 1", correctResult.getDescription());
        assertEquals("sample city", correctResult.getCity());
        assertEquals("sample adress", correctResult.getAddress());
        assertEquals("sample coords", correctResult.getCoords());
        assertNotNull(correctResult.getTours());

    }

    @Test
    @DisplayName("getPoiById method should throw when is called with bad id")
    void getPoiByIdIncorrectIdTest() {
        // When: we call service method with incorrect id:
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
            service.getPointOfInterestById(5);
        });

        // Then: 404 error should be thrown
        assertEquals("404 NOT_FOUND \"No existe ningún punto de interés con el ID 5.\"", ex.getMessage());
    }

    @Test
    @DisplayName("getPagedTours method should return the requested page")
    void getPagedPoisTest() {
        PageRequest pageRequest = PageRequest.of(0, 2);
        when(repositoryMock.findAll(pageRequest))
                .thenReturn(new PageImpl<>(pois.subList(0, 2), pageRequest, pois.size()));

        Page<PointOfInterest> result = service.getPagedPois(pageRequest);

        assertEquals(2, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals("Poi name 0", result.getContent().get(0).getName());
        verify(repositoryMock).findAll(pageRequest);
    }

    @Test
    @DisplayName("addImagesToPoi should link and add images to the point of interest")
    void addImagesToPoiTest() {
        PointOfInterest poi = pois.get(0);
        Image image = new Image();
        when(repositoryMock.findById(1L)).thenReturn(Optional.of(poi));
        when(repositoryMock.save(poi)).thenReturn(poi);

        List<Image> savedImages = service.addImagesToPoi(1L, List.of(image));

        assertEquals(poi, image.getPoi());
        assertEquals(List.of(image), poi.getImages());
        assertEquals(List.of(image), savedImages);
        verify(repositoryMock).save(poi);
    }

    @Test
    @DisplayName("saveNewPoi should call save repository method")
    public void saveNewPoiTest() {
        // Given: There isn't any Point Of Interest with "New POI" name
        when(repositoryMock.findByName("New POI")).thenReturn(Optional.empty());

        // When: We create a POI with that name
        PointOfInterest result = service
                .saveNewPoi(new PointOfInterestCreateDTO("New POI", "New POI desc", "Test city", "Test address",
                        "1.11111,1.11111"));

        // Then: repository should have saved it and returned object must have the same
        // data.
        verify(repositoryMock).save(any(PointOfInterest.class));
        assertEquals("New POI", result.getName());
        assertEquals("New POI desc", result.getDescription());
        assertEquals("Test city", result.getCity());
        assertEquals("Test address", result.getAddress());
        assertEquals("1.11111,1.11111", result.getCoords());
    }

    @Test
    @DisplayName("saveNewPoi with repeated name should throw exception")
    public void saveNewPoiRepeatedName() {
        when(repositoryMock.findByName("Poi name 0")).thenReturn(Optional.of(pois.get(0)));

        ResponseStatusException e = assertThrows(ResponseStatusException.class, () -> {
            service
                    .saveNewPoi(new PointOfInterestCreateDTO("Poi name 0", "New POI desc", "Test city", "Test address",
                            "1.11111,1.11111"));
        });

        assertEquals(
                "400 BAD_REQUEST \"Ya exisite un punto de interés con este nombre. Prueba con otro punto de interés e inténtalo de nuevo\"",
                e.getMessage());
    }
}
