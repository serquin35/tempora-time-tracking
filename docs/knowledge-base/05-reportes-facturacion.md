# Reportes, Inteligencia de Negocio y Exportación
Versión del Documento: 1.1 - Enero 2026

## 1. El Dashboard Principal
Tu torre de control. Una vista de águila diseñada para responder "¿Cómo va el negocio?" de un vistazo.

### 1.1 Widgets Principales
*   **Heatmap de Actividad:** Visualización de intensidad (tipo GitHub) que muestra tus hábitos de trabajo. Permite identificar patrones (ej. "Los martes son mi día más intenso").
*   **Cronograma Diario:** Gráfico de barras apiladas por horas. Muestra *cuándo* trabajaste, no solo *cuánto*. Útil para visualizar fragmentación y multitasking.
*   **Distribución de Esfuerzo (Donut Chart):** Desglose porcentual por Cliente o Proyecto.
*   **Tendencia (Trendline):** Comparativa visual de horas facturables esta semana vs. la semana pasada.

## 2. El Motor de Reportes (Report Builder)
Tempora incluye una herramienta potente para generar informes a medida a partir de los datos brutos.

### 2.1 Filtros y Segmentación
Puedes "cortar" los datos con precisión quirúrgica:
*   **Tiempo:** Rangos predefinidos (Esta semana, Mes pasado, Año fiscal) o fechas exactas personalizadas.
*   **Entidad:** Cliente, Proyecto, Tarea.
*   **Personas:** Usuario específico, Grupo o Equipo.
*   **Estado:** Facturable / No Facturable / Ya Facturado (Invoiced).
*   **Tags:** Filtrar por etiquetas transversales (ej. mostrar solo horas etiquetadas con `#Overtime`).

### 2.2 Agrupación y Ordenación
Estructura la información como la necesites leer:
*   *Por Proyecto > Usuario > Tarea*
*   *Por Usuario > Día > Proyecto*
*   *Por Cliente > Semana*

### 2.3 Reglas de Redondeo (Billing Rounding)
Para facturación, a menudo se aplican reglas de negocio:
*   **Sin Redondeo:** Precisión exacta (1h 03m 12s).
*   **Redondeo al Minuto:** (1h 03m).
*   **Bloques de Facturación:** Redondear **hacia arriba** a los próximos 15, 30 o 60 minutos.
    *   Ejemplo: Una tarea de 12 minutos con "Redondeo 15m Up" se cuenta como 15m. Útil para contratos de soporte.

## 3. Exportación y Compartición
Saca los datos de Tempora para usarlos donde quieras.

### 3.1 PDF Ejecutivo
Genera documentos profesionales listos para enviar al cliente.
*   **Personalización:** Incluye el logo de tu organización, dirección fiscal y notas personalizadas.
*   **Resumen + Detalle:** Una primera página con totales y gráficos, seguida de un desglose detallado línea a línea.

### 3.2 Excel y CSV (Raw Data)
Para los amantes de las hojas de cálculo o contables.
*   **CSV Plano:** Todas las columnas de datos para importación en ERPs (SAP, Xero, QuickBooks).
*   **Excel Formateado:** Hojas con pestañas separadas por Proyecto/Usuario y fórmulas pre-calculadas.

### 3.3 Reportes Compartidos (Shared Links)
La forma más transparente de trabajar con clientes.
*   Genera una URL pública secreta (ej. `tempora.app/r/xyz123`).
*   **Permisos:** Configura si pueden ver importes monetarios o solo horas.
*   **Caducidad:** Establece una fecha de expiración para el enlace.
*   **Valor:** El cliente puede visitar el enlace cuando quiera para ver el progreso real del proyecto sin tener que pedirte un PDF cada semana.

## 4. Auditoría de Facturación
Tempora incluye un sistema de marcado de estado:
*   Unset: Registrado pero no revisado.
*   Project Manager Approved: Revisado por el jefe de proyecto.
*   Invoiced: Ya incluido en una factura. Bloquea la edición del registro para garantizar inmutabilidad contable (previene que se modifique un registro de tiempo después de haber sido cobrado).
