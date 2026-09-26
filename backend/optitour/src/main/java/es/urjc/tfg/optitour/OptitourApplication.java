package es.urjc.tfg.optitour;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class OptitourApplication {

	public static void main(String[] args) {
		SpringApplication.run(OptitourApplication.class, args);
	}

}
