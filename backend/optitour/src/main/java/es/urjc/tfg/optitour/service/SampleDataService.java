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

        if (tourRepository.count() == 0) {
            tourRepository.save(new Tour("Madrid, España",
                    "Descubre la capital de España, sus museos y su vibrante vida nocturna."));
            tourRepository.save(
                    new Tour("Barcelona, España", "Maravíllate con la arquitectura de Gaudí y pasea por las Ramblas."));
            tourRepository
                    .save(new Tour("Sevilla, España", "Disfruta de la Giralda, el Alcázar y el encanto andaluz."));
            tourRepository.save(new Tour("Valencia, España",
                    "Conoce la Ciudad de las Artes y las Ciencias y prueba la auténtica paella."));
            tourRepository
                    .save(new Tour("Bilbao, España", "Visita el museo Guggenheim y degusta los mejores pintxos."));
            tourRepository.save(new Tour("Granada, España", "Déjate cautivar por la majestuosidad de la Alhambra."));
            tourRepository.save(new Tour("Málaga, España", "Sol, playa y el museo de su hijo predilecto, Picasso."));
            tourRepository
                    .save(new Tour("Toledo, España", "La ciudad de las tres culturas te espera con su rica historia."));
            tourRepository
                    .save(new Tour("Córdoba, España", "Piérdete en su impresionante Mezquita-Catedral y sus patios."));
            tourRepository.save(new Tour("Santiago de Compostela, España",
                    "El destino final del famoso Camino, con su imponente Catedral."));
            tourRepository
                    .save(new Tour("París, Francia", "La ciudad del amor, la Torre Eiffel y el museo del Louvre."));
            tourRepository.save(new Tour("Roma, Italia", "Un museo al aire libre con el Coliseo y el Vaticano."));
            tourRepository
                    .save(new Tour("Londres, Reino Unido", "Historia y modernidad junto al Big Ben y el London Eye."));
            tourRepository.save(
                    new Tour("Berlín, Alemania", "Una ciudad llena de historia y una vibrante cultura alternativa."));
            tourRepository.save(new Tour("Ámsterdam, Países Bajos", "Pasea en bicicleta por sus famosos canales."));
            tourRepository
                    .save(new Tour("Praga, República Checa", "La ciudad de las cien cúpulas con su encanto medieval."));
            tourRepository.save(new Tour("Viena, Austria", "Elegancia imperial y música clásica en cada rincón."));
            tourRepository
                    .save(new Tour("Budapest, Hungría", "Relájate en sus baños termales tras recorrer el Danubio."));
            tourRepository.save(
                    new Tour("Atenas, Grecia", "Cuna de la civilización occidental con la majestuosa Acrópolis."));
            tourRepository.save(new Tour("Nueva York, EE. UU.",
                    "La ciudad que nunca duerme te espera con Times Square y Central Park."));
            tourRepository.save(new Tour("Tokio, Japón", "Tecnología, tradición y una gastronomía inigualable."));
            tourRepository.save(new Tour("Sídney, Australia", "Surf, playas y su icónica Casa de la Ópera."));
            tourRepository.save(
                    new Tour("Río de Janeiro, Brasil", "Carnaval, el Cristo Redentor y las playas de Copacabana."));
            tourRepository.save(new Tour("Buenos Aires, Argentina", "Tango, cultura y la mejor carne del mundo."));
            tourRepository.save(new Tour("Ciudad del Cabo, Sudáfrica",
                    "Naturaleza salvaje y vistas increíbles desde Table Mountain."));
            tourRepository.save(
                    new Tour("El Cairo, Egipto", "Misterio y antigüedad junto a las Grandes Pirámides de Guiza."));
            tourRepository.save(new Tour("Estambul, Turquía", "Donde Oriente y Occidente se encuentran."));
            tourRepository.save(
                    new Tour("Bangkok, Tailandia", "Templos dorados, mercados flotantes y vida callejera vibrante."));
            tourRepository.save(new Tour("Dubái, EAU", "Lujo deslumbrante, rascacielos infinitos y el Burj Khalifa."));
            tourRepository
                    .save(new Tour("Kioto, Japón", "Santuarios milenarios, jardines zen y la magia de las geishas."));
        }

        if (userRepository.findByEmail("carmen@example.com").isEmpty()) {
            userRepository.save(new User("carmen@example.com", passwordEncoder.encode("demo1234"), "Carmen García",
                    "611 223 344", false, "USER"));
            userRepository.save(new User("laura@example.com", passwordEncoder.encode("demo1234"), "Laura Martínez",
                    "655 443 322", false, "USER"));
            userRepository.save(new User("maria@example.com", passwordEncoder.encode("demo1234"), "María López",
                    "677 889 900", false, "USER"));
            userRepository.save(new User("ana@example.com", passwordEncoder.encode("demo1234"), "Ana Fernández",
                    "622 112 233", false, "USER"));
            userRepository.save(new User("lucia@example.com", passwordEncoder.encode("demo1234"), "Lucía Sánchez",
                    "633 445 566", false, "USER"));
            userRepository.save(new User("javier@example.com", passwordEncoder.encode("demo1234"), "Javier Pérez",
                    "600 123 456", false, "USER"));
            userRepository.save(new User("carlos@example.com", passwordEncoder.encode("demo1234"), "Carlos Gómez",
                    "688 776 655", false, "USER"));
            userRepository.save(new User("david@example.com", passwordEncoder.encode("demo1234"), "David Rodríguez",
                    "699 111 222", false, "USER"));
            userRepository.save(new User("alejandro@example.com", passwordEncoder.encode("demo1234"), "Alejandro Ruiz",
                    "644 332 211", false, "USER"));
            userRepository.save(new User("daniel@example.com", passwordEncoder.encode("demo1234"), "Daniel Martín",
                    "666 555 444", false, "USER"));
        }

        if (userRepository.findByEmail("admin@optitour.com").isEmpty()) {
            userRepository.save(new User("admin@optitour.com", passwordEncoder.encode("admin1234"), "Admin",
                    "111 111 111", false, "USER", "ADMIN"));
        }

    }
}
