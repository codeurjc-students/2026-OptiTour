# Registro de Cambios (Changelog)
Todos los cambios notables de OptiTour se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-09-09
### Añadido
- Inicialización del servidor backend monolítico con Spring Boot, configurado con Java 26 y el conector de MySQL.
- Creación del esqueleto de la SPA en el frontend usando React, TypeScript y Vite.
- Funcionalidad mínima implementada: conexión entre cliente, servidor y base de datos para mostrar datos básicos de la entidad `Tour`.
- Implementación de pruebas automáticas (unitarias, integración y E2E) mediante JUnit, Vitest, Testcontainers, Rest Assured y Selenium.
- Configuración de flujos de Integración Continua (CI) en GitHub Actions para el control de calidad básico y completo.
- Generación de la documentación interactiva de la API REST mediante OpenAPI (`api-docs.yaml` y `api-docs.html`).
- Creación y actualización de la documentación principal del proyecto en `README.md` (Fases 1 y 2).
- Creación del archivo `AI_USAGE.md` para el registro transparente del uso de Inteligencia Artificial durante el desarrollo.
