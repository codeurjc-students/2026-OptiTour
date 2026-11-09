package es.urjc.tfg.optitour.unit;

import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;

import es.urjc.tfg.optitour.model.PointOfInterest;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.TourService;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class TourServiceTest {
	TourRepository repositoryMock;
	TourService service;
	List<Tour> tours;

	// Given: We have a mocked database with 3 tours
	@BeforeEach
	void setUpMocks() {
		// We create a mock for the database repository, using the mockito library
		repositoryMock = mock(TourRepository.class);

		// Now, we can create a testService whitch database is the mock we created
		service = new TourService(repositoryMock);

		// We create an example list
		tours = new ArrayList<Tour>();

		for (int i = 0; i < 3; i++) {
			tours.add(new Tour("Test tour " + i, "Test desc " + i));
		}
	}

	@Test
	@DisplayName("getPagedTours method should return the requested page")
	void getPagedToursTest() {
		PageRequest pageRequest = PageRequest.of(0, 2);
		when(repositoryMock.findAll(pageRequest)).thenReturn(new PageImpl<>(tours.subList(0, 2), pageRequest, tours.size()));

		Page<Tour> result = service.getPagedTours(pageRequest);

		assertEquals(2, result.getContent().size());
		assertEquals(3, result.getTotalElements());
		assertEquals("Test tour 0", result.getContent().get(0).getName());
		verify(repositoryMock).findAll(pageRequest);
	}

	@Test
	@DisplayName("getTourById method should return the corresponding tour in database and have the correc POI list")
	void getTourByIdTest() {
		List<PointOfInterest> pois = new ArrayList<PointOfInterest>(); // We add the POI list

		// We'll use the same POI list in all tours for simplicity
		for (int i = 0; i < 3; i++) {
			pois.add(new PointOfInterest("Test POI " + i, "Test desc " + i, "Test city", "TestAddress", "TestCoords"));
			tours.get(i).setPois(pois);
		}

		// We return the optional object if ID is correct.
		when(repositoryMock.findById(1)).thenReturn(Optional.of(tours.get(1)));

		// When: We call the method with correct ID
		Tour correctResult = service.getTourById(1);

		// Then: we check if tour received is the correct one.
		assertNotNull(correctResult);
		assertEquals(correctResult.getName(), "Test tour 1");
		assertEquals(correctResult.getDescription(), "Test desc 1");
		assertNotNull(correctResult.getPois());

		List<PointOfInterest> resultList = correctResult.getPois();
		assertNotNull(resultList);
		assertEquals(resultList.get(1).getName(), "Test POI 1");
		assertEquals(resultList.get(1).getDescription(), "Test desc 1");
	}

	@Test
	@DisplayName("getTourById should throw if is called with bad id")
	void getTourByIdIncorrectId() {
		ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> {
			service.getTourById(5);
		});

		assertEquals("404 NOT_FOUND \"No existe ningún tour con el ID 5.\"", ex.getMessage());
	}

}