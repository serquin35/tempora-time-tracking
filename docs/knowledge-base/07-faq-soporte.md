# Preguntas Frecuentes y Solución de Problemas
Versión del Documento: 1.0 - Enero 2026

## 1. Problemas Comunes con el Timer

### ¿Por qué no puedo iniciar el timer?
**Causa más común:** Ya tienes otro timer activo.

**Solución:**
1. Verifica el panel de estado actual en el Dashboard
2. Detén el timer activo antes de iniciar uno nuevo
3. Si no ves ningún timer activo pero sigue bloqueado, revisa la sección "Mi Actividad" para asegurarte de que no haya una sesión zombie

### ¿Se perdió mi tiempo si cierro la aplicación o el navegador?
**No.** El timer corre en el servidor, no en tu dispositivo.

**Detalles:**
- Puedes cerrar la pestaña, apagar el ordenador o cambiar de dispositivo
- El timer seguirá corriendo en segundo plano
- Al volver a abrir la app, verás el tiempo actualizado automáticamente
- Esta es una característica de Tempora como Progressive Web App (PWA)

### ¿Cómo recupero un timer que olvidé detener el fin de semana?
**Sistema de Recuperación Automática:**

Tempora detecta automáticamente sesiones anormalmente largas (>12 horas por defecto).

**Qué verás al volver:**
1. Un modal de "Recuperación de Timer Zombie"
2. Dos opciones:
   - **"Conservar"**: Mantiene todo el tiempo registrado (si realmente trabajaste)
   - **"Corregir Hora"**: Te permite ajustar la hora de fin manualmente

**Recomendación:** Si olvidaste detener el timer, elige "Corregir Hora" y establece la última hora en que realmente trabajaste.

### ¿Puedo editar entradas de tiempo pasadas?
**Sí**, con algunas restricciones de seguridad.

**Permisos:**
- **Usuario normal:** Puede editar sus propias entradas de los últimos 7 días
- **Admin/Owner:** Puede editar cualquier entrada de su organización

**Cómo editar:**
1. Ve a la página "Historial"
2. Haz clic en la entrada que deseas modificar
3. Edita hora de inicio, fin, proyecto, o descripción
4. Guarda los cambios

**Nota:** Las entradas editadas manualmente llevan un indicador visual para auditoría.

---

## 2. Proyectos y Tareas

### ¿Cómo organizo mi trabajo si tengo múltiples clientes?
**Usa la función Multi-Workspace:**

1. Cada cliente puede tener su propia organización
2. Cambia entre workspaces desde el menú de avatar (esquina superior derecha)
3. Los proyectos, tareas y reportes se filtran automáticamente por workspace activo

**Alternativa:** Si todos los clientes están en la misma organización, usa el campo "Cliente" dentro de cada proyecto para separarlos.

### ¿Puedo trackear tiempo sin asignar un proyecto?
**Sí**, pero no es recomendable a largo plazo.

**Qué sucede:**
- Las entradas sin proyecto se guardan en "Inbox" (Sin Proyecto)
- Puedes clasificarlas posteriormente desde el Historial
- Los reportes mostrarán estas entradas como "No Asignado"

**Mejor práctica:** Asigna siempre un proyecto para facilitar la facturación y análisis.

### ¿Cómo sé si me estoy pasando del presupuesto de un proyecto?
**Sistema de Alertas Automáticas:**

Tempora te notifica cuando un proyecto alcanza umbrales críticos:
- **50% consumido**: Aviso preventivo (naranja)
- **80% consumido**: Aviso de riesgo (rojo)
- **100% consumido**: Aviso de exceso (crítico)

**Dónde verlo:**
1. Dashboard → Card del proyecto mostrará barra de progreso
2. Página de Proyectos → Indicador visual en cada tarjeta
3. Notificaciones in-app (campanita)

---

## 3. Reportes y Facturación

### ¿Cómo exporto un reporte para enviarlo a un cliente?
**Pasos:**
1. Ve a la página "Reportes"
2. Aplica filtros (fecha, proyecto, miembro)
3. Haz clic en "Exportar"
4. Elige formato: PDF, CSV o Excel
5. Confirma la descarga en el diálogo

**Formatos disponibles:**
- **PDF**: Ideal para clientes (profesional, con gráficos)
- **CSV**: Para procesar en Excel/Google Sheets
- **Excel**: Para análisis avanzado con fórmulas

### ¿Puedo generar facturas automáticamente?
**Sí**, con la función de Facturación Integrada.

**Requisitos:**
1. Proyectos configurados con tarifas horarias
2. Datos fiscales completados en Configuración
3. Tiempo trackeado y asignado a proyectos

**Cómo generar factura:**
1. Ve a Reportes → Pestaña "Facturación"
2. Selecciona proyecto y rango de fechas
3. Revisa el desglose de horas
4. Haz clic en "Generar Factura PDF"
5. La factura se descarga con numeración automática

**Personalización:**
- Logo de tu empresa
- Notas y condiciones de pago
- Configuración de impuestos (IVA/VAT)

### ¿Los reportes muestran tiempo de todos los miembros del equipo?
**Depende de tu rol:**

- **Owner/Admin**: Ve tiempo de todos los miembros de la organización
- **Manager**: Ve tiempo de miembros en proyectos asignados
- **Member**: Solo ve su propio tiempo

**Filtro por miembro:** Los Admins pueden filtrar reportes por usuario específico desde el selector de la página de Reportes.

---

## 4. Equipos y Organizaciones

### ¿Cómo invito a mi equipo?
**Método de Código de Invitación:**

1. Ve a la página "Equipo"
2. Encuentra tu "Código de Invitación" (6 caracteres)
3. Comparte el código con tu equipo
4. Ellos se registran en Tempora e ingresan el código
5. Aparecerán automáticamente en tu organización

**Roles disponibles:**
- **Owner**: Control total (solo el creador)
- **Admin**: Gestión completa excepto eliminar organización
- **Manager**: Gestión de proyectos y miembros asignados
- **Member**: Solo trackeo de tiempo

### ¿Puedo cambiar el rol de un miembro del equipo?
**Sí**, si eres Owner o Admin.

**Pasos:**
1. Ve a Equipo → Lista de miembros
2. Haz clic en el menú (...) del miembro
3. Selecciona "Cambiar Rol"
4. Elige el nuevo rol
5. Confirma

**Advertencia:** No puedes cambiar tu propio rol si eres el único Owner.

### ¿Qué es "Personal Workspace"?
**Workspace Automático:**

Cuando te registras en Tempora, se crea automáticamente una organización personal con tu nombre.

**Uso recomendado:**
- Proyectos personales o freelance individual
- Separado de organizaciones de equipo o agencias

**Cambio de workspace:** Haz clic en tu avatar → "Cambiar Workspace" → Selecciona la organización deseada.

---

## 5. Chat de Soporte con AI

### ¿Cómo funciona el chat de soporte?
**Asistente AI Contextual:**

El widget de chat (burbuja verde en la esquina inferior derecha) está conectado a:
- Toda la documentación de Tempora
- Tus datos de uso (respetando privacidad)
- Base de conocimiento actualizada

**Qué puede hacer:**
- Responder preguntas sobre funcionalidades
- Ayudarte a resolver problemas comunes
- Sugerir mejores prácticas de productividad
- Consultar tus métricas ("¿Cuánto trabajé esta semana?")

**Privacidad:** El AI no comparte tus datos con terceros. Todo se procesa en infraestructura segura.

### ¿Puedo limpiar el historial del chat?
**Sí**, en cualquier momento.

**Opciones:**
1. **Limpiar Historial**: Borra todos los mensajes pero mantiene la sesión
2. **Finalizar Chat**: Cierra la conversación actual y empieza de cero

**Botones:** Ambos están en el encabezado del widget de chat.

### ¿Qué hago si el chat no responde correctamente?
**Soluciones:**

1. **Reformula tu pregunta:** Sé más específico
   - ❌ "No funciona"
   - ✅ "¿Por qué no puedo exportar el reporte PDF?"

2. **Finaliza el chat y empieza de nuevo:** Útil si el contexto se confundió

3. **Usa el soporte humano:** Haz clic en "Contactar Soporte" en la página de Ayuda

---

## 6. Configuración y Seguridad

### ¿Cómo cambio mi contraseña?
**Pasos:**
1. Haz clic en tu avatar → "Configuración"
2. Pestaña "Seguridad"
3. Sección "Cambiar Contraseña"
4. Ingresa contraseña actual y nueva
5. Guarda

**Requisitos de contraseña:**
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos un número

### ¿Puedo usar Tempora sin conexión a Internet?
**Sí parcialmente** (PWA Offline-First).

**Funcionalidades offline:**
- Iniciar, pausar y detener timers
- Ver historial reciente (cached)
- Editar entradas

**No disponible offline:**
- Sincronización en tiempo real
- Generación de reportes
- Chat de soporte

**Sincronización:** Cuando recuperes conexión, todos los cambios se subirán automáticamente.

**Advertencia:** No cierres sesión mientras estés offline, ya que esto borraría los datos locales pendientes de sincronizar.

### ¿Mis datos están seguros?
**Sí.** Tempora implementa múltiples capas de seguridad:

**Infraestructura:**
- Hosting en Supabase (certificado SOC 2)
- Encriptación en tránsito (HTTPS/TLS)
- Encriptación en reposo (AES-256)

**Acceso:**
- Row Level Security (RLS) en base de datos
- Autenticación JWT con tokens seguros
- Cada usuario solo ve sus propios datos (excepto equipos)

**Backups:** Automáticos diarios con retención de 30 días.

---

## 7. Problemas Técnicos

### La aplicación se ve lenta o no carga
**Soluciones:**

1. **Limpia caché del navegador:**
   - Chrome/Edge: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Supr
   - Safari: Cmd+Option+E

2. **Actualiza la PWA:**
   - Desktop: Recarga con Ctrl+F5
   - Móvil: Cierra y reabre la app completamente

3. **Verifica tu conexión a Internet:**
   - Haz ping a tempora-seven.vercel.app
   - Revisa firewall corporativo

4. **Prueba en modo incógnito:**
   - Descarta problemas de extensiones

**Si persiste:** Contacta soporte con detalles de tu navegador y sistema operativo.

### No recibo el email de verificación al registrarme
**Pasos:**

1. **Revisa carpeta de Spam/Correo no deseado**
2. **Asegúrate de usar el email correcto** (revisa errores tipográficos)
3. **Espera 5 minutos** (puede haber retraso)
4. **Solicita reenvío** desde la página de login

**Dominios de correo aceptados:** Gmail, Outlook, corporativos y la mayoría de proveedores.

**Bloqueos conocidos:** Algunos emails corporativos bloquean servicios externos. Consulta con tu IT.

### ¿Tempora tiene app móvil nativa?
**No necesitas una.**

Tempora es una **Progressive Web App (PWA)**, lo que significa:
- Se comporta como app nativa
- Puedes "instalarla" desde el navegador
- Funciona offline
- Recibe notificaciones
- Ocupa menos espacio que app nativa

**Cómo instalar en móvil:**
- **Android (Chrome):** Menú → "Añadir a pantalla de inicio"
- **iOS (Safari):** Botón compartir → "Añadir a pantalla de inicio"

---

## 8.Contacto y Soporte Adicional

### ¿Cómo contacto al equipo de Tempora?
**Opciones:**

1. **Chat AI** (más rápido): Widget en la esquina inferior derecha
2. **Email soporte**: soporte@tempora.app
3. **Feedback directo**: Página de Ayuda → "Enviar Feedback"

**Tiempo de respuesta:**
- Chat AI: Instantáneo
- Email: <24 horas en días laborables
- Feedback: <48 horas

### ¿Dónde puedo sugerir nuevas funcionalidades?
**Envía tus ideas:**

1. Página Ayuda → "Enviar Feedback"
2. Selecciona tipo: "Sugerencia de Feature"
3. Describe tu caso de uso
4. Envía

**Roadmap público:** Próximamente en docs.tempora.app

---

*Este documento se actualiza regularmente. Última revisión: Enero 2026*
*¿No encontraste tu pregunta? Usa el chat de soporte o escríbenos a soporte@tempora.app*