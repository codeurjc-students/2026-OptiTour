package es.urjc.tfg.optitour.unit;

import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.service.TourService;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class TourServiceTest {

	@Test
	@DisplayName("getAllTours method should return all tours in database")
	void getAllToursTest() {
		// We create a mock for the database repository, using the mockito library
		TourRepository repositoryMock = mock(TourRepository.class);

		// Now, we can create a testService whitch database is the mock we created
		TourService testService = new TourService(repositoryMock);

		// We create an example list
		List<Tour> tours = new ArrayList<Tour>();

		for (int i = 0; i < 3; i++) {
			tours.add(new Tour("Test tour " + i, "Test desc " + i));
		}

		// Mock methods configuration: we return tours list when findAll is called
		when(repositoryMock.findAll()).thenReturn(tours);

		// Now, we verify that testService returns the tours list, with the correct data
		// in it

		List<Tour> testResult = testService.getAllTours();
		assertThat(testResult, hasSize(3));

		for (Tour tour : testResult) {
			assertTrue(tour.getName().contains("Test tour"), "All example tours should contain Test tour in its name");
			assertTrue(tour.getDescription().contains("Test desc"),
					"All example tours should contain Test tour in its description");
		}
	}

}
