package es.urjc.tfg.optitour.service;

import org.springframework.stereotype.Service;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.model.User;
import es.urjc.tfg.optitour.repository.TourRepository;
import es.urjc.tfg.optitour.repository.UserRepository;

@Service
@Profile("!test")
public class SampleDataService {

    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    SampleDataService(TourRepository tourRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.tourRepository = tourRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void init() {

        // We insert some example tours with a for loop, only if there are no tours in
        // database.
        if (tourRepository.count() == 0) {
            for (int i = 0; i < 5; i++) {
                tourRepository.save(new Tour("Tour " + (i + 1), "Tour de ejemplo numero " + (i + 1)));
            }
        }

        if (userRepository.count() == 0) {
            userRepository.save(new User("example@example.com",
                    passwordEncoder.encode("demo1234"), "ExampleName", "123 456 789", false,
                    "USER"));

            userRepository.save(new User("admin@optitour.com", passwordEncoder.encode("admin1234"), "ExampleAdmin",
                    "111 111 111", false, "USER", "ADMIN"));
        }

    }
}
