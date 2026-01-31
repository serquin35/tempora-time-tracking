# Guía de Screenshots para Help Center

Esta carpeta debe contener screenshots de las pantallas clave de Tempora para usar en los artículos de ayuda.

## Screenshots Recomendadas (6-8)

### 1. `dashboard-overview.png`
**Qué capturar:**
- Vista del Dashboard completo
- Timer visible (preferiblemente activo)
- Cards de proyectos recientes
- Gráficos de actividad

**Dimensiones sugeridas:** 1920x1080 (Full HD)

---

### 2. `timer-active.png`
**Qué capturar:**
- Timer activo con tiempo corriendo
- Proyecto asignado visible
- Descripción de tarea
- Botones de control (Pausar/Detener)

**Dimensiones sugeridas:** 800x600

---

### 3. `projects-grid.png`
**Qué capturar:**
- Vista de página de Proyectos
- Grid con múltiples proyectos
- Barras de progreso de presupuesto
- Filtros visibles

**Dimensiones sugeridas:** 1920x1080

---

### 4. `reports-charts.png`
**Qué capturar:**
- Página de Reportes con gráficos
- Filtros de fecha
- Gráficos de barras/pastel
- Botones de exportación

**Dimensiones sugeridas:** 1920x1080

---

### 5. `team-management.png`
**Qué capturar:**
- Página de Equipo
- Lista de miembros con roles
- Código de invitación visible
- Opciones de gestión

**Dimensiones sugeridas:** 1400x900

---

### 6. `organization-settings.png`
**Qué capturar:**
- Configuración de organización
- Tabs de configuración
- Formularios de datos fiscales
- Configuración de facturación

**Dimensiones sugeridas:** 1400x900

---

## Opcionales (Si hay tiempo)

### 7. `time-grid-manual-entry.png`
- Vista de Time Grid para entradas manuales

### 8. `invoice-preview.png`
- Preview de factura generada en PDF

---

## Herramientas Recomendadas

### Para Capturas Estáticas
- **Windows:** Snipping Tool (Win + Shift + S)
- **macOS:** Cmd + Shift + 4
- **Extensión Chrome:** Awesome Screenshot

### Para Optimizar Tamaño
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/

**Objetivo:** Max 200KB por imagen

---

## Formato y Nombrado

- **Formato:** PNG (para UI) o JPG (si PNG es muy pesado)
- **Resolución:** Retina-ready (2x si es posible)
- **Nombrado:** kebab-case descriptivo (ej: `timer-zombie-recovery-modal.png`)

---

## Cómo Usar en Markdown

Una vez tengas los screenshots, úsalos así en los archivos `.md`:

```markdown
![Timer activo en Tempora](/help/screenshots/timer-active.png)
*El timer corre en el servidor, así que puedes cerrar la app sin perder tiempo.*
```

---

## Próximos Pasos (Opcional)

### GIFs Animados
Si más adelante quieres añadir GIFs:
- Usa ScreenToGif (Windows)
- Usa Kap (macOS)
- Max 5 segundos para mantener tamaño bajo 2MB

### Videos Tutoriales
Si decides crear videos:
- Usa Loom o OBS Studio
- Hostea en YouTube con privacidad "unlisted"
- Embebe con iframes en la página Help

---

*Última actualización: Enero 2026*
