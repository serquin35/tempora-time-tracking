# Guía de Uso: Tracking de Tiempo, Timer y Entradas Manuales
Versión del Documento: 1.1 - Enero 2026

## 1. El Módulo de Tracking (Core)
El corazón de Tempora es el cronómetro. Hemos diseñado este módulo para cubrir todas las casuísticas de la vida real: desde el trabajo en tiempo real hasta la reconstrucción de jornadas pasadas.

### 1.1 El Timer Reactivo
*   **Inicio Instantáneo:** La barra de input principal permite escribir la descripción de la tarea (ej. "Diseño de interfaz") y presionar `Enter` para iniciar inmediatamente.
*   **Asignación de Contexto (Obligatorio/Opcional):**
    *   Si no seleccionas proyecto, la entrada se guarda en un estado de "Inbox" (Sin Proyecto) para ser clasificada posteriormente. Esto prioriza la velocidad de captura.
    *   **Smart Autocomplete:** Al escribir, el sistema sugiere tareas recientes, nombres de proyectos o clientes basándose en tu historial frecuente.
*   **Modo Continuo (Server-Side Tracking):** El timer no vive en tu navegador, vive en el servidor. Puedes cerrar la pestaña, apagar el ordenador o cambiar de dispositivo, y el timer seguirá corriendo. Nunca perderás tiempo por un reinicio accidental.

> **Nota Importante:** Si inicias un timer en un dispositivo y lo detienes en otro, la duración se calculará con precisión de servidor, ignorando cualquier diferencia horaria local entre tus dispositivos.


### 1.2 Edición Manual y Modo "Bulk"
No siempre es posible trackear en tiempo real. Tempora ofrece herramientas potentes para la entrada diferida:
*   **Time Grid:** Una vista visual (tipo calendario) donde puedes hacer clic y arrastrar para crear bloques de tiempo. Ideal para "rellenar huecos" al final del día.
*   **Formulario de Precisión:** Permite entradas exactas (ej. "De 14:00 a 16:30") con validación automática de solapamientos. El sistema te avisará si intentas registrar tiempo en un periodo que ya tiene actividad, evitando la doble facturación accidental.

## 2. Herramientas de Power User
Para los usuarios que viven en la herramienta, la velocidad es crítica.

### 2.1 Atajos de Teclado Globales
Tempora soporta navegación completa por teclado:
*   `N`: **Nuevo timer**. Pone el foco en el input de descripción.
*   `S`: **Stop**. Detiene el timer que esté corriendo actualmente.
*   `C`: **Continuar**. Inicia un nuevo timer duplicando la descripción y proyecto de la última entrada realizada (ideal para retomar tras una pausa).
*   `CTRL/CMD + K`: Abre la **Paleta de Comandos**. Desde aquí puedes navegar a proyectos, crear clientes o cambiar de workspace sin usar el ratón.
*   `ESC`: Cierra modales o cancela la edición actual.

## 3. Sincronización y Continuidad
### 3.1 Sincronización en Tiempo Real (Realtime)
El estado de tu timer se propaga instantáneamente a través de WebSockets.
*   Si inicias el timer en tu móvil, verás que se activa en tu escritorio en milisegundos.
*   Esto previene conflictos de "doble timer" activo en diferentes dispositivos.

### 3.2 Capacidad Offline-First
Tempora es una Progressive Web App (PWA) robusta:
*   **Sin Conexión:** Puedes iniciar, pausar y editar timers sin internet (ej. en un avión). Los datos se guardan localmente en IndexedDB.
*   **Sincronización Automática:** En cuanto recuperas la conexión, el sistema sube los cambios pendientes y resuelve conflictos automáticamente con el servidor ("Last Write Wins" para metadatos, fusión inteligente para tiempos).
*   **Alerta:** No cierres sesión (Logout) mientras estés offline, ya que esto borraría los datos locales pendientes de sincronizar.

### 3.3 Gestión de "Timers Zombis"
¿Olvidaste detener el timer el viernes y siguió corriendo todo el fin de semana?
*   Tempora detecta sesiones anormalmente largas (>12h configurable).
*   Al volver a entrar, verás un asistente de **"Recuperación de Timer"**:
    *   Opción A: "Sí, trabajé todo ese tiempo" (Mantiene el registro).
    *   Opción B: "Olvidé pararlo" (Te permite recortar el tiempo final a la última hora de actividad detectada o editarlo manualmente).

---
*Consulte la sección de Reportes para ver cómo visualizar estos datos.*
