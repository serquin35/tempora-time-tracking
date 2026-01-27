# FAQ, Resolución de Problemas y Soporte Inteligente
Versión del Documento: 1.1 - Enero 2026

## 1. Preguntas Frecuentes (FAQ)

### 1.1 Uso General y Tracking
**P: ¿Puedo usar Tempora sin conexión a internet?**
**R:** Sí. Tempora es **Offline-First**. Los timers, ediciones y creaciones de proyectos se guardan localmente en tu dispositivo (IndexedDB) y se sinzronizan automáticamente con la nube en segundo plano una vez recuperas la conexión. Es seguro trabajar en trenes o aviones. *Advertencia: No cierres sesión (Logout) ni borres datos del navegador mientras estés offline.*

**P: Olvidé detener el timer el viernes y corrió todo el fin de semana (50+ horas). ¿Qué hago?**
**R:** El sistema tiene detección de "Timers Zombis". Al entrar de nuevo, Tempora detectará la anomalía (>12h) y lanzará un asistente de recuperación. Te permitirá:
1.  Descartar el exceso y ajustar la hora de fin al último momento donde hubo actividad en el navegador o teclado.
2.  Editar manualmente la hora de fin a cuando realmente terminaste (ej. Viernes 18:00).
3.  Mantenerlo si realmente fue una jornada maratoniana.

**P: ¿Cómo maneja Tempora las zonas horarias en equipos internacionales?**
**R:** Todos los datos se normalizan a **UTC** en la base de datos. Cada usuario ve los tiempos convertidos a *su* zona horaria local. Si Juan (España) registra una tarea a las 15:00 CET, María (México) la verá como realizada a las 08:00 CST. Esto garantiza una consistencia cronológica perfecta en los reportes globales.

### 1.2 Datos y Migración
**P: Vengo de Toggl/Clockify. ¿Puedo importar mis datos?**
**R:** Sí. En `Configuración > Importar`, disponemos de un asistente (wizard) para subir archivos CSV exportados de otras herramientas. El sistema intentará inteligentemente mapear o crear: Clientes, Proyectos y Etiquetas basados en el archivo.

**P: ¿Puedo exportar mis datos si decido irme?**
**R:** Absolutamente. No creemos en el "Vendor Lock-in". Puedes exportar la totalidad de tu historial en formato JSON o CSV granular desde la sección `Perfil > Exportar Datos`.

### 1.3 Facturación y Pagos
**P: ¿Qué pasa si mi tarjeta caduca siendo usuario Premium?**
**R:** Tienes un periodo de gracia de 7 días con funcionalidad completa. Después, la cuenta pasa a estado "Read-Only" (Lectura): podrás ver y exportar tus datos, pero no crear nuevos registros hasta actualizar el método de pago. **Nunca** borramos tus datos por un impago involuntario.

## 2. Asistente IA Integrado (Soporte Nivel 2)
Tempora incluye un agente de IA accesible desde el chat de soporte.

### 2.1 Capacidades RAG (Retrieval-Augmented Generation)
El bot no solo responde preguntas genéricas ("¿Cómo cambio mi contraseña?"); tiene acceso de lectura seguro a *tus* metadatos de uso (sin ver contenido sensible) para responder preguntas contextuales:
*   *"¿Cuánto tiempo dediqué al Cliente X el mes pasado?"* -> La IA consulta tus reportes y te da la cifra exacta.
*   *"No recuerdo en qué estuve trabajando el martes por la tarde"* -> La IA revisa tu log de actividad y te hace un resumen.
*   *"Ayúdame a redactar una descripción para esta factura"* -> Genera textos profesionales basados en las tareas realizadas.

### 2.2 Privacidad de la IA
*   Tus datos de tiempo **NO** se usan para entrenar modelos públicos.
*   El contexto se inyecta efímeramente solo durante tu conversación y se borra posteriormente.

## 3. Canales de Soporte Humano
Si la IA no puede resolverlo, nuestro equipo está disponible:
*   **Chat en Vivo:** Escalado a agente humano (Horario comercial CET).
*   **Email Prioritario:** `soporte@tempora.app` (Respuesta < 4h para planes Premium).
*   **Feature Requests:** Portal público de roadmap donde puedes votar por nuevas funcionalidades.
