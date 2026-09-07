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
