# 🧪 Guía de Testing Paso a Paso - Tempora

> **Usuarios de Prueba Creados:**
> - ✅ **freelance@test.com** / Test1234! (María Freelance)
> - ✅ **employee@test.com** / Test1234! (Carlos Empleado)
> - ✅ **serquin16@gmail.com** (TÚ - Sergio)

---

## 📦 **PREPARACIÓN**

### Paso 0: Verificar que la app está corriendo

```bash
# La app debería estar en http://localhost:5173
# Si no está corriendo:
cd c:\Users\Serquin\Documents\antigravity\time-tracking-app
npm run dev
```

---

# 🧪 TEST 1: Aislamiento de Workspace Personal

**Objetivo:** Verificar que María (freelance) NO puede ver datos de otros usuarios.

## Paso 1.1: Login como María

1. **Abre el navegador** en `http://localhost:5173`
2. Si estás logueado, haz **Logout** (click en avatar → Cerrar Sesión)
3. **Login** con:
   ```
   Email: freelance@test.com
   Password: Test1234!
   ```

**✅ Verificación:**
- [ ] El login funciona sin errores
- [ ] Dashboard carga correctamente

---

## Paso 1.2: Inspeccionar el Workspace Activo

1. **Haz click en tu avatar** (arriba derecha)
2. **Observa el menú desplegable**

**✅ Verificación:**
- [ ] Aparece "María Freelance" como nombre
- [ ] En la sección "Workspaces", solo ves **1 workspace**: "Personal Workspace"
- [ ] Tiene el icono de usuario (👤) indicando que es personal
- [ ] Tiene un checkmark (✓) indicando que está activo

**📸 CAPTURA DE PANTALLA 1:** Toma screenshot del dropdown del avatar

---

## Paso 1.3: Verificar Aislamiento de Datos (Frontend)

1. **Ve a Dashboard** (debería estar ahí por defecto)
2. **Observa:**
   - ¿Cuántos proyectos ves? (Debería ser 0, es un usuario nuevo)
   - ¿Ves algún registro de tiempo de otros usuarios? (Debería ser NO)

3. **Ve a Team** (menú lateral)
4. **Observa:**
   - Debería mostrar "Tu Espacio Personal"
   - Debería tener un botón "Unirme a un Equipo"
   - NO debería listar otros miembros

**✅ Verificación:**
- [ ] No ves proyectos de Sergio (tu cuenta principal)
- [ ] La página Team muestra el mensaje para usuarios individuales
- [ ] No aparece ningún dato de otras organizaciones

---

## Paso 1.4: Verificar Aislamiento de Datos (DevTools - RLS)

**ESTE ES EL TEST MÁS IMPORTANTE - Prueba la seguridad a nivel de base de datos**

1. **Presiona F12** para abrir DevTools
2. **Ve a la pestaña Console**
3. **Pega este código:**

```javascript
// TEST A: ¿Puede ver organizaciones de otros?
const { data: orgs, error: orgError } = await supabase
  .from('organizations')
  .select('*')

console.log('🔍 Organizaciones visibles:', orgs)
console.log('📊 Total organizaciones:', orgs?.length || 0)
```

4. **Presiona Enter**

**✅ Verificación:**
- [ ] Solo ves **1 organización** (tu Personal Workspace)
- [ ] NO ves "My Workspace" de Sergio
- [ ] NO ves el workspace de Carlos (employee)

**📸 CAPTURA DE PANTALLA 2:** Screenshot de la consola mostrando el resultado

---

5. **Ahora pega este código:**

```javascript
// TEST B: ¿Puede ver miembros de otras organizaciones?
const { data: members, error: memberError } = await supabase
  .from('organization_members')
  .select('*, profiles(full_name), organizations(name)')

console.log('👥 Membresías visibles:', members)
console.log('📊 Total membresías:', members?.length || 0)
```

**✅ Verificación:**
- [ ] Solo ves **1 membresía** (tu propia membresía en tu workspace)
- [ ] NO ves las membresías de Sergio ni Carlos

---

6. **Último test de seguridad:**

```javascript
// TEST C: Intentar acceder al workspace de Sergio directamente
// (Este es el ID real de "My Workspace" de Sergio)
const sergioWorkspaceId = '84901b45-a049-46e8-b871-2291c9d41149'

const { data: forbiddenOrg, error: forbiddenError } = await supabase
  .from('organizations')
  .select('*')
  .eq('id', sergioWorkspaceId)
  .maybeSingle()

console.log('🚫 Intento de acceso a workspace de Sergio:', forbiddenOrg)
console.log('❓ ¿Bloqueado por RLS?', forbiddenOrg === null ? '✅ SÍ' : '❌ NO')
```

**✅ Verificación:**
- [ ] El resultado es `null` (vacío)
- [ ] En consola dice "✅ SÍ" (bloqueado correctamente)

**📸 CAPTURA DE PANTALLA 3:** Screenshot mostrando que el acceso fue bloqueado

---

## Paso 1.5: Crear Proyectos de Prueba

Ahora vamos a crear datos en el workspace de María para tests posteriores.

1. **Ve a Dashboard**
2. **Click en "Nuevo Proyecto"**
3. **Crea 2 proyectos:**
   - Nombre: "Cliente A - Diseño Web"
   - Nombre: "Proyecto Personal - Blog"

4. **Registra algo de tiempo:**
   - Selecciona "Cliente A - Diseño Web"
   - Dale "▶ Start" al timer
   - Espera 10 segundos
   - Dale "⏸ Pause"

**✅ Verificación:**
- [ ] Los proyectos se crean sin errores
- [ ] El timer funciona correctamente
- [ ] Dashboard muestra tu tiempo registrado

---

## 🎯 Resultado Esperado del TEST 1:

```
✅ María está completamente AISLADA
✅ No puede ver organizaciones de otros usuarios
✅ No puede ver miembros de otros equipos
✅ RLS bloquea consultas directas a datos ajenos
✅ Puede trabajar normalmente en su workspace personal
```

**Si todos los checks pasan → TEST 1 EXITOSO** ✅

---

# 🧪 TEST 2: Owner con Empleados

**Objetivo:** Verificar que TÚ (Sergio) puedes gestionar equipos y que un empleado tiene acceso limitado.

## Paso 2.1: Crear Organización de Prueba (Tu Empresa)

1. **Haz Logout** de la cuenta de María
2. **Login con tu cuenta:**
   ```
   Email: serquin16@gmail.com
   Password: [tu contraseña real]
   ```

3. **Abre DevTools → Console** y pega:

```javascript
// Crear una organización empresarial de prueba
const { data: newOrg, error: orgError } = await supabase
  .from('organizations')
  .insert({
    name: 'Test Company S.L.',
    slug: 'test-company-2026',
    type: 'business'
  })
  .select()
  .single()

console.log('🏢 Nueva organización creada:', newOrg)

// Añadirte como owner
if (newOrg) {
  const { data: membership } = await supabase
    .from('organization_members')
    .insert({
      organization_id: newOrg.id,
      role: 'owner'
    })
    .select()
  
  console.log('✅ Membresía creada:', membership)
  console.log('📋 GUARDA ESTE ID:', newOrg.id)
}
```

**✅ Verificación:**
- [ ] Se crea la organización sin errores
- [ ] En consola aparece el ID de la nueva org
- [ ] **COPIA el ID** (lo necesitaremos)

---

## Paso 2.2: Refrescar y Verificar Workspaces

1. **Refresca la página** (F5)
2. **Click en tu avatar**
3. **Observa la sección "Workspaces"**

**✅ Verificación:**
- [ ] Ahora ves **3 workspaces**:
  - Personal Workspace (icono 👤)
  - My Workspace (icono 🏢)
  - Test Company S.L. (icono 🏢)
- [ ] Uno de ellos tiene el checkmark (el activo)

**📸 CAPTURA DE PANTALLA 4:** Screenshot del selector de workspaces

---

## Paso 2.3: Cambiar a Test Company

1. **En el selector de workspaces**, **click en "Test Company S.L."**
2. **Observa cómo cambia la interfaz**

**✅ Verificación:**
- [ ] El workspace activo ahora es "Test Company S.L."
- [ ] Dashboard está vacío (organización nueva)
- [ ] Si vas a Team, NO aparece el botón "Unirme a Equipo"

---

## Paso 2.4: Invitar a Carlos (Employee)

1. **Ve a la página Team**
2. **Copia el código de invitación** (debería aparecer un card con el UUID)
   - Si no aparece automáticamente, abre DevTools y ejecuta:
   ```javascript
   // Ver el ID de la organización activa
   const { organization } = useAuth() // Esto NO funcionará en consola
   // Mejor: Ve a la consola Network y busca el organization_id en las requests
   ```
   
   **Atajo:** El ID es el que guardaste en el paso 2.1

3. **Copia el ID de la organización** (ej: `84901b45-...`)

---

## Paso 2.5: Unir a Carlos a la Empresa

1. **Abre una ventana de incógnito** (Ctrl+Shift+N en Chrome)
2. **Ve a** `http://localhost:5173`
3. **Login como Carlos:**
   ```
   Email: employee@test.com
   Password: Test1234!
   ```

4. **Ve a Profile → Organization** (o Team)
5. **Busca el campo "Unirse a una organización"**
6. **Pega el código de invitación** (el UUID que copiaste)
7. **Click en "Unirme"**

**✅ Verificación:**
- [ ] Aparece mensaje de éxito
- [ ] Carlos ahora ve 2 workspaces en su selector:
   - Personal Workspace
   - Test Company S.L.

**📸 CAPTURA DE PANTALLA 5:** Screenshot de Carlos viendo ambos workspaces

---

## Paso 2.6: Verificar Permisos de Carlos (Member)

**Como Carlos (ventana incógnito):**

1. **Cambia a "Test Company S.L."** en el selector
2. **Ve a la página Team**

**✅ Verificación:**
- [ ] Carlos VE a Sergio en la lista de miembros
- [ ] Sergio aparece como "Propietario"
- [ ] Carlos aparece como "Miembro"
- [ ] Carlos NO puede cambiar roles (no hay dropdown en su propia fila)

---

3. **Intenta crear un proyecto:**
   - Ve a Dashboard
   - Click en "Nuevo Proyecto"

**✅ Verificación:**
- [ ] ¿Carlos PUEDE crear proyectos?
   - Si SÍ → El sistema permite que members creen proyectos (decisión de diseño)
   - Si NO → Solo owners/admins pueden crear proyectos

**NOTA:** Esto depende de tus políticas RLS. Verifica cuál es el comportamiento actual.

---

4. **DevTools Test - ¿Carlos puede ver time entries de Sergio?**

```javascript
// Como Carlos, intentar ver entries de otros
const { data: allEntries, error } = await supabase
  .from('time_entries')
  .select('*, profiles(full_name)')
  .neq('user_id', (await supabase.auth.getUser()).data.user.id)

console.log('⏱️ Time entries de otros usuarios:', allEntries)
console.log('¿Puede ver datos de Sergio?', allEntries?.length > 0 ? '❌ SÍ (problema)' : '✅ NO (correcto)')
```

**✅ Verificación:**
- [ ] El resultado está vacío (Carlos solo ve sus propios time entries)
- [ ] RLS está bloqueando acceso a entries de otros members

---

## Paso 2.7: Verificar Permisos de Sergio (Owner)

**Como Sergio (ventana normal, NO incógnito):**

1. **Asegúrate de estar en "Test Company S.L."**
2. **Ve a Team**

**✅ Verificación:**
- [ ] Sergio VE a Carlos en la lista
- [ ] Sergio PUEDE cambiar el rol de Carlos (hay un dropdown)
- [ ] Opciones disponibles: "Miembro", "Administrador"

---

3. **Cambiar rol de Carlos a Admin:**
   - Selecciona "Administrador" en el dropdown de Carlos
   - Debería actualizarse

4. **Vuelve a la ventana de Carlos (incógnito)**
5. **Refresca la página**

**✅ Verificación:**
- [ ] Carlos ahora aparece como "Administrador" en su propia vista de Team
- [ ] Carlos PUEDE gestionar miembros (si vuelve a cambiar a member, podría invitar)

---

## Paso 2.8: Crear Datos en Test Company

**Como Sergio:**

1. **Crea 2 proyectos en "Test Company S.L.":**
   - "Proyecto Alpha"
   - "Proyecto Beta"

2. **Registra tiempo en "Proyecto Alpha"**

**Como Carlos (ventana incógnito):**

1. **Cambia a "Test Company S.L."**
2. **Registra tiempo en "Proyecto Beta"**

---

## Paso 2.9: Verificar Reportes (Owner vs Member)

**Como Sergio (Owner):**

1. **Ve a Reports**
2. **Selecciona "Test Company S.L." como filtro**

**✅ Verificación:**
- [ ] Sergio VE los time entries de Carlos
- [ ] Sergio VE sus propios time entries
- [ ] Total de horas refleja el trabajo de TODOS

---

**Como Carlos (Member - ahora Admin):**

1. **Ve a Reports**
2. **Selecciona "Test Company S.L."**

**✅ Verificación:**
- [ ] Carlos (como Admin) PUEDE ver time entries de otros
- [ ] Si lo vuelves a cambiar a "Member" y refrescas:
  - [ ] Carlos solo ve sus propios entries

---

## 🎯 Resultado Esperado del TEST 2:

```
✅ Owner (Sergio) puede gestionar equipo
✅ Owner puede cambiar roles de miembros
✅ Owner puede ver todos los time entries del equipo
✅ Member solo ve sus propios time entries
✅ Admin puede ver time entries de todos (gestión)
✅ Sistema de invitación funciona correctamente
```

**Si todos los checks pasan → TEST 2 EXITOSO** ✅

---

# 🧪 TEST 3: Usuario Híbrido (Contexts Independientes)

**Objetivo:** Verificar que Carlos puede tener vida profesional dual sin mezcla de datos.

## Paso 3.1: Carlos Trabaja en su Workspace Personal

**Como Carlos (ventana incógnito):**

1. **Cambia a "Personal Workspace"** en el selector de workspaces
2. **Crea 2 proyectos personales:**
   - "Freelance - Cliente Particular"
   - "Proyecto Side Hustle"

3. **Registra tiempo en alguno**

**✅ Verificación:**
- [ ] Los proyectos se crean sin problemas
- [ ] NO ves proyectos de "Test Company S.L."
- [ ] Dashboard solo muestra TU trabajo personal

---

## Paso 3.2: Cambiar Entre Contextos

1. **Cambia a "Test Company S.L."**

**✅ Verificación:**
- [ ] Los proyectos cambian completamente
- [ ] Ahora solo ves "Proyecto Alpha" y "Proyecto Beta"
- [ ] NO ves "Freelance - Cliente Particular"

2. **Vuelve a "Personal Workspace"**

**✅ Verificación:**
- [ ] De nuevo solo ves tus proyectos personales
- [ ] Contexto cambia instantáneamente

---

## Paso 3.3: DevTools - Verificar Segregación

```javascript
// Ver qué organization_id está activo
const { data: { user } } = await supabase.auth.getUser()
const { organization } = JSON.parse(localStorage.getItem(`sb-${supabase.auth.supabaseKey.split('.')[0]}-auth-token`) || '{}')

console.log('🎯 Organización activa:', organization?.name)
console.log('📋 Organization ID:', organization?.id)

// Ver proyectos del contexto activo
const { data: projects } = await supabase
  .from('projects')
  .select('name, organization_id')

console.log('📁 Proyectos visibles en este contexto:', projects)
console.log('¿Todos tienen el mismo organization_id?:', 
  projects?.every(p => p.organization_id === organization?.id) ? '✅ SÍ' : '❌ NO')
```

**✅ Verificación:**
- [ ] Todos los proyectos visibles pertenecen al workspace activo
- [ ] No hay "fuga" de proyectos de otros workspaces

---

## 🎯 Resultado Esperado del TEST 3:

```
✅ Carlos puede tener múltiples identidades profesionales
✅ Los datos están 100% segregados por workspace
✅ Cambiar contexto es instantáneo y fiable
✅ No hay mezcla de proyectos/tiempo entre workspaces
```

**Si todos los checks pasan → TEST 3 EXITOSO** ✅

---

# 📊 REPORTE FINAL DE TESTING

| Test | Objetivo | Estado |
|------|----------|--------|
| TEST 1 | Aislamiento Workspace Personal | ⬜ Pendiente |
| TEST 2 | Owner con Empleados | ⬜ Pendiente |
| TEST 3 | Usuario Híbrido | ⬜ Pendiente |

**Una vez completes los 3 tests, actualiza esta tabla:**
- ✅ = Pasó sin problemas
- ⚠️ = Pasó con warnings/bugs menores
- ❌ = Falló (requiere correcciones)

---

# 🚀 Próximos Pasos Post-Testing

Si todos los tests pasan:

1. **Documenta cualquier bug encontrado**
2. **Limpia usuarios de prueba** (freelance@test.com, employee@test.com)
3. **Commit y push a GitHub:**
   ```bash
   git add .
   git commit -m "feat: Multi-workspace system with enterprise-grade RLS security

   - Implemented workspace switcher in avatar dropdown
   - Fixed critical RLS policies for data segregation
   - Verified isolation between personal/business workspaces
   - All security tests passed successfully"
   git push origin main
   ```

4. **Deploy a producción** (Vercel actualizará automáticamente)

---

**Tiempo estimado de testing:** 20-30 minutos siguiendo esta guía.

**¿Listo para empezar? Comienza con el TEST 1 Paso 1.1** 🚀
