package es.urjc.tfg.optitour;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

import es.urjc.tfg.optitour.mapper.TourMapperImpl;

@SpringBootApplication
@Import(TourMapperImpl.class)
public class OptitourApplication {

	public static void main(String[] args) {
		SpringApplication.run(OptitourApplication.class, args);
	}

}
