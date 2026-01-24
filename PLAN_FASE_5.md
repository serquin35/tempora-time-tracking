# 🧘 PLAN FASE 5: Experiencia Premium y Gamificación
> **Objetivo:** Elevar el "Vibe" de la aplicación. Convertir el acto de registrar tiempo de una tarea aburrida a una experiencia gratificante y productiva (Modo Focus).

---

## ⚡ 1. Modo Focus (Inmersivo)
Crear una experiencia de pantalla completa para el trabajo profundo.

- [ ] **Vista `FocusMode`:**
  - Botón para expandir el timer actual a pantalla completa.
  - Diseño minimalista: Fondo oscuro/zen, números grandes.
  - Ocultar sidebar y distracciones.
- [ ] **Controles Zen:**
  - Pausar/Reanudar rápido.
  - Input minimalista para "Qué estás logrando ahora".
  - Botón de "Completar Sesión" con feedback visual.

## 🎮 2. Gamificación y Feedback ("Vibe")
Hacer que la productividad se sienta bien.

- [ ] **Sistema de Rachas (Streaks):**
  - Mostrar "🔥 3 días seguidos" en el Dashboard.
  - Pequeña animación si mantienes la racha.
- [ ] **Micro-interacciones:**
  - Confeti (`canvas-confetti`) al completar un objetivo diario (8h) o una tarea larga.
  - Sonido sutil de "éxito" (opcional, toggleable).

## 💎 3. Pulido de UX (Lo que falta)
- [ ] **Dashboard - Actividad Reciente:**
  - Lista de las últimas 3 tareas con botón "Play" para reanudar instantáneamente (duplicar entrada con nuevo timestamp).
- [ ] **Exportación PDF:**
  - Verificar que el PDF incluye los nuevos campos (Proyecto, Cliente) y se ve profesional.

## 🛠️ Tecnologías
- `framer-motion` para transiciones suaves (entrada al modo focus).
- `canvas-confetti` para celebraciones.
- `use-sound` (opcional) para feedback auditivo.

---
**Orden de ejecución:**
1. Componente `RecentActivity` (Dashboard) - *Quick Win*.
2. Vista `FocusMode`.
3. Gamificación (Confeti y Rachas).
