# Uso de herramientas de IA

Este documento registra el uso que se le da a diferentes herramientas de inteligencia artificial a lo largo del TFG.

## Fase 1

* **Fecha:** Julio 2026
* **Objetivo:** Generación de plantillas de formato Markdown para estructurar la documentación del repositorio.
* **Herramienta:** Cuaderno de Google Gemini
* **Versión concreta:** Gemini 3.1 Pro
* **Cómo ha sido usada:** Se utilizó la IA como asistente de formateo para evitar errores de sintaxis en Markdown. Se le solicitó generar estructuras vacías (tablas, diagrama de Gantt en Mermaid) para rellenarlas manualmente. Un ejemplo de prompt utilizado fue: *"Hazme una tabla plantilla en markdown para rellenarla con todas las entidades con sus relaciones"*, si bien se utilizaron más prompts del estilo para el resto del documento README.md.

## Fase 2

* **Fecha:** 22/08/2026
* **Objetivo:** Resolución de errores de inicialización.
* **Herramienta:** Cuaderno de Google Gemini
* **Versión concreta:** Gemini 3.1 Pro
* **Cómo ha sido usada:** Se pegaron los *logs* de error de la terminal (error de carga del Driver de MySQL en Spring Boot y fallos de compilación por importación de archivos CSS borrados en Vite) para identificar y aplicar rápidamente la configuración faltante.

* **Fecha:** 23/08/2026
* **Objetivo:** Resolución de error en la API REST que causaba que todos los id estuvieran a 0 (ver ejemplo debajo).
* **Herramienta:** Cuaderno de Google Gemini
* **Versión concreta:** Gemini 3.1 Pro
* **Cómo ha sido usada:** Uso del prompt *¿Por qué la API REST devuelve a 0 los id?* con el código adjunto.

  {
    "id": 0,
    "name": "Tour 1",
    "description": "Tour de ejemplo numero 1"
  },
  {
    "id": 0,
    "name": "Tour 2",
    "description": "Tour de ejemplo numero 2"
  },
  {
    "id": 0,
    "name": "Tour 3",
    "description": "Tour de ejemplo numero 3"
  },
  {
    "id": 0,
    "name": "Tour 4",
    "description": "Tour de ejemplo numero 4"
  },
  {
    "id": 0,
    "name": "Tour 5",
    "description": "Tour de ejemplo numero 5"
  }

* **Fecha:** 24/08/2026
* **Objetivo:** Configuraciones iniciales de React Router
* **Herramienta:** Chat de Visual Studio Code
* **Modelo concreto:** GitHub Copilot
* **Cómo ha sido usada:** Utilizada para la resolución de errores debidos a una configuración de React Router inicial errónea, que impedía que index.tsx se renderizara.

* **Fecha:** 24/08/2026
* **Objetivo:** Resolución del siguiente error con la API REST: Unexpected token '<', "<!doctype "... is not valid JSON
* **Herramienta:** Chat de Visual Studio Code.
* **Modelo concreto:** GitHub Copilot.
* **Cómo ha sido usada:** Se le pregunta el origen del error mediante el prompt *Explícame este error. No quiero que lo resuelvas, quiero que me expliques por qué sucede.*. La respuesta de la herramienta da a entender que se el problema viene de usar rutas relativas sin especificar la URL completa del backend. La IA incluye en la respuesta información para configurar un proxy de desarrollo.

* **Fecha:** 24/08/2026
* **Objetivo:** Configuración de rutas relativas genéricas, pues en el uso anterior la IA configuró el proxy con la ruta "/tour"
* **Herramienta:** Chat de Visual Studio Code.
* **Modelo concreto:** GitHub Copilot.
* **Cómo ha sido usada:** Uso del prompt *«En el futuro habrá más endpoints. ¿No se puede hacer el proxy de una manera más genérica, de modo que pueda usar esa URL sin escribir localhost ni tener que hacer un proxy para cada nueva ruta?*, a lo que la IA responde enseñándme a dejar una ruta relativa común en el proxy.

* **Fecha:** 26/08/2026
* **Objetivo:** Comprensión del funcionamiento de Vitest con DOM Virtual y dobles.
* **Herramienta:** Cuaderno de Google Gemini.
* **Modelo concreto:** Gemini 3.1 Pro.
* **Cómo ha sido usada:** Uso de la IA para clarificar la documentación oficial de Vitest. Se le consultó acerca del funcionamiento de un DOM virtual, así como acerca de los conceptos `render`, `screen` y `vi.mock`para su comprensión. Posteriormente, y una vez comprendidos los conceptos necesarios para implementar el test, fue escrito de manera autónoma.

* **Fecha:** 27/08/2026
* **Objetivo:** Configuración de Testcontainers para Spring Boot.
* **Herramienta:** Chat de Visual Studio Code
* **Modelo concreto:** GitHub Copilot.
* **Cómo ha sido usada:** Se utiliza la herramienta debido a problemas para integrar el contenedor de Testcontainers con la clase TourService. La IA genera las líneas de configuración 45-57 de la clase TourServiceIntegrationTest. También enseña cómo usar perfiles para evitar que SampleDataService inyecte tours de ejemplo en el contenedor de prueba.

* **Fecha:** 29/08/2026
* **Objetivo:** Solución de errores CORS en la prueba de integración del frontend con la API REST.
* **Herramienta:** Chat de Visual Studio Code.
* **Modelo concreto:** GitHub Copilot.
* **Cómo ha sido usada:** Se le indicó al sistema el error de CORS: `Access to fetch at 'http://localhost:443/tour/all' from origin 'http://localhost:5173' has been blocked by CORS policy`. La IA explica que el problema no es la ruta sino que el backend no devuelve la cabecera `Access-Control-Allow-Origin`, por lo que el navegador bloquea la solicitud del componente React. Se usa esta ayuda para configurar la política de CORS en Spring Boot y validar la prueba de integración sin mockeo.

* **Fecha:** 31/08/2026
* **Fase:** Fase 2
* **Objetivo:** Resolución de dudas sintácticas en Rest Assured y tipado de aserciones en pruebas E2E.
* **Herramienta:** Cuaderno de Google Gemini
* **Versión concreta:** Gemini 3.1 Pro.
* **Cómo ha sido usada:** Consulta sobre la sintaxis de la librería Rest Assured (importaciones estáticas, diferencias conceptuales entre `RestAssuredMockMvc` y la ejecución sobre un servidor web en puerto dinámico, y métodos de extracción de arrays JSON). Se utilizó la IA para clarificar el manejo de matchers de Hamcrest (`hasItems`, `hasSize`) y solucionar una colisión de tipos estricta entre identificadores de tipo `Long` y literales numéricos enteros en las aserciones.

* **Fecha:** 03/09/2026
* **Fase:** Fase 2
* **Objetivo:** Selección de base de datos en pruebas E2E
* **Herramienta:** Cuaderno de Google Gemini
* **Versión concreta:** Gemini 3.1 Pro.
* **Cómo ha sido usada:** Se planteó a la IA el dilema de utilizar un servicio de MySQL externo en GitHub Actions frente al uso de Testcontainers para las pruebas de sistema E2E. La IA analizó pros y contras de cada enfoque y argumentó a favor del de Testcontainers (indicando que es el estándar en la industria) para garantizar la portabilidad y la reproducibilidad.

* **Fecha:** 03/09/2026
* **Fase:** Fase 2
* **Objetivo:** Resolución de errores en el ciclo de vida del Testcontainers y fallos de compilación intermitentes.
* **Herramienta:** Cuaderno de Google Gemini
* **Versión concreta:** Gemini 3.1 Pro.
* **Cómo ha sido usada:** La IA se utilizó como soporte técnico para identificar la causa de excepciones `NoSuchBeanDefinitionException` originadas por una incompatibilidad entre Java 25 y la librería MapStruct.

* **Fecha:** 04/09/2026
* **Fase:** Fase 2
* **Objetivo:** Configuración y depuración del workflow completo de integración continua.
* **Herramienta:** Chat de Visual Studio Code.
* **Modelo concreto:** GitHub Copilot.
* **Cómo ha sido usada:** La IA se utilizó como apoyo para resolver problemas relacionados con la configuración de MySQL nativo en los runners de GitHub Actions, incluyendo la autenticación del usuario `root`, la creación de la base de datos y la configuración de las credenciales utilizadas por Spring Boot. También ayudó con otros problemas como condiciones de carrera entre forntend y backend.

## Fase 3

* **Fecha:** 17/09/2026
* **Fase:** Fase 3
* **Objetivo:** Maquetación de la interfaz de usuario en frontend
* **Herramienta:** Claude Design.
* **Modelo concreto:** Sonnet 5.
* **Cómo ha sido usada:** Utilizada para maquetar en React los bocetos de pantallas dibujados a mano durante la fase 1. A la IA se le pasan dichos bocetos para que genere a partir de ellos plantillas sin funcionalidad en React, agilizando el desarrollo del diseño estético de la interfaz de usuario.

* **Fecha:** 22/09/2026
* **Fase:** Fase 3
* **Objetivo:** Ayuda para implementar urls restringidas y protección de rutas.
* **Herramienta:** Cuderno de Google Gemini.
* **Modelo concreto:** Gemini 3.1 Pro.
* **Cómo ha sido usada:** La IA se utilizó como apoyo para implementar el sistema de rutas protegidas mediante React Router, diagnosticar y resolver problemas de caché e hidratación asíncrona con Zustand, corregir errores de renderizado condicional en Layouts y configurar redirecciones tras el login. En general, la IA se ha usado como asistente o guía, pues siempre se le han hecho indiciaciones de no proporcionar código (exceptuando dudas de sintaxis en react), si no de proporcionar validación de ideas.

* **Fecha:** 23/09/2026
* **Fase:** Fase 3
* **Objetivo:** Ayuda para implementar los test E2E de servidor.
* **Herramienta:** Cuderno de Google Gemini.
* **Modelo concreto:** Gemini 3.1 Pro.
* **Cómo ha sido usada:** Se utilizó la IA como asistente para implementar los test E2E de servidor, que involucran RestAssured, a raíz de errores con los endpoints de autorización al no conocer cómo usar la librería para recibir las cookies o enviar peticiones POST. 

* **Fecha:** 23/09/2026
* **Fase:** Fase 3
* **Objetivo:** Resolución de errores de renderizado y timeouts en pruebas E2E con Selenium.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro 
* **Cómo ha sido usada:** Se recurrió a la IA para depurar y arreglar excepciones de `TimeoutException` al no encontrar elementos del DOM en las pruebas E2E de cliente. La IA analizó los cuellos de botella de renderizado para ajustar los tiempos de espera de `WebDriverWait` y cambiar las estrategias de navegación directa a rutas específicas.

* **Fecha:** 23/09/2026
* **Fase:** Fase 3
* **Objetivo:** Corrección y ejecución de pruebas de integración en frontend con Vitest.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro 
* **Cómo ha sido usada:** Se utilizó la IA para resolver errores de petición a los endpoints de autorización, causados por el cambio a HTTPS en el backend

* **Fecha:** 23/09/2026
* **Fase:** Fase 3
* **Objetivo:** Depuración del workflow de integración continua (GitHub Actions) y problemas con CORS/SSL.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro 
* **Cómo ha sido usada:** La IA actuó de forma autónoma para investigar y resolver un problema complejo entre el navegador Headless de Selenium, problemas de CORS provenientes del cambio de HTTP a HTTPS en el backend y los certificados SSL autofirmados en el runner de GitHub Actions. Diagnosticó que Chrome bloqueaba las peticiones por seguridad e implementó la solución de desactivar HTTPS temporalmente en el entorno de pruebas, permitiendo la ejecución exitosa los test en el entorno CI.

* **Fecha:** 25/09/2026
* **Fase:** Fase 3
* **Objetivo:** Generación de tours y usuarios de ejemplo.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro 
* **Cómo ha sido usada:** Se le pide a la IA generar 30 tours de ejemplo, variando entre ciudades españolas y capitales de otros países, y 10 usuarios de ejemplo que combinan diferentes nombres y apellidos españoles.

* **Fecha:** 28/09/2026
* **Fase:** Fase 3
* **Objetivo:** Resolución de errores de estado residual en pruebas de integración, excepciones LazyInitializationException y ayuda con certificados SSL locales.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** . La IA corrige de forma autónoma un fallo de estado residual por el que los tests de integración del endopoint `getTourById` fallaban al ejecutarse en conjunto debido a que la base de datos incrementaba el ID y el test buscaba un identificador "1" harcodeado (solucionado obteniéndolo de forma dinámica).

* **Fecha:** 29/09/2026
* **Fase:** Fase 3
* **Objetivo:** Resolución de errores de contexto de React Router en pruebas unitarias de frontend con Vitest.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** Se utiliza la IA para solucionar un error en las pruebas unitarias que indicaba que el hook `useLocation()` solo puede usarse dentro de un componente.`<Router>`, al formar parte de la librería React Router. La herramienta explicó el uso de `<MemoryRouter>` y cómo inyectar rutas ficticias usando la propiedad `initialEntries` para falsear el estado de la URL, proporcionando el siguiente patrón de envoltorio para los tests:
  ```tsx
  render(
      <MemoryRouter initialEntries={["/tour/1"]}>
          <Routes>
              <Route path="/tour/:id" element={<TourDetail />} />
          </Routes>
      </MemoryRouter>
  );
  ```

* **Fecha:** 01/10/2026
* **Fase:** Fase 3
* **Objetivo:** Remodelación del navbar de usuario autenticado.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** Se utilizó la IA para pedirle renovar los aspectos estéticos y de accesibilidad del navbar cuando un usuario ha iniciado sesión. Al botón del perfil se le añade un desplegable que permite acceder a todas las páginas del área personal sin tener que pasar por el perfil, eliminando el botón de cerrar sesión para moverlo a este desplegable. El navbar pasa a ser el mismo para administradores, moviendo el botón de panel de admnisitrador al desplegable.

* **Fecha:** 03/10/2026
* **Fase:** Fase 3
* **Objetivo:** Guardar imágenes de ejemplo en SampleDataService.
* **Herramienta:** Chat de Visual Studio Code
* **Modelo concreto:** GitHub Copilot
* **Cómo ha sido usada:** Se le pidió a la IA que añadiese llamadas a los métodos addImageToTour y addImageToPoi en la clase SampleDataService para añadir 540 nuevas imágenes a los tour y puntos de interés.

* **Fecha:** 05/10/2026
**Fase:** Fase 3
* **Objetivo:** Remodelación de la página principal.
* **Herramienta:** Chat de Visual Studio Code
* **Modelo concreto:** GitHub Copilot
* **Cómo ha sido usada:** Se utiliza la IA para renovar estéticamente la página principal de la aplicación. Para ello, el carrusel de imágenes pasa a ocupar toda la parte superior de la página a modo de portada, mostrando imágenes e información de los 4 primeros tour que se cargan en la primera página de inicio mediante paginación. La lista de tours en cuadrícula junto a la barra de búqueda quedan ahora debajo del carrusel, y se añade sección para que el usuario acceda directamente a la página de creación de tour, pues hasta ahora solo era posible acceder a través de un botón en la página Mis Tours del usuario regsitrado, aún tratándose de la principal funcionalidad del proyecto.

* **Fecha:** 05/10/2026
**Fase:** Fase 3
* **Objetivo:** Resolución de problemas en GitHub Actions.
* **Herramienta:** Google Antigravty (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** Se utiliza la IA como apoyo para la resolución de múltiples problemas producidos en el sistema de CI:
  * La IA detecta que ciertas imágenes de ejemplo comenzaban por mayúscula: Al usar runners de GitHub Actions con Ubuntu, el sistema era sensible a mayúsculas y el backend no era capaz de cargar en base de datos las imágenes de ejemplo, causando fallo en los jobs tanto de backend como en frontend.
  * Después, el job de frontend sigue dando fallo. La IA descubre una condición de carrera causada por el gran volumen de imágenes que ahora carga el backend al iniciarse. Aunque anteriormente había un sleep de 30 segundos para segurar que el backend se levantaba antes que el frontend, estos segundos se volvieron insuficientes. Por ello, la IA propuso implementar una espera inteligente, que consulta en bucle cada 5 segundos si el backend ha terminado ya de iniciarse, esperando de este modo sólo el tiempo necesario y asegurando que cuando el frontend se inicie el backend esté completamente operativo. Para ello la IA generó el siguiente código: (complete-workflow.yml, líneas 93-94)
  
  ```yml
  - name: Wait for backend startup
        run: timeout 180 bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' localhost:8080/api/v1/tour/1)" != "200" ]]; do sleep 5; done' || false
  ```

* **Fecha:** 08/10/2026
* **Fase:** Fase 3
* **Objetivo:** Implementación de la previsualización de la imagen de perfil en el formulario de registro.
* **Herramienta:** Chat de Visual Studio Code
* **Modelo concreto:** GitHub Copilot
* **Cómo ha sido usada:** Se utilizó la IA como guía para implementar la previsualización de una imagen seleccionada antes de enviar el formulario. La IA explicó la diferencia entre el objeto `File`, que se envía al backend mediante `FormData`, y la URL temporal necesaria para mostrarlo en un elemento `img`. Para ello, se utilizó `URL.createObjectURL(file)` al seleccionar el archivo y `URL.revokeObjectURL` para liberar la URL temporal cuando deja de ser necesaria. También se orientó el renderizado condicional para mantener el texto de foto de perfil cuando no se ha seleccionado ninguna imagen.

* **Fecha:** 11/10/2026
* **Fase:** Fase 3
* **Objetivo:** Resolución de errores en la prueba E2E de cliente para el registro y acceso al perfil de usuario.
* **Herramienta:** Chat de Visual Studio Code
* **Modelo concreto:** GitHub Copilot
* **Cómo ha sido usada:** Se utilizó la IA para investigar un error de acceso denegado (403 Forbidden) que aparecía durante la prueba Selenium del registro de usuario. La IA identificó que las cookies de autenticación se devolvían con los atributos `Secure` y `SameSite=None`, lo que impedía conservar correctamente la sesión al acceder al frontend mediante el proxy HTTP de Vite en desarrollo. Como solución, se configuró el proxy de desarrollo para adaptar las cookies (`SameSite=Lax` y sin `Secure`) y se hizo que la prueba utilizase un correo electrónico único en cada ejecución. Además, se añadió una espera explícita de Selenium para esperar a la navegación posterior al registro. La IA añadió el siguiente bloque de código:(UserServiceClientE2ETest.java, líneas 62-70)

``` java
 wait.until(urlToBe("http://localhost:5173/"));

 // ... 

 WebElement userName = wait.until(
                visibilityOfElementLocated(By.className("ot-my-profile__name")));
        WebElement email = wait.until(visibilityOfElementLocated(By.xpath(
                "//dt[normalize-space()='Correo electrónico']/following-sibling::dd")));
        WebElement phone = wait.until(visibilityOfElementLocated(By.xpath(
                "//dt[normalize-space()='Número de teléfono']/following-sibling::dd")));
```

* **Fecha:** 11/10/2026
* **Fase:** Fase 3
* **Objetivo:** Mockeo del hook de Zustand (`useAuthStore`) y resolución de errores de tipos en test unitarios de frontend.
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** Se utilizó la IA para resolver problemas con el uso del store en los test de frontend. En las pruebas de integraciónse implementa el mock del hook con `vi.mock("../../src/store/auth-store")`. En las pruebas unitarias (`signup-test.tsx`).
La IA generó los siguientes bloques de código en los test unitarios (signup-integration-test.tsx, líneas 7-29):

``` tsx
const action = vi.hoisted(() => vi.fn());

vi.mock("../../src/service/user-service");
vi.mock("../../src/store/auth-store", () => {
    const doLogin = vi.fn().mockResolvedValue({ id: 10 });
    const refreshProfileImage = vi.fn();
    const useAuthStore = Object.assign(
        vi.fn(() => ({ doLogin, refreshProfileImage })),
        { doLogin, refreshProfileImage }
    );
    return { useAuthStore };
});

const useAuthStore = useAuthStoreOriginal as typeof useAuthStoreOriginal & {
    doLogin: ReturnType<typeof vi.fn>;
    refreshProfileImage: ReturnType<typeof vi.fn>;
};

vi.mock("react-router", () => ({ useNavigate: () => vi.fn() }));
vi.mock("react", async () => {
    const actual = await vi.importActual<typeof import("react")>("react");
    return {
        ...actual,
        useActionState: (
            callback: (state: unknown, formData: FormData) => Promise<unknown>,
            initialState: unknown
        ) => {
            const [state, setState] = actual.useState(initialState);
            action.mockImplementation(async (formData: FormData) => {
                const res = await callback(state, formData);
                await actual.act(async () => {
                    setState(res);
                });
            });
            return [state, action, false];
        }
    };
});
```

Y los siguientes bloques (signup-test, líneas 10-47): 
``` tsx
const action = vi.hoisted(() => vi.fn());

vi.mock("../../src/service/user-service");
vi.mock("../../src/store/auth-store", () => {
    const doLogin = vi.fn().mockResolvedValue({ id: 10 });
    const refreshProfileImage = vi.fn();
    const useAuthStore = Object.assign(
        vi.fn(() => ({ doLogin, refreshProfileImage })),
        { doLogin, refreshProfileImage }
    );
    return { useAuthStore };
});

const useAuthStore = useAuthStoreOriginal as typeof useAuthStoreOriginal & {
    doLogin: ReturnType<typeof vi.fn>;
    refreshProfileImage: ReturnType<typeof vi.fn>;
};

vi.mock("react-router", () => ({ useNavigate: () => vi.fn() }));
vi.mock("react", async () => {
    const actual = await vi.importActual<typeof import("react")>("react");
    return {
        ...actual,
        useActionState: (
            callback: (state: unknown, formData: FormData) => Promise<unknown>,
            initialState: unknown
        ) => {
            const [state, setState] = actual.useState(initialState);
            action.mockImplementation(async (formData: FormData) => {
                const res = await callback(state, formData);
                await actual.act(async () => {
                    setState(res);
                });
            });
            return [state, action, false];
        }
    };
});
```

* **Fecha:** 15/10/2026
* **Fase:** Fase 3
* **Objetivo:** Validar en backend los campos de formularios.
* **Herramienta:** Google Gemini
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** Se utilizó la IA para buscar alguna manera de evitar validar campos con grandes estructuras de bloques if-else y excpepciones. Propone el uso de Jakarta Validation, de modo que con escribir algunas anotaciones en los campos del DTO o clase a validar es suficiente para hacer cumplir ciertas reglas en los datos introducidos por el usuario. Además, la IA propone la creación de una clase para simplificar la respuesta generada y reducirla a un objeto JSON con un sólo campo de mensaje de error, que puede ser fácilmente mostrado en el lado del cliente. En concreto, la IA genera el código al completo de la clase GlobalExcetpionHanlder:

``` java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)

    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> response = new HashMap<>(); 
        FieldError firstError = ex.getBindingResult().getFieldErrors().get(0);
        response.put("message", firstError.getDefaultMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
```

* **Fecha:** 17/10/2026
* **Fase:** Fase 3
* **Objetivo:** Validar en frontend los campos de formularios.
* **Herramienta:** Google Gemini
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** De manera similar al anterior uso de IA, se le preguntó a la IA por librerías o sistemas predefinidos que
ya hayan resuelto el problema de la validación de campos de formularios en el cliente. La IA responde recomendando el uso de dos librerías:

- Zod: Una librería que, mediante la definición de esquemas y restricciones, puede procesar los datos enviados por los formularios para que cumplan las restricciones indicadas.

- React Hook Form: Una librería que ofrece un hook que simplifica la implementación de formularios y permite el uso de zod en los mismos. Se sutituye useActionState por esta librería.


* **Fecha:** 24/10/2026
* **Fase:** Fase 3
* **Objetivo:** Remodelar la página de error
* **Herramienta:** Google Antigravity (con acceso a los ficheros del proyecto)
* **Modelo concreto:** Google Gemini 3.1 Pro
* **Cómo ha sido usada:** Se le piden a la IA modificaciones estéticas para la pantalla de error, como la adición del logo de la web, el aumento de tamaño de toda la interfaz o el color rojo para el botón de cierre de sesión.