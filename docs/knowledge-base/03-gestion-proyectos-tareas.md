# Gestión de Proyectos, Tareas, Clientes y Presupuestos
Versión del Documento: 1.1 - Enero 2026

## 1. Jerarquía de Organización del Trabajo
Tempora utiliza una estructura estricta pero flexible para mantener tus datos ordenados:
`Cliente` > `Proyecto` > `Tarea` > `Entrada de Tiempo`

### 1.1 Clientes
Entidades externas a las que facturas.
*   Actúan como contenedores de alto nivel para múltiples proyectos.
*   Pueden tener datos asociados como dirección fiscal, moneda por defecto y email de contacto para envío de reportes.

### 1.2 Proyectos
El eje central de la organización. Un proyecto define las reglas de facturación y presupuesto.

#### Tipos de Proyectos (Billing Modes)
1.  **Billable (Facturable por Hora):** El modo estándar. Cada hora registrada se multiplica por una tarifa (Rate).
    *   *Project Rate:* Tarifa única para todo el proyecto (ej. $50/h).
    *   *Member Rate:* La tarifa depende de quién realice el trabajo (ej. Senior $80/h, Junior $40/h).
    *   *Task Rate:* La tarifa depende del tipo de tarea (ej. Desarrollo $60/h, Diseño $50/h).
2.  **Fixed Fee (Precio Fijo):** El proyecto tiene un precio total acordado (ej. $5,000). El tracking descuenta del presupuesto interno, calculando la rentabilidad real vs. el precio vendido.
3.  **Non-Billable (Interno):** Para trabajo administrativo, formación o preventa. No genera deuda al cliente pero consume capacidad del equipo.

![Vista de Proyectos](/help/screenshots/projects-grid.jpg)
*Grid de proyectos mostrando presupuestos, progreso y estados*

### 1.3 Tareas
Unidades de trabajo específicas dentro de un proyecto.
*   **Hitos:** Pueden configurarse como entregables con fecha límite.
*   **Favoritos:** Marca tareas recurrentes (ej. "Reunión Semanal") como favoritas para que aparezcan siempre al inicio de tu autocompletado en el tracker.

## 2. Gestión de Presupuestos y Control
Evita el "Scope Creep" (alcance no controlado) con herramientas de monitoreo financiero.

### 2.1 Presupuestos de Tiempo y Dinero
Puedes definir presupuestos a nivel de Proyecto:
*   **Total de Horas:** "Este proyecto tiene un techo de 100 horas".
*   **Total Monetario:** "El presupuesto es de $5,000".

### 2.2 Alertas Inteligentes
Configura notificaciones automáticas (Email o In-App) cuando el consumo del proyecto alcance umbrales críticos:
*   **50% Consumido:** Aviso preventivo.
*   **80% Consumido:** Aviso de riesgo (momento de hablar con el cliente o reajustar alcance).
*   **100% Consumido:** Aviso de exceso (el trabajo adicional será pérdida o requerirá re-negociación).

## 3. Categorización Transversal (Tags)
Más allá de la jerarquía vertical (Cliente/Proyecto), Tempora ofrece **Etiquetas (Tags)** para análisis horizontal.
*   **Uso:** Añade tags a cualquier entrada de tiempo. Ej: `#Urgente`, `#Móvil`, `#Bug`, `#Feature`.
*   **Análisis:** Permite responder preguntas transversales: "¿Cuánto tiempo gastamos en arreglar `#Bugs` a través de *todos* los proyectos de la agencia?".
*   **Requerido:** Puedes configurar un proyecto para que "Exija al menos un tag" antes de permitir guardar una entrada, forzando la categorización.

## 4. Dashboard de Proyecto
Cada proyecto tiene su propio "Micro-Dashboard" que muestra:
*   **Burn-down Chart:** Velocidad de consumo del presupuesto.
*   **Equipo:** Lista de miembros asignados y su contribución relativa (quién ha trabajado más).
*   **Rentabilidad:** (Solo Admins) Coste interno (basado en salarios) vs. Ingreso facturable.

---
*Para ver cómo facturar estos proyectos, consulte la guía de Reportes.*
