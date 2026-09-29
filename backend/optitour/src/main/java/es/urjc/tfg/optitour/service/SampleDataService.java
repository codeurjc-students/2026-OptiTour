package es.urjc.tfg.optitour.service;

import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;

import es.urjc.tfg.optitour.model.PointOfInterest;
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

        SampleDataService(TourRepository tourRepository, UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {
                this.tourRepository = tourRepository;
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @EventListener(ApplicationReadyEvent.class)
        public void init() {


                if (userRepository.findByEmail("carmen@example.com").isEmpty()) {
                        userRepository.save(new User("carmen@example.com", passwordEncoder.encode("demo1234"),
                                        "Carmen García",
                                        "611 223 344", false, "USER"));
                        userRepository.save(new User("laura@example.com", passwordEncoder.encode("demo1234"),
                                        "Laura Martínez",
                                        "655 443 322", false, "USER"));
                        userRepository.save(
                                        new User("maria@example.com", passwordEncoder.encode("demo1234"), "María López",
                                                        "677 889 900", false, "USER"));
                        userRepository.save(
                                        new User("ana@example.com", passwordEncoder.encode("demo1234"), "Ana Fernández",
                                                        "622 112 233", false, "USER"));
                        userRepository.save(new User("lucia@example.com", passwordEncoder.encode("demo1234"),
                                        "Lucía Sánchez",
                                        "633 445 566", false, "USER"));
                        userRepository.save(new User("javier@example.com", passwordEncoder.encode("demo1234"),
                                        "Javier Pérez",
                                        "600 123 456", false, "USER"));
                        userRepository.save(new User("carlos@example.com", passwordEncoder.encode("demo1234"),
                                        "Carlos Gómez",
                                        "688 776 655", false, "USER"));
                        userRepository.save(new User("david@example.com", passwordEncoder.encode("demo1234"),
                                        "David Rodríguez",
                                        "699 111 222", false, "USER"));
                        userRepository.save(new User("alejandro@example.com", passwordEncoder.encode("demo1234"),
                                        "Alejandro Ruiz",
                                        "644 332 211", false, "USER"));
                        userRepository.save(new User("daniel@example.com", passwordEncoder.encode("demo1234"),
                                        "Daniel Martín",
                                        "666 555 444", false, "USER"));
                }

                if (userRepository.findByEmail("admin@optitour.com").isEmpty()) {
                        userRepository.save(new User("admin@optitour.com", passwordEncoder.encode("admin1234"), "Admin",
                                        "111 111 111", false, "USER", "ADMIN"));
        
        }

        if(tourRepository.count()==0)

        {
                tourRepository.save(new Tour("Madrid, España",
                                "Descubre la capital de España, sus museos y su vibrante vida nocturna.", List.of(
                                new PointOfInterest("Museo del Prado", "Pinacoteca con obras maestras de Velázquez y Goya.", "Madrid", "Calle de Ruiz de Alarcón, 23", "40.4137818,-3.6921271"),
                                new PointOfInterest("Parque del Retiro", "Pulmón verde histórico con su estanque grande y Palacio de Cristal.", "Madrid", "Plaza de la Independencia, 7", "40.4152606,-3.6844995"),
                                new PointOfInterest("Palacio Real", "Residencia oficial de los reyes de España y jardines de Sabatini.", "Madrid", "Calle de Bailén, s/n", "40.417955,-3.714312"),
                                new PointOfInterest("Plaza Mayor", "Histórica plaza porticada en el corazón del Madrid de los Austrias.", "Madrid", "Plaza Mayor, s/n", "40.415511,-3.7074009"),
                                new PointOfInterest("Puerta del Sol", "Kilómetro cero de las carreteras radiales españolas y reloj emblemático.", "Madrid", "Plaza de la Puerta del Sol", "40.4167278,-3.7033387"))));

                tourRepository.save(new Tour("Barcelona, España",
                                "Maravíllate con la arquitectura de Gaudí y pasea por las Ramblas.", List.of(
                                new PointOfInterest("Sagrada Familia", "Basílica monumental y obra cumbre inacabada de Antoni Gaudí.", "Barcelona", "Carrer de Mallorca, 401", "41.4036299,2.1743558"),
                                new PointOfInterest("Parque Güell", "Parque público con jardines y elementos arquitectónicos de Gaudí.", "Barcelona", "Carrer d'Olot, 5", "41.4144948,2.1526945"),
                                new PointOfInterest("Casa Batlló", "Edificio modernista con fachada ondulada e inspirada en formas marinas.", "Barcelona", "Passeig de Gràcia, 43", "41.391649,2.164770"),
                                new PointOfInterest("Las Ramblas", "Paseo peatonal emblemático entre la Plaza de Cataluña y el puerto.", "Barcelona", "La Rambla, s/n", "41.381480,2.173160"),
                                new PointOfInterest("Barrio Gótico", "Centro histórico de la ciudad con callejuelas y arquitectura medieval.", "Barcelona", "Plaça de Sant Jaume, s/n", "41.382845,2.177432"))));

                tourRepository.save(new Tour("Sevilla, España",
                                "Disfruta de la Giralda, el Alcázar y el encanto andaluz.", List.of(
                                new PointOfInterest("Catedral y Giralda", "Catedral gótica más grande del mundo con su histórico alminar almohade.", "Sevilla", "Avenida de la Constitución, s/n", "37.385754,-5.993099"),
                                new PointOfInterest("Real Alcázar", "Conjunto palaciego amurallado con estilos islámico, mudéjar y gótico.", "Sevilla", "Patio de Banderas, s/n", "37.383792,-5.990236"),
                                new PointOfInterest("Plaza de España", "Monumento arquitectónico semicircular representativo de las provincias españolas.", "Sevilla", "Avenida de Isabel la Católica, s/n", "37.377222,-5.986944"),
                                new PointOfInterest("Torre del Oro", "Torre albarrana defensiva a orillas del río Guadalquivir.", "Sevilla", "Paseo de Cristóbal Colón, s/n", "37.382379,-5.996277"),
                                new PointOfInterest("Barrio de Santa Cruz", "Antigua judería con calles estrechas, plazas con naranjos y patios floridos.", "Sevilla", "Plaza de Santa Cruz, s/n", "37.385000,-5.988000"))));

                tourRepository.save(new Tour("Valencia, España",
                                "Conoce la Ciudad de las Artes y las Ciencias y prueba la auténtica paella.", List.of(
                                new PointOfInterest("Ciudad de las Artes y las Ciencias", "Complejo vanguardista de divulgación científica y cultural.", "Valencia", "Avinguda del Professor López Piñero, 7", "39.454848,-0.350482"),
                                new PointOfInterest("Catedral de Valencia", "Templo gótico que custodia el Santo Cáliz y su torre campanario.", "Valencia", "Plaza de la Reina, s/n", "39.475432,-0.375253"),
                                new PointOfInterest("Mercado Central", "Obra maestra del modernismo con cientos de puestos gastronómicos.", "Valencia", "Plaza Ciudad de Brujas, s/n", "39.473551,-0.379122"),
                                new PointOfInterest("Lonja de la Seda", "Monumento gótico civil declarado Patrimonio de la Humanidad.", "Valencia", "Carrer de la Llotja, 2", "39.474444,-0.378333"),
                                new PointOfInterest("Jardín del Turia", "Parque lineal urbano situado en el antiguo cauce del río Turia.", "Valencia", "Antiguo cauce del Turia", "39.479500,-0.366200"))));

                tourRepository.save(new Tour("Bilbao, España",
                                "Visita el museo Guggenheim y degusta los mejores pintxos.", List.of(
                                new PointOfInterest("Museo Guggenheim", "Museo de arte contemporáneo diseñado por Frank Gehry.", "Bilbao", "Avenida Abandoibarra, 2", "43.268636,-2.934001"),
                                new PointOfInterest("Casco Viejo", "Corazón histórico de la ciudad repleto de bares de pintxos.", "Bilbao", "Plaza Nueva, s/n", "43.258889,-2.923889"),
                                new PointOfInterest("Puente Zubizuri", "Puente peatonal curvo con suelo de cristal diseñado por Calatrava.", "Bilbao", "Zubizuri, s/n", "43.266389,-2.927500"),
                                new PointOfInterest("Teatro Arriaga", "Teatro histórico inspirado en la Ópera de París.", "Bilbao", "Plaza Arriaga, 1", "43.259722,-2.925278"),
                                new PointOfInterest("Mirador de Artxanda", "Mirador con vistas panorámicas de toda la ría.", "Bilbao", "Monte Artxanda", "43.273056,-2.922222"))));

                tourRepository.save(
                                new Tour("Granada, España", "Déjate cautivar por la majestuosidad de la Alhambra.", List.of(
                                new PointOfInterest("La Alhambra", "Palacio y fortaleza andalusí con los icónicos Palacios Nazaríes.", "Granada", "Calle Real de la Alhambra, s/n", "37.177336,-3.589999"),
                                new PointOfInterest("El Generalife", "Villa y jardines de recreo utilizados por los reyes nazaríes.", "Granada", "Camino Viejo de la Alhambra, s/n", "37.177778,-3.585556"),
                                new PointOfInterest("Mirador de San Nicolás", "Vistas icónicas a la Alhambra con Sierra Nevada de fondo.", "Granada", "Plaza de San Nicolás, s/n", "37.181389,-3.592778"),
                                new PointOfInterest("Catedral de Granada", "Templo renacentista donde descansan los Reyes Católicos.", "Granada", "Calle Gran Vía de Colón, 5", "37.176389,-3.598889"),
                                new PointOfInterest("Barrio del Sacromonte", "Famoso por sus casas cueva y su tradición flamenca.", "Granada", "Camino del Sacromonte, s/n", "37.182222,-3.583333"))));

                tourRepository.save(new Tour("Málaga, España", "Sol, playa y el museo de su hijo predilecto, Picasso.", List.of(
                                new PointOfInterest("Alcazaba de Málaga", "Palacio-fortaleza islámica construida en las faldas del monte Gibralfaro.", "Málaga", "Calle Alcazabilla, 2", "36.721111,-4.416667"),
                                new PointOfInterest("Castillo de Gibralfaro", "Fortaleza militar del siglo XIV con mirador sobre la bahía.", "Málaga", "Camino de Gibralfaro, 11", "36.723611,-4.411111"),
                                new PointOfInterest("Museo Picasso", "Colección representativa del pintor en el Palacio de Buenavista.", "Málaga", "Calle San Agustín, 8", "36.722222,-4.418056"),
                                new PointOfInterest("Catedral de Málaga", "Catedral renacentista famosa por su torre sur inacabada.", "Málaga", "Calle Molina Lario, 9", "36.720278,-4.419722"),
                                new PointOfInterest("Teatro Romano", "Vestigio de la Malacca romana al pie de la Alcazaba.", "Málaga", "Calle Alcazabilla, s/n", "36.721667,-4.417222"))));

                tourRepository.save(new Tour("Toledo, España",
                                "La ciudad de las tres culturas te espera con su rica historia.", List.of(
                                new PointOfInterest("Catedral de Toledo", "Obra cumbre de la arquitectura gótica en España.", "Toledo", "Calle Cardenal Cisneros, 1", "39.857222,-4.024444"),
                                new PointOfInterest("Alcázar de Toledo", "Fortificación sobre rocas en la parte más alta de la ciudad.", "Toledo", "Calle de la Paz, s/n", "39.858056,-4.020556"),
                                new PointOfInterest("Sinagoga de Santa María la Blanca", "Monumento mudéjar que sirvió como principal sinagoga judía.", "Toledo", "Calle de los Reyes Católicos, 4", "39.856944,-4.029444"),
                                new PointOfInterest("San Juan de los Reyes", "Monasterio gótico-isabelino mandado construir por los Reyes Católicos.", "Toledo", "Calle de los Reyes Católicos, 17", "39.857778,-4.031944"),
                                new PointOfInterest("Mirador del Valle", "Punto panorámico sobre el meandro del río Tajo.", "Toledo", "Carretera de Circunvalación, s/n", "39.849167,-4.026389"))));

                tourRepository.save(new Tour("Córdoba, España",
                                "Piérdete en su impresionante Mezquita-Catedral y sus patios.", List.of(
                                new PointOfInterest("Mezquita-Catedral", "Bosque de columnas y arcos de herradura bicolores emblemáticos.", "Córdoba", "Calle del Cardenal Herrero, 1", "37.879167,-4.779722"),
                                new PointOfInterest("Alcázar de los Reyes Cristianos", "Fortaleza militar con bellos jardines mudéjares y fuentes.", "Córdoba", "Plaza Campo Santo, s/n", "37.876944,-4.781667"),
                                new PointOfInterest("Puente Romano", "Puente histórico de 16 arcos sobre el río Guadalquivir.", "Córdoba", "Avenida del Alcázar, s/n", "37.876389,-4.777778"),
                                new PointOfInterest("Calleja de las Flores", "Estrecha calle peatonal andaluza decorada con macetas y flores.", "Córdoba", "Calleja de las Flores, 1", "37.880556,-4.779444"),
                                new PointOfInterest("Medina Azahara", "Yacimiento arqueológico de la fastuosa ciudad califal omeya.", "Córdoba", "Ctra. de Palma del Río, km 5.5", "37.886389,-4.867222"))));

                tourRepository.save(new Tour("Santiago de Compostela, España",
                                "El destino final del famoso Camino, con su imponente Catedral.", List.of(
                                new PointOfInterest("Catedral de Santiago", "Meta del Camino de Santiago con el Pórtico de la Gloria.", "Santiago de Compostela", "Praza do Obradoiro, s/n", "42.880556,-8.544444"),
                                new PointOfInterest("Praza do Obradoiro", "Centro monumental rodeado por la Catedral y el Pazo de Raxoi.", "Santiago de Compostela", "Praza do Obradoiro", "42.880833,-8.545833"),
                                new PointOfInterest("Parque de la Alameda", "Parque histórico con robledales y vistas privilegiadas.", "Santiago de Compostela", "Paseo da Ferradura, s/n", "42.877222,-8.548889"),
                                new PointOfInterest("Mercado de Abastos", "Mercado tradicional con los mejores mariscos gallegos.", "Santiago de Compostela", "Rúa das Ameas, s/n", "42.879722,-8.540833"),
                                new PointOfInterest("San Martiño Pinario", "Monasterio benedictino con impresionante fachada barroca.", "Santiago de Compostela", "Praza da Inmaculada, 3", "42.882222,-8.543889"))));

                tourRepository.save(new Tour("París, Francia",
                                "La ciudad del amor, la Torre Eiffel y el museo del Louvre.", List.of(
                                new PointOfInterest("Torre Eiffel", "Icónico monumento de hierro forjado en el Campo de Marte.", "París", "Champ de Mars, 5 Av. Anatole France", "48.858370,2.294481"),
                                new PointOfInterest("Museo del Louvre", "El museo nacional de arte más visitado del mundo, hogar de la Gioconda.", "París", "Rue de Rivoli", "48.860611,2.337644"),
                                new PointOfInterest("Catedral de Notre-Dame", "Catedral gótica medieval en la Île de la Cité.", "París", "6 Parvis Notre-Dame", "48.852968,2.349902"),
                                new PointOfInterest("Arco de Triunfo", "Monumento erigido por Napoleón al final de los Campos Elíseos.", "París", "Place Charles de Gaulle", "48.873792,2.295028"),
                                new PointOfInterest("Sacré-Cœur", "Templo blanco en la colina de Montmartre con vistas de todo París.", "París", "35 Rue du Chevalier de la Barre", "48.886705,2.343104"))));

                tourRepository.save(new Tour("Roma, Italia", "Un museo al aire libre con el Coliseo y el Vaticano.", List.of(
                                new PointOfInterest("Coliseo Romano", "Anfiteatro del Imperio romano para combates de gladiadores.", "Roma", "Piazza del Colosseo, 1", "41.890210,12.492231"),
                                new PointOfInterest("Fontana di Trevi", "Monumento barroco famoso por la tradición de arrojar monedas.", "Roma", "Piazza di Trevi", "41.900932,12.483313"),
                                new PointOfInterest("Panteón de Agripa", "Antiguo templo romano con su majestuosa cúpula de hormigón.", "Roma", "Piazza della Rotonda", "41.898611,12.476944"),
                                new PointOfInterest("Basílica de San Pedro", "Templo principal del catolicismo situado en el Vaticano.", "Roma", "Piazza San Pietro", "41.902167,12.453917"),
                                new PointOfInterest("Foro Romano", "Zona central de la Roma republicana e imperial con ruinas.", "Roma", "Via della Salara Vecchia", "41.892461,12.485325"))));

                tourRepository.save(new Tour("Londres, Reino Unido",
                                "Historia y modernidad junto al Big Ben y el London Eye.", List.of(
                                new PointOfInterest("Big Ben", "Sede del Parlamento británico y su célebre torre del reloj.", "Londres", "Westminster", "51.500729,-0.124625"),
                                new PointOfInterest("London Eye", "Noria panorámica en la orilla sur del río Támesis.", "Londres", "Riverside Building", "51.503324,-0.119543"),
                                new PointOfInterest("Torre de Londres", "Fortaleza medieval histórica que custodia las Joyas de la Corona.", "Londres", "London EC3N 4AB", "51.508112,-0.075949"),
                                new PointOfInterest("Tower Bridge", "Puente basculante y colgante de estilo victoriano sobre el Támesis.", "Londres", "Tower Bridge Rd", "51.505500,-0.075400"),
                                new PointOfInterest("Museo Británico", "Museo enciclopédico con reliquias mundiales.", "Londres", "Great Russell St", "51.519413,-0.126957"))));

                tourRepository.save(new Tour("Berlín, Alemania",
                                "Una ciudad llena de historia y una vibrante cultura alternativa.", List.of(
                                new PointOfInterest("Puerta de Brandeburgo", "Monumento neoclásico símbolo de la paz alemana.", "Berlín", "Pariser Platz", "52.516275,13.377704"),
                                new PointOfInterest("Edificio del Reichstag", "Sede del Parlamento alemán con su cúpula de cristal.", "Berlín", "Platz der Republik 1", "52.518621,13.376198"),
                                new PointOfInterest("East Side Gallery", "Sección del Muro de Berlín cubierta de murales.", "Berlín", "Mühlenstraße 3-100", "52.505000,13.439722"),
                                new PointOfInterest("Monumento al Holocausto", "Campo de estelas de hormigón en memoria histórica.", "Berlín", "Cora-Berliner-Straße 1", "52.513889,13.378889"),
                                new PointOfInterest("Isla de los Museos", "Complejo museístico Patrimonio de la Humanidad.", "Berlín", "Museumsinsel", "52.521111,13.401111"))));

                tourRepository.save(
                                new Tour("Ámsterdam, Países Bajos", "Pasea en bicicleta por sus famosos canales.", List.of(
                                new PointOfInterest("Rijksmuseum", "Museo Nacional dedicado a las artes y la historia holandesa.", "Ámsterdam", "Museumstraat 1", "52.359998,4.885278"),
                                new PointOfInterest("Museo Van Gogh", "La mayor colección mundial de obras del pintor.", "Ámsterdam", "Museumplein 6", "52.358417,4.881083"),
                                new PointOfInterest("Casa de Ana Frank", "Casa-museo en el ático donde se escondió durante la ocupación.", "Ámsterdam", "Westermarkt 20", "52.375218,4.883977"),
                                new PointOfInterest("Plaza Dam", "Centro histórico y neurálgico con el Palacio Real.", "Ámsterdam", "Dam Square", "52.373056,4.892778"),
                                new PointOfInterest("Vondelpark", "El parque urbano más extenso y popular de Ámsterdam.", "Ámsterdam", "Vondelpark", "52.358000,4.868000"))));

                tourRepository.save(new Tour("Praga, República Checa",
                                "La ciudad de las cien cúpulas con su encanto medieval.", List.of(
                                new PointOfInterest("Puente de Carlos", "Puente gótico adornado con 30 estatuas sobre el río Moldava.", "Praga", "Karlův most", "50.086500,14.411400"),
                                new PointOfInterest("Castillo de Praga", "El complejo palaciego medieval más grande del mundo.", "Praga", "Hradčany", "50.090833,14.400556"),
                                new PointOfInterest("Reloj Astronómico", "Reloj medieval en la fachada del Ayuntamiento.", "Praga", "Staroměstské nám. 1", "50.087028,14.420706"),
                                new PointOfInterest("Plaza de la Ciudad Vieja", "Plaza histórica rodeada de iglesias góticas.", "Praga", "Staroměstské náměstí", "50.087500,14.421389"),
                                new PointOfInterest("Catedral de San Vito", "Majestuosa catedral gótica situada dentro del castillo.", "Praga", "III. nádvoří 48/2", "50.090889,14.400500"))));

                tourRepository.save(
                                new Tour("Viena, Austria", "Elegancia imperial y música clásica en cada rincón.", List.of(
                                new PointOfInterest("Palacio de Schönbrunn", "Residencia de verano de los Habsburgo con jardines.", "Viena", "Schönbrunner Schloßstraße 47", "48.184516,16.311865"),
                                new PointOfInterest("Hofburg", "Antigua residencia invernal de la familia imperial austriaca.", "Viena", "Michaelerkuppel", "48.206389,16.365556"),
                                new PointOfInterest("Catedral de San Esteban", "Catedral gótica en el centro de Viena con tejado de mosaicos.", "Viena", "Stephansplatz 3", "48.208493,16.373118"),
                                new PointOfInterest("Palacio Belvedere", "Complejo barroco que alberga la obra 'El beso' de Klimt.", "Viena", "Prinz-Eugen-Straße 27", "48.191500,16.380900"),
                                new PointOfInterest("Ópera Estatal de Viena", "Uno de los teatros de ópera más prestigiosos del mundo.", "Viena", "Opernring 2", "48.203000,16.369100"))));

                tourRepository.save(new Tour("Budapest, Hungría",
                                "Relájate en sus baños termales tras recorrer el Danubio.", List.of(
                                new PointOfInterest("Parlamento de Budapest", "Imponente edificio neogótico a orillas del río Danubio.", "Budapest", "Kossuth Lajos tér 1-3", "47.507222,19.045556"),
                                new PointOfInterest("Bastión de los Pescadores", "Terraza neogótica y neorrománica con vistas panorámicas de Pest.", "Budapest", "Szentháromság tér", "47.502222,19.034722"),
                                new PointOfInterest("Puente de las Cadenas", "El puente colgante más antiguo y famoso que conecta Buda y Pest.", "Budapest", "Széchenyi Lánchíd", "47.499000,19.043700"),
                                new PointOfInterest("Balneario Széchenyi", "Uno de los mayores baños termales de Europa con piscinas.", "Budapest", "Állatkerti krt. 9-11", "47.518611,19.082500"),
                                new PointOfInterest("Castillo de Buda", "Palacio histórico de los reyes húngaros en la colina del castillo.", "Budapest", "Szent György tér 2", "47.496111,19.039722"))));

                tourRepository.save(new Tour("Atenas, Grecia",
                                "Cuna de la civilización occidental con la majestuosa Acrópolis.", List.of(
                                new PointOfInterest("Acrópolis y Partenón", "Antigua ciudadela con los templos clásicos más famosos.", "Atenas", "Dionysiou Areopagitou", "37.971536,23.726488"),
                                new PointOfInterest("Museo de la Acrópolis", "Moderno museo que custodia las obras maestras arqueológicas.", "Atenas", "Dionysiou Areopagitou 15", "37.968611,23.728333"),
                                new PointOfInterest("Ágora Antigua", "Centro cívico, comercial y político de la antigua Atenas.", "Atenas", "Adrianou 24", "37.975278,23.722500"),
                                new PointOfInterest("Barrio de Plaka", "Barrio histórico a los pies de la Acrópolis con tabernas.", "Atenas", "Plaka", "37.973000,23.730000"),
                                new PointOfInterest("Estadio Panatenaico", "Estadio histórico de mármol blanco sede de los Juegos Olímpicos.", "Atenas", "Leof. Vasileos Konstantinou", "37.968611,23.741111"))));

                tourRepository.save(new Tour("Nueva York, EE. UU.",
                                "La ciudad que nunca duerme te espera con Times Square y Central Park.", List.of(
                                new PointOfInterest("Central Park", "Vasto parque urbano en Manhattan con senderos y lagos.", "Nueva York", "Central Park, Manhattan", "40.785091,-73.968285"),
                                new PointOfInterest("Times Square", "Intersección comercial iluminada con pantallas publicitarias gigantes.", "Nueva York", "Manhattan, NY 10036", "40.758896,-73.985130"),
                                new PointOfInterest("Empire State Building", "Rascacielos art déco histórico con observatorio panorámico.", "Nueva York", "20 W 34th St.", "40.748817,-73.985428"),
                                new PointOfInterest("Estatua de la Libertad", "Monumento de cobre obsequiado por Francia ubicado en Liberty Island.", "Nueva York", "Liberty Island", "40.689247,-74.044502"),
                                new PointOfInterest("Puente de Brooklyn", "Puente colgante histórico que conecta Manhattan y Brooklyn.", "Nueva York", "Brooklyn Bridge", "40.706100,-73.996900"))));

                tourRepository.save(new Tour("Tokio, Japón", "Tecnología, tradición y una gastronomía inigualable.", List.of(
                                new PointOfInterest("Cruce de Shibuya", "El cruce peatonal más transitado y fotografiado del planeta.", "Tokio", "Shibuya City", "35.659500,139.700500"),
                                new PointOfInterest("Templo Senso-ji", "El templo budista más antiguo y significativo de Tokio.", "Tokio", "2 Chome-3-1 Asakusa", "35.714722,139.796667"),
                                new PointOfInterest("Tokyo Skytree", "Torre de telecomunicaciones, la estructura más alta de Japón.", "Tokio", "1 Chome-1-2 Oshiage", "35.710056,139.810700"),
                                new PointOfInterest("Santuario Meiji", "Santuario sintoísta rodeado por un frondoso bosque.", "Tokio", "1-1 Yoyogikamizonocho", "35.676389,139.699444"),
                                new PointOfInterest("Akihabara", "Centro neurálgico de la cultura otaku y electrónica.", "Tokio", "Sotokanda", "35.702222,139.774167"))));

                tourRepository.save(new Tour("Sídney, Australia", "Surf, playas y su icónica Casa de la Ópera.", List.of(
                                new PointOfInterest("Ópera de Sídney", "Obra maestra arquitectónica con diseño en forma de velas.", "Sídney", "Bennelong Point", "-33.856784,151.215297"),
                                new PointOfInterest("Puente de la Bahía", "Puente de arco de acero que conecta el centro financiero.", "Sídney", "Sydney Harbour Bridge", "-33.852222,151.210556"),
                                new PointOfInterest("Bondi Beach", "La playa de surf más emblemática de Australia.", "Sídney", "Bondi Beach", "-33.891475,151.276684"),
                                new PointOfInterest("Real Jardín Botánico", "Jardín botánico histórico con vistas a la bahía.", "Sídney", "Mrs Macquaries Rd", "-33.864167,151.216667"),
                                new PointOfInterest("The Rocks", "Barrio histórico con calles adoquinadas y pubs coloniales.", "Sídney", "The Rocks", "-33.859700,151.209000"))));

                tourRepository.save(new Tour("Río de Janeiro, Brasil",
                                "Carnaval, el Cristo Redentor y las playas de Copacabana.", List.of(
                                new PointOfInterest("Cristo Redentor", "Colosal estatua art déco en la cima del cerro del Corcovado.", "Río de Janeiro", "Parque Nacional da Tijuca", "-22.951916,-43.210487"),
                                new PointOfInterest("Pan de Azúcar", "Monolito de granito en la bahía de Guanabara accesible en teleférico.", "Río de Janeiro", "Urca", "-22.949167,-43.154444"),
                                new PointOfInterest("Playa de Copacabana", "Famosa playa con su icónico paseo marítimo ondulado.", "Río de Janeiro", "Avenida Atlântica", "-22.969444,-43.186389"),
                                new PointOfInterest("Escalera de Selarón", "Escalera urbana revestida con miles de azulejos de colores.", "Río de Janeiro", "R. Manuel Carneiro", "-22.915278,-43.179167"),
                                new PointOfInterest("Estadio Maracaná", "Templo legendario del fútbol brasileño y mundial.", "Río de Janeiro", "Av. Pres. Castelo Branco", "-22.912167,-43.230167"))));

                tourRepository.save(
                                new Tour("Buenos Aires, Argentina", "Tango, cultura y la mejor carne del mundo.", List.of(
                                new PointOfInterest("Obelisco", "Monumento histórico erigido en la céntrica avenida 9 de Julio.", "Buenos Aires", "Plaza de la República", "-34.603722,-58.381592"),
                                new PointOfInterest("Plaza de Mayo", "Centro político con la histórica Casa Rosada.", "Buenos Aires", "Balcarce 50", "-34.608056,-58.370278"),
                                new PointOfInterest("Teatro Colón", "Uno de los teatros de ópera con mejor acústica a nivel mundial.", "Buenos Aires", "Cerrito 628", "-34.601111,-58.383056"),
                                new PointOfInterest("Caminito", "Calle museo tradicional con casas de chapa colorida en La Boca.", "Buenos Aires", "Valle Iberlucea 1261", "-34.639444,-58.362778"),
                                new PointOfInterest("Cementerio de la Recoleta", "Necrópolis célebre por sus mausoleos neoclásicos.", "Buenos Aires", "Junín 1760", "-34.587778,-58.393056"))));

                tourRepository.save(new Tour("Ciudad del Cabo, Sudáfrica",
                                "Naturaleza salvaje y vistas increíbles desde Table Mountain.", List.of(
                                new PointOfInterest("Table Mountain", "Montaña de cima plana icónica que domina la ciudad.", "Ciudad del Cabo", "Table Mountain National Park", "-33.962500,18.409722"),
                                new PointOfInterest("V&A Waterfront", "Muelle histórico reconvertido en zona de ocio y gastronomía.", "Ciudad del Cabo", "19 Dock Rd", "-33.903611,18.420556"),
                                new PointOfInterest("Isla Robben", "Antigua prisión de máxima seguridad de Nelson Mandela.", "Ciudad del Cabo", "Table Bay", "-33.806667,18.366111"),
                                new PointOfInterest("Kirstenbosch", "Jardín botánico con pasarela elevada sobre la flora autóctona.", "Ciudad del Cabo", "Rhodes Dr", "-33.987500,18.432500"),
                                new PointOfInterest("Barrio Bo-Kaap", "Histórico barrio de casas de colores brillantes.", "Ciudad del Cabo", "Bo-Kaap", "-33.921389,18.414444"))));

                tourRepository.save(new Tour("El Cairo, Egipto",
                                "Misterio y antigüedad junto a las Grandes Pirámides de Guiza.", List.of(
                                new PointOfInterest("Pirámides de Guiza", "Las únicas maravillas del mundo antiguo que aún perduran.", "El Cairo", "Al Haram, Giza", "29.979175,31.134358"),
                                new PointOfInterest("Gran Museo Egipcio", "Museo monumental dedicado a los tesoros del Antiguo Egipto.", "El Cairo", "Cairo - Alexandria Desert Rd", "29.995000,31.119722"),
                                new PointOfInterest("Jan el-Jalili", "Mercado histórico medieval y zoco vibrante en el corazón islámico.", "El Cairo", "El-Gamaleya", "30.047778,31.262222"),
                                new PointOfInterest("Ciudadela de Saladino", "Fortificación medieval islámica con la Mezquita de Muhammad Alí.", "El Cairo", "Al Abageyah", "30.029722,31.261111"),
                                new PointOfInterest("Plaza Tahrir", "Centro neurálgico de la ciudad y sede del museo neoclásico.", "El Cairo", "Meret Basha", "30.044444,31.235556"))));

                tourRepository.save(new Tour("Estambul, Turquía", "Donde Oriente y Occidente se encuentran.", List.of(
                                new PointOfInterest("Santa Sofía", "Basílica bizantina convertida en mezquita con su colosal cúpula.", "Estambul", "Sultan Ahmet, Ayasofya", "41.008583,28.980175"),
                                new PointOfInterest("Mezquita Azul", "Templo famoso por sus seis minaretes y sus azulejos de Iznik.", "Estambul", "Sultan Ahmet", "41.005389,28.976825"),
                                new PointOfInterest("Palacio de Topkapi", "Centro administrativo del Imperio otomano durante siglos.", "Estambul", "Cankurtaran", "41.011389,28.983333"),
                                new PointOfInterest("Gran Bazar", "Uno de los mercados cubiertos más antiguos y extensos del planeta.", "Estambul", "Beyazıt", "41.010556,28.968056"),
                                new PointOfInterest("Cisterna Basílica", "Antiguo depósito subterráneo de agua con columnas de mármol.", "Estambul", "Alemdar", "41.008333,28.977778"))));

                tourRepository.save(new Tour("Bangkok, Tailandia",
                                "Templos dorados, mercados flotantes y vida callejera vibrante.", List.of(
                                new PointOfInterest("Gran Palacio Real", "Complejo palaciego dorado residencia de los monarcas siameses.", "Bangkok", "Na Phra Lan Rd", "13.750000,100.491389"),
                                new PointOfInterest("Wat Phra Kaew", "El templo budista más sagrado y reverenciado de Tailandia.", "Bangkok", "Na Phra Lan Rd", "13.751389,100.492500"),
                                new PointOfInterest("Wat Pho", "Templo que alberga un colosal Buda dorado reclinado de 46 metros.", "Bangkok", "2 Sanam Chai Rd", "13.746667,100.493333"),
                                new PointOfInterest("Wat Arun", "Templo budista junto al río con su icónica aguja decorada con porcelana.", "Bangkok", "158 Thanon Wang Doem", "13.743611,100.488889"),
                                new PointOfInterest("Mercado Chatuchak", "Inmenso mercado de fin de semana con miles de puestos tradicionales.", "Bangkok", "Kamphaeng Phet 2 Rd", "13.799722,100.550278"))));

                tourRepository.save(
                                new Tour("Dubái, EAU", "Lujo deslumbrante, rascacielos infinitos y el Burj Khalifa.", List.of(
                                new PointOfInterest("Burj Khalifa", "El rascacielos y estructura más alta construida por el ser humano.", "Dubái", "1 Sheikh Mohammed bin Rashid Blvd", "25.197197,55.274376"),
                                new PointOfInterest("Dubai Mall", "Uno de los centros comerciales más grandes del mundo con acuario gigante.", "Dubái", "Downtown Dubai", "25.198500,55.279600"),
                                new PointOfInterest("Burj Al Arab", "Hotel de lujo con icónica silueta en forma de vela en su isla privada.", "Dubái", "Jumeirah St", "25.141300,55.185300"),
                                new PointOfInterest("Dubai Marina", "Canal artificial rodeado de rascacielos residenciales y paseo de yates.", "Dubái", "Dubai Marina", "25.080000,55.140000"),
                                new PointOfInterest("Palm Jumeirah", "Isla artificial en forma de palmera con resorts y parques.", "Dubái", "Palm Jumeirah", "25.112400,55.139000"))));

                tourRepository.save(new Tour("Kioto, Japón",
                                "Santuarios milenarios, jardines zen y la magia de las geishas.", List.of(
                                new PointOfInterest("Fushimi Inari-taisha", "Santuario principal dedicado a Inari con miles de toriis rojos.", "Kioto", "68 Fukakusa Yabunouchicho", "34.967140,135.772672"),
                                new PointOfInterest("Kinkaku-ji", "Templo zen cuyas dos plantas superiores están recubiertas de hojas de oro puro.", "Kioto", "1 Kinkakujicho", "35.039370,135.729243"),
                                new PointOfInterest("Bosque de Bambú", "Sendero natural flanqueado por altos tallos de bambú en Arashiyama.", "Kioto", "Sagatenryuji Murakincho", "35.017000,135.671000"),
                                new PointOfInterest("Kiyomizu-dera", "Templo budista con un mirador de madera elevado sin clavos.", "Kioto", "1 Chome-294 Kiyomizu", "34.994857,135.785046"),
                                new PointOfInterest("Barrio de Gion", "Distrito tradicional con casas de té machiya frecuentadas por geishas.", "Kioto", "Gion", "35.003700,135.777200"))));
        }
    }
}
