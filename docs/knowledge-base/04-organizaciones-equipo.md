# Gestión de Organizaciones, Equipos y Permisos (RBAC)
Versión del Documento: 1.1 - Enero 2026

## 1. Estructura Organizativa
Tempora permite modelar estructuras complejas mediante el sistema de **Organizaciones** y **Workspaces**.

### 1.1 Multi-Organización
Un mismo usuario (identidad de email) puede pertenecer a infinitas organizaciones.
*   **Caso de Uso:** Un freelancer que trabaja para la "Agencia A" (como empleado externo) y tiene su propia "Consultora Personal".
*   **Aislamiento:** Los datos entre organizaciones son silos estancos. Un administrador de la "Agencia A" jamás podrá ver que el usuario también trabaja en "Consultora Personal".
*   **Switching:** Cambio instantáneo de contexto desde el menú de perfil sin necesidad de reloguearse.

### 1.2 Configuración de la Organización
El Owner configura los parámetros globales:
*   **Branding:** Logo y Nombre (aparecerán en los PDFs de reportes).
*   **Moneda Base:** Divisa para todos los cálculos financieros.
*   **Inicio de Semana:** (Lunes/Domingo) Afecta a los reportes semanales y cálculo de horas extra.
*   **Formato de Tiempo:** (HH:MM vs Decimal). Ej: 1h 30m vs 1.5h.

![Configuración de Organización](/help/screenshots/organization-settings.jpg)
*Panel de configuración de la organización*

## 2. Roles y Permisos (RBAC)
Tempora implementa un sistema de control de acceso basado en roles (RBAC) granular para proteger la información sensible (tarifas, facturación).

### 2.1 Matriz de Roles
1.  **Owner (Propietario):**
    *   *Poder:* Absoluto. Único que puede borrar la organización o gestionar la suscripción de pago. Tiene acceso a todos los datos financieros y de tiempo.
2.  **Admin (Administrador):**
    *   *Gestión:* Puede crear proyectos, clientes y usuarios.
    *   *Visibilidad:* Ve todos los tiempos y tarifas de todos los proyectos (útil para Project Managers).
    *   *Restricción:* No puede eliminar la organización ni cambiar datos de facturación de la suscripción.
3.  **Manager (Gerente de Equipo):**
    *   *Enfoque:* Supervisión intermedia.
    *   *Visibilidad:* Ve los tiempos de los usuarios que tiene asignados en "Su Equipo" y los proyectos donde es líder.
    *   *Opcional:* Se puede ocultar la tarifa financiera (ver horas pero no dinero).
4.  **Member (Miembro/Colaborador):**
    *   *Privacidad:* Solo puede ver y editar **sus propios tiempos**.
    *   *Asignación:* Solo puede trackear en proyectos a los que ha sido explícitamente invitado.
    *   *Ceguera Financiera:* No ve tarifas ni presupuestos monetarios, solo horas.

![Gestión de Equipo](/help/screenshots/team-management.jpg)
*Vista de administración de miembros del equipo*

## 3. Gestión de Usuarios y Grupos
### 3.1 Grupos de Usuarios
Para organizaciones grandes, permite crear agrupaciones lógicas: "Diseñadores", "Backend", "Marketing".
*   **Asignación Masiva:** En lugar de añadir 10 usuarios uno a uno a un proyecto, añades al grupo "Diseñadores".
*   **Reportes de Grupo:** Filtra el dashboard para ver el rendimiento agregado de un departamento entero.

### 3.2 Flujo de Invitación
1.  **Envío:** El admin envía una invitación por email o genera un link temporal de un solo uso.
2.  **Onboarding:** Si el usuario no existe, se le guía para crear cuenta. Si ya existe, simplemente acepta y la nueva organización aparece en su selector.
3.  **Estado:** Las invitaciones tienen estados: `Pendiente`, `Aceptada`, `Expirada`.

### 3.3 Desactivación y Offboarding
Cuando un empleado deja la empresa:
*   **Desactivar Usuario:** Impide el acceso inmediato a la organización.
*   **Conservación de Datos:** Sus registros de tiempo históricos **SE MANTIENEN** para no romper los reportes pasados.
*   **Reasignación:** (Opcional) Los proyectos/tareas activos asignados a ese usuario pueden reasignarse en bloque a otro miembro.
