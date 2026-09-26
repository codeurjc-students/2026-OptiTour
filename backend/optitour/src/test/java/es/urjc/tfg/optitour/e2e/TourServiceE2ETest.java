package es.urjc.tfg.optitour.e2e;

import static io.restassured.RestAssured.*;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import es.urjc.tfg.optitour.BaseIntegrationTest;
import es.urjc.tfg.optitour.DTO.TourDTO;
import es.urjc.tfg.optitour.model.Tour;
import es.urjc.tfg.optitour.repository.TourRepository;
import io.restassured.RestAssured;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TourServiceE2ETest extends BaseIntegrationTest {
    @Autowired
    private TourRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // First of all, we configure the random port where the api will run:
    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.baseURI = "https://localhost";
        RestAssured.useRelaxedHTTPSValidation();
        jdbcTemplate.execute("TRUNCATE TABLE tour RESTART IDENTITY");

        String[] tourNames = {
                "Madrid, España", "Barcelona, España", "Sevilla, España", "Valencia, España", "Bilbao, España",
                "Granada, España", "Málaga, España", "Toledo, España", "Córdoba, España",
                "Santiago de Compostela, España",
                "París, Francia", "Roma, Italia", "Londres, Reino Unido", "Berlín, Alemania", "Ámsterdam, Países Bajos",
                "Praga, República Checa", "Viena, Austria", "Budapest, Hungría", "Atenas, Grecia",
                "Nueva York, EE. UU.",
                "Tokio, Japón", "Sídney, Australia", "Río de Janeiro, Brasil", "Buenos Aires, Argentina",
                "Ciudad del Cabo, Sudáfrica",
                "El Cairo, Egipto", "Estambul, Turquía", "Bangkok, Tailandia", "Dubái, EAU", "Kioto, Japón"
        };

        String[] tourDescriptions = {
                "Descubre la capital de España, sus museos y su vibrante vida nocturna.",
                "Maravíllate con la arquitectura de Gaudí y pasea por las Ramblas.",
                "Disfruta de la Giralda, el Alcázar y el encanto andaluz.",
                "Conoce la Ciudad de las Artes y las Ciencias y prueba la auténtica paella.",
                "Visita el museo Guggenheim y degusta los mejores pintxos.",
                "Déjate cautivar por la majestuosidad de la Alhambra.",
                "Sol, playa y el museo de su hijo predilecto, Picasso.",
                "La ciudad de las tres culturas te espera con su rica historia.",
                "Piérdete en su impresionante Mezquita-Catedral y sus patios.",
                "El destino final del famoso Camino, con su imponente Catedral.",
                "La ciudad del amor, la Torre Eiffel y el museo del Louvre.",
                "Un museo al aire libre con el Coliseo y el Vaticano.",
                "Historia y modernidad junto al Big Ben y el London Eye.",
                "Una ciudad llena de historia y una vibrante cultura alternativa.",
                "Pasea en bicicleta por sus famosos canales.", "La ciudad de las cien cúpulas con su encanto medieval.",
                "Elegancia imperial y música clásica en cada rincón.",
                "Relájate en sus baños termales tras recorrer el Danubio.",
                "Cuna de la civilización occidental con la majestuosa Acrópolis.",
                "La ciudad que nunca duerme te espera con Times Square y Central Park.",
                "Tecnología, tradición y una gastronomía inigualable.", "Surf, playas y su icónica Casa de la Ópera.",
                "Carnaval, el Cristo Redentor y las playas de Copacabana.",
                "Tango, cultura y la mejor carne del mundo.",
                "Naturaleza salvaje y vistas increíbles desde Table Mountain.",
                "Misterio y antigüedad junto a las Grandes Pirámides de Guiza.",
                "Donde Oriente y Occidente se encuentran.",
                "Templos dorados, mercados flotantes y vida callejera vibrante.",
                "Lujo deslumbrante, rascacielos infinitos y el Burj Khalifa.",
                "Santuarios milenarios, jardines zen y la magia de las geishas."
        };

        for (int i = 0; i < 30; i++) {
            repository.save(new Tour(tourNames[i], tourDescriptions[i]));
        }
    }

    @Test
    @DisplayName("Calling api at /tour/all should return the SampleDataService example tours")
    public void tourServiceE2Etest() {
        // We make the api call, check the HTTP status code and get the sample tour list
        List<TourDTO> result = get("/api/v1/tour/all")
                .then()
                .statusCode(200)
                .extract().jsonPath().getList("$", TourDTO.class);

        // Now, we can check if received data is correct:

        assertThat(result, hasSize(30));

        String[] tourNames = {
                "Madrid, España", "Barcelona, España", "Sevilla, España", "Valencia, España", "Bilbao, España",
                "Granada, España", "Málaga, España", "Toledo, España", "Córdoba, España",
                "Santiago de Compostela, España",
                "París, Francia", "Roma, Italia", "Londres, Reino Unido", "Berlín, Alemania", "Ámsterdam, Países Bajos",
                "Praga, República Checa", "Viena, Austria", "Budapest, Hungría", "Atenas, Grecia",
                "Nueva York, EE. UU.",
                "Tokio, Japón", "Sídney, Australia", "Río de Janeiro, Brasil", "Buenos Aires, Argentina",
                "Ciudad del Cabo, Sudáfrica",
                "El Cairo, Egipto", "Estambul, Turquía", "Bangkok, Tailandia", "Dubái, EAU", "Kioto, Japón"
        };

        String[] tourDescriptions = {
                "Descubre la capital de España, sus museos y su vibrante vida nocturna.",
                "Maravíllate con la arquitectura de Gaudí y pasea por las Ramblas.",
                "Disfruta de la Giralda, el Alcázar y el encanto andaluz.",
                "Conoce la Ciudad de las Artes y las Ciencias y prueba la auténtica paella.",
                "Visita el museo Guggenheim y degusta los mejores pintxos.",
                "Déjate cautivar por la majestuosidad de la Alhambra.",
                "Sol, playa y el museo de su hijo predilecto, Picasso.",
                "La ciudad de las tres culturas te espera con su rica historia.",
                "Piérdete en su impresionante Mezquita-Catedral y sus patios.",
                "El destino final del famoso Camino, con su imponente Catedral.",
                "La ciudad del amor, la Torre Eiffel y el museo del Louvre.",
                "Un museo al aire libre con el Coliseo y el Vaticano.",
                "Historia y modernidad junto al Big Ben y el London Eye.",
                "Una ciudad llena de historia y una vibrante cultura alternativa.",
                "Pasea en bicicleta por sus famosos canales.", "La ciudad de las cien cúpulas con su encanto medieval.",
                "Elegancia imperial y música clásica en cada rincón.",
                "Relájate en sus baños termales tras recorrer el Danubio.",
                "Cuna de la civilización occidental con la majestuosa Acrópolis.",
                "La ciudad que nunca duerme te espera con Times Square y Central Park.",
                "Tecnología, tradición y una gastronomía inigualable.", "Surf, playas y su icónica Casa de la Ópera.",
                "Carnaval, el Cristo Redentor y las playas de Copacabana.",
                "Tango, cultura y la mejor carne del mundo.",
                "Naturaleza salvaje y vistas increíbles desde Table Mountain.",
                "Misterio y antigüedad junto a las Grandes Pirámides de Guiza.",
                "Donde Oriente y Occidente se encuentran.",
                "Templos dorados, mercados flotantes y vida callejera vibrante.",
                "Lujo deslumbrante, rascacielos infinitos y el Burj Khalifa.",
                "Santuarios milenarios, jardines zen y la magia de las geishas."
        };

        for (int i = 0; i < 30; i++) {
            assertThat(result.get(i).id(), equalTo((long) i + 1));
            assertThat(result.get(i).name(), equalTo(tourNames[i]));
            assertThat(result.get(i).description(), equalTo(tourDescriptions[i]));
        }
    }

    @Test
    @DisplayName("Checks if pageable tour endpoint works properly")
    void pagaebleToursTest() {
        List<TourDTO> result = get("/api/v1/tour/?page=0&size=5")
                .then()
                .statusCode(200)
                .extract().jsonPath().getList("content", TourDTO.class);

        assertThat(result, hasSize(5));

        String[] tourNames = {
                "Madrid, España", "Barcelona, España", "Sevilla, España", "Valencia, España", "Bilbao, España",
        };

        String[] tourDescriptions = {
                "Descubre la capital de España, sus museos y su vibrante vida nocturna.",
                "Maravíllate con la arquitectura de Gaudí y pasea por las Ramblas.",
                "Disfruta de la Giralda, el Alcázar y el encanto andaluz.",
                "Conoce la Ciudad de las Artes y las Ciencias y prueba la auténtica paella.",
                "Visita el museo Guggenheim y degusta los mejores pintxos.",
        };

        for (int i = 0; i < 5; i++) {
            assertThat(result.get(i).id(), equalTo((long) i + 1));
            assertThat(result.get(i).name(), equalTo(tourNames[i]));
            assertThat(result.get(i).description(), equalTo(tourDescriptions[i]));
        }
    }
}
