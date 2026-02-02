# Tempora: Visión General, Filosofía y Ecosistema
Versión del Documento: 1.1 - Enero 2026

## 1. Visión General: ¿Qué es Tempora?
Tempora no es simplemente un cronómetro digital; es una **Plataforma de Inteligencia Temporal** diseñada específicamente para freelancers de alto rendimiento, agencias creativas y equipos distribuidos que requieren precisión absoluta en su facturación y gestión de recursos.

A diferencia de las herramientas tradicionales que se centran en la vigilancia (micromanagement) o en el simple fichaje, Tempora se centra en el **empoderamiento**. Nuestra premisa es que el tiempo es el activo más valioso y volátil del trabajador del conocimiento, y su correcta gestión es la diferencia fundamental entre la rentabilidad sostenible y el agotamiento (burnout).

### 1.1 Propuesta de Valor
*   **Para el Freelancer:** Convierte cada minuto de trabajo en ingresos facturables sin esfuerzo administrativo. Elimina la "gestión fantasma" que nunca cobras.
*   **Para la Agencia:** Proporciona transparencia total al cliente y visibilidad real de la rentabilidad de cada proyecto, eliminando las conjeturas en los presupuestos.
*   **Para Equipos Remotos:** Sincroniza el trabajo asíncrono respetando las zonas horarias y la autonomía individual.

![Dashboard Principal de Tempora](/help/screenshots/dashboard-overview.jpg)
*Vista general del dashboard principal de Tempora*

## 2. Filosofía "Precision-First"
En Tempora, cada segundo cuenta. Nuestro diseño se basa en tres pilares filosóficos:

1.  **Frictionless Tracking (Tracking sin Fricción):**
    El motor de tracking está diseñado para minimizar la barrera entre la acción de trabajar y la de registrar. Si tardas más de 5 segundos en iniciar un timer, la herramienta ha fallado. Tempora utiliza autocompletado inteligente y atajos de teclado para que el registro sea casi subconsciente.

2.  **Transparencia Radical ("No Black Boxes"):**
    Todo registro es visible y auditab. Sabes exactamente qué se cobra y por qué. No hay cálculos ocultos. Los reportes reflejan la realidad cruda de la productividad, permitiendo decisiones basadas en datos, no en intuiciones.

3.  **Bienestar Integrado (Quality over Quantity):**
    No solo medimos horas productivas, medimos *calidad* de tiempo. Introducimos el concepto de "Medidor de Energía" en los registros, reconociendo que 1 hora de trabajo profundo (Deep Work) a las 9 AM no tiene el mismo "coste biológico" ni el mismo valor de output que 1 hora de trabajo superficial a las 9 PM.

## 3. Ecosistema y Diferenciación
Tempora se distingue por su arquitectura moderna y su integración profunda con flujos de trabajo avanzados.

### 3.1 Diferenciadores Clave
*   **Multi-Context Workspace Nativo:** A diferencia de competidores que parchean esta funcionalidad, Tempora fue construido desde el día 1 para manejar múltiples identidades (Freelance vs. Agencia A vs. Agencia B) sin mezclar datos ni contextos.
*   **AI-Driven Support (RAG):** Un asistente contextual que no da respuestas genéricas. Conoce tus datos (respetando privacidad estricta) para responder preguntas de negocio complejas como "¿Cuánto facturé al cliente X el mes pasado?" o "¿Qué días soy más productivo?".
*   **Automation-First Architecture:** Integración de primera clase con **n8n** y Webhooks. Tempora no es una isla; es el disparador de tus flujos de facturación, notificación y gestión de proyectos.

### 3.2 Stack Tecnológico y Seguridad
*   **Frontend:** React optimizado con Tailwind CSS para una interfaz reactiva, accesible y ultraligera.
*   **Backend:** Supabase (PostgreSQL) que garantiza integridad transaccional (ACID) y seguridad a nivel de fila (Row Level Security - RLS).
*   **Infraestructura:** Edge Functions para procesamiento de datos en tiempo real con latencia global mínima, garantizando que el timer se sienta instantáneo desde cualquier lugar del mundo.

---
*Este documento es parte de la Base de Conocimiento de Tempora. Para detalles operativos, consulte las guías específicas.*
