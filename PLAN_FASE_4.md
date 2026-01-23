# Plan Fase 4: Reportes Avanzados, Exportación y Cumplimiento

Esta fase se centra en transformar los datos recopilados en información útil y entregable para el usuario y sus clientes.

## Objetivos Principales
1.  **Potenciar los Reportes**: Permitir análisis profundos con filtros personalizados.
2.  **Exportación Profesional**: Generar entregables (PDF/Excel) para clientes y nóminas.
3.  **Facturación Simple**: Convertir tiempo en dinero generado directamente desde la app.

---

## 4.1 Exportación de Datos (Prioridad Alta)
- [x] **Instalar dependencias**: `jspdf`, `jspdf-autotable`, `xlsx` (o similar para CSV/Excel).
- [x] **Utilidad de Exportación**: Crear `src/lib/export-utils.ts` para manejar la lógica de generación de archivos.
  - [x] Función `exportToCSV(data, filename, isAdmin)` con soporte para datos financieros
  - [x] Función `exportToPDF(data, title, filename, isAdmin)` con diseño corporativo y datos financieros.
- [x] **Integración en UI**:
  - [x] Añadir botones "Exportar a CSV" y "Exportar a PDF" en la página `Reports`.
  - [x] Asegurar que exporten los datos *filtrados* actuales.
  - [x] Incluir columnas de "Tarifa/Hora" e "Ingresos" para admins.
  - [x] Mostrar "Total Ingresos" en resumen del PDF para admins.

## 4.2 Filtros de Fecha Avanzados
- [x] **Componente DateRangePicker**: Implementar un selector de rango de fechas personalizado (usando `react-day-picker` de shadcn/ui).
- [x] **Integración en Reportes**:
  - [x] Reemplazar/Complementar el selector de "Esta semana/Este mes" con el rango personalizado.
  - [x] Actualizar `useReportsData` para aceptar `startDate` y `endDate` arbitrarios.

## 4.3 Facturación Simple (Feature "Wow")
- [x] **Configuración de Tarifas**:
  - [x] Añadir campo `hourly_rate` (tarifa por hora) a la tabla `projects` (o `organization_members` para coste interno).
  - [x] UI para definir la tarifa en la creación/edición de proyectos.
  - [x] Visualización de tarifas en tarjetas de proyecto (solo para admins).
  - [x] Cálculo de ingresos en reportes (horas × tarifa).
  - [x] Tarjeta de "Total Ingresos" en Reports (solo para admins).
  - [x] Columna de "Ingresos" en historial detallado (solo para admins).
- [x] **Generador de Facturas**:
  - [x] Botón "Generar Factura" desde una vista de reporte filtrada por cliente/proyecto.
  - [x] Preview de factura con desglose de horas x tarifa.
  - [x] Exportación de la factura a PDF con diseño profesional.
  - [x] Cálculo automático de IVA y configuración personalizada de impuestos.
  - [x] Campos personalizables: número de factura, cliente, dirección, notas.
  - [x] Desglose por proyecto con subtotales.

## 4.4 Mejoras de UX en Reportes
- [x] **Gráficos Interactivos**: Mejorar la visualización de datos con gráficos de `recharts` más detallados (e.g., distribución por tarea).
- [x] **Resumen Financiero**: Mostrar "Total Estimado" en dinero basado en las horas trabajadas.

---

## Orden de Ejecución
1.  **Fundamentos de Exportación (4.1)**: Valor inmediato para el usuario.
2.  **Filtros Avanzados (4.2)**: Necesario para reportes mensuales o trimestrales específicos.
3.  **Facturación (4.3)**: El "broche de oro" de la fase.

