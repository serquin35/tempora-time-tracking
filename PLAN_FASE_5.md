# Plan Fase 5: Optimización, Seguridad y PWA

Esta fase final tiene como objetivo preparar la aplicación para un entorno de producción real, asegurando que sea rápida, segura e instalable en dispositivos móviles.

## Objetivos Principales
1.  **Experiencia Nativa (PWA)**: Permitir que la app se instale en escritorio y móvil, y funcione parcialmente offline.
2.  **Rendimiento (Performance)**: Asegurar tiempos de carga rápidos y consultas a base de datos optimizadas.
3.  **Seguridad (Auditoría)**: Blindar la aplicación revisando todas las políticas RLS y puntos de entrada.

---

## 5.1 Progressive Web App (PWA)
Transformar la aplicación web en una aplicación instalable.

- [ ] **Configuración de Vite PWA**:
  - [ ] Instalar `vite-plugin-pwa`.
  - [ ] Generar logos e iconos de aplicación (192, 512, maskjaed).
  - [ ] Configurar `manifest.webmanifest` (nombre, colores, start_url).
- [ ] **Service Worker**:
  - [ ] Estrategia de caché básica (Stale-while-revalidate) para assets estáticos.
  - [ ] Manejo de estado "Offline" (aviso visual al usuario).

## 5.2 Optimización de Base de Datos
A medida que crecen los registros de tiempo (`time_entries`), las consultas pueden volverse lentas.

- [ ] **Índices en Supabase**:
  - [ ] Índice en `time_entries(user_id, project_id)`.
  - [ ] Índice en `time_entries(clock_in)` para ordenamiento rápido.
- [ ] **Optimización de Queries**:
  - [ ] Revisar `useReportsData` para evitar traer datos innecesarios.

## 5.3 Optimización de Aplicación (Frontend)
- [ ] **Lazy Loading**:
  - [ ] Implementar `React.lazy` para rutas pesadas (`Reports.tsx`, `Projects.tsx`).
  - [ ] Diferir carga de librerías pesadas como `jspdf` y `recharts` hasta que se necesiten.
- [ ] **Bundle Analysis**:
  - [ ] Analizar tamaño del build para encontrar dependencias gigantes.

## 5.4 Auditoría de Seguridad y UX Final
- [ ] **Revisión RLS**: Confirmar que ningún dato de una organización se filtre a otra.
- [ ] **Empty States**: Revisar todas las listas (proyectos, tareas, miembros) para asegurar que tengan estados vacíos amigables.
- [ ] **Error Boundaries**: Implementar pantallas de error globales ("Algo salió mal") en lugar de pantalla blanca de la muerte.

---

## Orden de Ejecución Sugerido
1.  **PWA (5.1)**: Alto impacto visual y funcional imediato.
2.  **Lazy Loading (5.3)**: Mejora notable en la carga inicial.
3.  **Seguridad & DB (5.2 & 5.4)**: Invisible pero crítico para escalabilidad.
