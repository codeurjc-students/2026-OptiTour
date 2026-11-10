package es.urjc.tfg.optitour.unit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
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
        assertEquals(correctResult.getName(), "Poi name 1");
        assertEquals(correctResult.getDescription(), "Poi desc 1");
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
    void getPagedToursTest() {
        PageRequest pageRequest = PageRequest.of(0, 2);
        when(repositoryMock.findAll(pageRequest))
                .thenReturn(new PageImpl<>(pois.subList(0, 2), pageRequest, pois.size()));

        Page<PointOfInterest> result = service.getPagedPois(pageRequest);

        assertEquals(2, result.getContent().size());
        assertEquals(3, result.getTotalElements());
        assertEquals("Poi name 0", result.getContent().get(0).getName());
        verify(repositoryMock).findAll(pageRequest);
    }
}
