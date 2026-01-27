# Configuración, Seguridad, API y Automatización
Versión del Documento: 1.1 - Enero 2026

## 1. Configuración del Perfil y Preferencias
Personaliza tu experiencia en Tempora.

### 1.1 Identidad y Branding
*   **Perfil Personal:** Avatar, Nombre y Título (ej. "Senior Developer"). Visible para tu equipo en los reportes.
*   **Preferencias de UI:**
    *   **Tema:** Light, Dark o Sistema.
    *   **Densidad:** Modo "Cómodo" (más espacio) o "Compacto" (más datos en pantalla).
*   **Regionalización:** Preferencias de moneda, inicio de semana (Lunes vs Domingo) y formato de hora (24h vs AM/PM).

## 2. Seguridad y Privacidad (Enterprise Grade)
Tomamos la seguridad muy en serio. Tu tiempo es información sensible de negocio.

### 2.1 Arquitectura de Seguridad
*   **Autenticación:** Gestión de sesiones segura vía JWT con rotación automática. Soporte para Login Social (Google/GitHub/Microsoft) y 2FA (Próximamente).
*   **Cifrado:**
    *   *En Tránsito:* Todo el tráfico viaja forzosamente por HTTPS/TLS 1.3.
    *   *En Reposo:* La base de datos está cifrada con AES-256.
*   **Row Level Security (RLS):** Utilizamos políticas de seguridad nativas de PostgreSQL. La seguridad no depende solo del código "frontend"; la base de datos sabe quién eres y qué organización "posee" cada fila. Es matemáticamente imposible que un usuario acceda a datos de otra organización a la que no pertenece, incluso si hubiera un bug en la interfaz.

### 2.2 Cumplimiento Normativo (GDPR/RGPD)
*   **Soberanía del Dato:** Tus datos son tuyos.
*   **Derecho de Portabilidad:** Herramienta de "Exportar todo mi dato" (formato JSON/CSV completo) disponible en configuración.
*   **Derecho al Olvido:** Opción de "Eliminar Cuenta" que realiza un borrado físico (hard delete) de toda tu información personal y registros históricos de nuestros servidores.

## 3. Automatización y Ecosistema API
Tempora está construido bajo la filosofía **API-First**. Todo lo que haces en la web, se puede hacer programáticamente.

### 3.1 API Reference
Disponemos de una API RESTful documentada (Swagger/OpenAPI).
*   **Auth:** Mediante Bearer Tokens personales.
*   **Scopes:** Clientes, Proyectos, Time Entries, Reports.

### 3.2 Integración Nativa con n8n
Hemos desarrollado nodos/integraciones específicas para **n8n** (herramienta de automatización workflow). Esto convierte a Tempora en un disparador de acciones:

#### Triggers (Disparadores):
*   `OnTimerStart`: Cuando empiezas a trabajar.
    *   *Caso de uso:* Actualizar estado de Slack a "En una tarea", poner el móvil en "No Molestar".
*   `OnTimerStop`: Cuando terminas una tarea.
    *   *Caso de uso:* Registrar la entrada en una hoja de Google Sheets de respaldo, enviar un mensaje a un canal de Discord.
*   `OnProjectBudgetAlert`: Cuando un proyecto llega al 80% del presupuesto.
    *   *Caso de uso:* Crear tarea urgente en Asana/Jira para el Project Manager.

#### Actions (Acciones):
*   `CreateProject`: Crear proyecto automáticamente en Tempora cuando se cierra un "Deal" en Salesforce/HubSpot.
*   `GenerateReport`: Crear y enviar por email un PDF de reporte todos los viernes a las 17:00 a una lista de clientes.

### 3.3 Webhooks
Para integraciones custom, puedes configurar Webhooks en la configuración de la organización. Tempora enviará payloads JSON a tu URL endpoint ante eventos clave (CRUD de proyectos, entradas de tiempo, etc.).
