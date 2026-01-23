# Plan de Implementación: Fase 3 - Proyectos y Tareas

**Estado General: 🚧 EN PROGRESO (60% completado)**

Este documento detalla los pasos para profundizar en la gestión de proyectos y añadir la funcionalidad de tareas (sub-proyectos) para un control de tiempo granular.

---

## 1. Infraestructura de Base de Datos ✅ COMPLETADO
- [x] Crear la tabla `tasks` en Supabase:
  - [x] Campos: id, project_id, name, description, estimated_hours, status, created_at
  - [x] RLS: Los usuarios solo pueden ver/editar tareas de proyectos de su organización
- [x] Configurar RLS para `tasks`.
- [x] Añadir columna `task_id` (nullable) a la tabla `time_entries`.
- [x] Crear tipo TypeScript `Task` en `src/hooks/use-tasks.ts`

**Archivos modificados:**
- Base de datos Supabase (tabla `tasks`, columna `task_id` en `time_entries`)
- `src/hooks/use-tasks.ts`

---

## 2. Gestión de Tareas (UI/UX) - 🚧 PARCIALMENTE COMPLETADO
- [x] Actualizar la página de `Proyectos` para que al hacer clic en un proyecto se vean sus tareas.
  - [x] Implementado sistema de expansión/colapso de proyectos
  - [x] Animación suave de entrada
- [x] Crear componente `ProjectTasks` para visualizar y añadir tareas rápidas.
  - [x] Lista inline de tareas
  - [x] Input rápido para añadir nuevas tareas
  - [x] Botón de completar/activar tareas
  - [x] Contador de tareas
- [ ] **PENDIENTE:** Implementar diálogos/modales para crear y editar tareas con más detalles
  - [ ] Modal `TaskFormDialog` con campos:
    - [ ] Nombre (requerido)
    - [ ] Descripción (opcional)
    - [ ] Horas estimadas (opcional)
    - [ ] Estado (active/completed/archived)
  - [ ] Modal de edición de tareas existentes
  - [ ] Modal de confirmación para eliminar tareas
  - [ ] Añadir botón "Editar" en cada tarea del `ProjectTasks`

**Archivos completados:**
- ✅ `src/pages/Projects.tsx` (componente principal y `ProjectTasks`)
- ✅ `src/hooks/use-tasks.ts`

**Archivos pendientes:**
- ⏳ `src/components/dialogs/task-form-dialog.tsx` (crear)
- ⏳ `src/components/dialogs/task-delete-confirm.tsx` (crear)

---

## 3. Integración con el Temporizador (Timer) ✅ COMPLETADO
- [x] Actualizar el hook `useTimeTracking` para soportar `taskId`.
  - [x] Modificar función `clockIn(projectId?, taskId?)`
  - [x] Incluir `task_id` en el insert de `time_entries`
- [x] Modificar el componente `CurrentStatus` para permitir seleccionar una tarea específica después de elegir un proyecto.
  - [x] Añadir `Select` de tareas condicionado a proyecto seleccionado
  - [x] Hook `useTasks` para cargar tareas del proyecto
  - [x] Reset de tarea al cambiar de proyecto
- [x] Asegurar que al "Fichar" (Clock In), se guarde tanto el `project_id` como el `task_id` si existen.
- [x] Mostrar proyecto y tarea actual en la vista de sesión activa
  - [x] Badge con nombre de proyecto
  - [x] Indicador de tarea seleccionada

**Archivos modificados:**
- ✅ `src/hooks/use-time-tracking.ts` (líneas 84-111)
- ✅ `src/components/time-tracking/current-status.tsx` (líneas 19-21, 66-80, 99-124)

---

## 4. Reportes por Tarea ✅ COMPLETADO
- [x] Actualizar el hook `useReportsData` para permitir filtrado por tarea.
  - [x] Añadir parámetro `taskId: string | "all"` en `ReportFilters`
  - [x] Modificar el query de Supabase para incluir join con `tasks`
  - [x] Añadir campo `task_name` en `ReportEntry`
  - [x] Aplicar filtro por `task_id` cuando no sea "all"
- [x] Añadir en la vista de reportes el desglose de tiempo por tarea dentro de los proyectos.
  - [x] Añadir `Select` de tareas en `ReportsFilters` (dependiente de proyecto)
  - [x] Añadir columna "Tarea" en la tabla de resultados
  - [x] Implementar totalización (visibilidad en lista)

**Archivos modificados:**
- ✅ `src/hooks/use-reports-data.ts`
- ✅ `src/pages/Reports.tsx`

---

## 5. Modales de Gestión de Tareas (Edición/Eliminación) ✅ COMPLETADO
- [x] Crear componente `TaskFormDialog`
  - [x] Campos: Nombre, Descripción, Horas Estimadas
  - [x] Modos: Crear y Editar
- [x] Crear componente `TaskDeleteDialog`
  - [x] Confirmación de seguridad
- [x] Integrar en la lista de tareas de `Projects.tsx`
  - [x] Añadir menú de acciones (tres puntos) y botón de creación detallada

**Archivos modificados:**
- ✅ `src/components/dialogs/task-form-dialog.tsx`
- ✅ `src/components/dialogs/task-delete-confirm.tsx`
- ✅ `src/pages/Projects.tsx`
- ✅ `src/hooks/use-tasks.ts`

---

## 6. Pulido y Feedback Visual - 🚧 EN PROGRESO
- [ ] Añadir indicadores de progreso en los proyectos.
  - [ ] Calcular porcentaje de completitud (tareas completadas / totales)
  - [ ] Mostrar barra de progreso en la tarjeta del proyecto
  - [ ] Mostrar resumen de horas estimadas vs reales (si existen)
    - [ ] Basado en horas reales vs estimadas (si hay `estimated_hours`)
  - [ ] Añadir componente `Progress` de shadcn/ui
  - [ ] Mostrar barra de progreso en cada card de proyecto
  - [ ] Tooltip con detalle (X de Y tareas, Z horas de W horas)
- [ ] Implementar micro-animaciones al cambiar entre proyectos y tareas.
  - [ ] Animación de entrada de lista de tareas (ya implementada parcialmente)
  - [ ] Hover effect mejorado en cards de proyecto
  - [ ] Transición suave al completar/activar tareas
  - [ ] Efecto de "check" al marcar tarea como completada

**Archivos a modificar:**
- ⏳ `src/pages/Projects.tsx` (añadir Progress bar y estadísticas)
- ⏳ `src/index.css` (animaciones adicionales si es necesario)
- ⏳ `tailwind.config.js` (configurar animaciones personalizadas)

**Estimación de esfuerzo:** 2-3 horas

---

## Resumen de Tareas Pendientes para Completar Fase 3

### Alta Prioridad (Core Functionality)
1. **Reportes por Tarea** (2-3h)
   - Actualizar `useReportsData` con filtro de tareas
   - Modificar página `Reports` para mostrar columna de tareas
   - Añadir filtro en UI

### Prioridad Media (UX Improvements)
2. **Modales de Edición de Tareas** (2-3h)
   - Crear `TaskFormDialog` con formulario completo
   - Implementar edición de tareas existentes
   - Añadir confirmación de eliminación

3. **Indicadores de Progreso** (1-2h)
   - Calcular % de completitud por proyecto
   - Añadir Progress bar visual en cards

### Prioridad Baja (Polish)
4. **Micro-animaciones Mejoradas** (1h)
   - Pulir transiciones existentes
   - Añadir feedback visual al completar tareas

**Total estimado para completar Fase 3:** 6-9 horas

---

## Próximos Pasos Recomendados

1. **Empezar con Reportes por Tarea** - Es la funcionalidad más crítica que falta
2. **Luego implementar Modales de Edición** - Mejora significativa de UX
3. **Añadir Indicadores de Progreso** - Feedback visual importante
4. **Pulir animaciones al final** - Nice to have

**Nota:** Una vez completada la Fase 3, el siguiente paso será la **Fase 4: Reportes Avanzados y Cumplimiento** (ver `PLAN_COMPLETO.md`).

---

**Última actualización:** 2026-01-22
