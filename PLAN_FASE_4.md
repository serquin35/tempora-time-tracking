# 📅 PLAN FASE 4: Visualización y Reportes Avanzados
> **Objetivo:** Transformar los datos crudos en información visual útil para la toma de decisiones, aprovechando la estructura multi-workspace ya implementada.

---

## 🏗️ 1. Dashboard Interactivo
Convertir el Dashboard en el centro de comando principal.

- [x] **KPI Cards en Tiempo Real:**
  - Total horas hoy (combinando histórico + timer activo).
  - Nivel de enfoque (calculado en base a pomodoros completados).
  - Dinero ganado hoy (estimado segun tarifa horaria, si aplica).
- [x] **Gráfico de Actividad Semanal Mejorado:**
  - [x] Usar `recharts` para un gráfico de barras interactivo.
  - [x] Tooltip personalizado con detalles del día.
  - [x] Línea de referencia (Meta diaria).
- [ ] **Lista de Actividad Reciente:**
  - *(Movido a Fase 5 para pulido UX)*

## 📊 2. Sistema de Reportes Profesional
Mejorar la página `/reports` para que sea una herramienta de análisis potente.

- [x] **Filtros Avanzados:**
  - Rango de Fechas (Picker mejorado).
  - Multi-select de Usuarios (para admins).
  - Filtro por Etiquetas/Tags.
- [x] **Visualización de Datos:**
  - **Distribución de Tiempo:** Gráfico de Donut (Tiempo por Proyecto).
  - **Tendencia Mensual:** Gráfico de Línea (Horas por día acumuladas).
- [x] **Tabla de Detalles:**
  - Tabla paginada con todos los registros.
  - Edición inline de registros desde la tabla de reportes.
- [x] **Exportación Robusta:**
  - PDF con logo de la empresa y resumen ejecutivo.
  - CSV limpio para importar en Excel/Contabilidad.

## 📁 3. Detalles de Proyecto (`/projects/[id]`)
Nueva página para gestión profunda de proyectos individuales.

- [x] **Header de Proyecto:**
  - Barra de progreso de presupuesto (Horas estimadas vs Reales).
  - Estado del proyecto (Activo, Pausado, Completado).
- [x] **Desglose de Tareas:**
  - Lista de tareas dentro del proyecto y tiempo dedicado a cada una.
- [x] **Equipo del Proyecto:**
  - Quién ha trabajado en este proyecto y cuánto tiempo.

## 🧪 Testing
- [ ] Validar cálculos de reportes cruzando fechas.
- [ ] Verificar que usuarios 'Member' solo vean sus propios reportes (excepto si RLS lo permite, que en nuestra app miembros solo ven lo suyo).
- [ ] Probar exportación con grandes volúmenes de datos.

---

## 📝 Notas Técnicas
- Usaremos `recharts` para todas las gráficas.
- Los cálculos complejos se harán en el frontend (hooks) para no saturar la DB, ya que el volumen de datos por usuario/org es manejable.
- Mantendremos `useReportsData` como el hook central de lógica.
