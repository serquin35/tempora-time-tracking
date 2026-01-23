# Plan de Testing Pre-Producción - Tempora

> **Objetivo**: Validar que la segregación de datos multi-workspace funciona correctamente antes de subir a GitHub  
> **Fecha**: 23 Enero 2026  
> **Estimación**: 30-45 minutos de testing manual

---

## 📋 **Preparación del Entorno de Testing**

### 1. Limpiar Base de Datos

**Opción A: Limpieza Automática (Recomendado)**
```bash
# Desde Supabase SQL Editor, ejecutar:
# database/cleanup_test_data.sql
```

**Opción B: Limpieza Manual Selectiva**
- Ir a Supabase Dashboard → Table Editor
- Eliminar manualmente los usuarios de prueba (excepto serquin16@gmail.com)

---

### 2. Crear Usuarios de Prueba

**Necesitamos 3 usuarios para probar la segregación:**

| Usuario | Email | Rol | Propósito |
|---------|-------|-----|-----------|
| **TÚ** | serquin16@gmail.com | Owner | Usuario principal (ya existe) |
| **Usuario Freelance** | [email temporal] | Owner | Probar workspace personal aislado |
| **Usuario Empleado** | [email temporal] | Member | Probar acceso limitado en empresa |

**Sugerencia de emails temporales:**
- Usar [10minutemail.com](https://10minutemail.com) o [temp-mail.org](https://temp-mail.org)
- O crear alias de Gmail: `tuemail+freelance@gmail.com`, `tuemail+empleado@gmail.com`

---

## 🧪 **Suite de Tests de Segregación**

### **TEST 1: Workspace Personal Aislado** 🟢

**Objetivo:** Verificar que un freelance NO ve datos de otros usuarios.

**Pasos:**
1. ✅ Registrar nuevo usuario "Freelance Test" (email temporal)
2. ✅ Verificar que se crea automáticamente un "Personal Workspace"
3. ✅ Crear 2-3 proyectos en ese workspace
4. ✅ Registrar algunas entradas de tiempo

**Verificación:**
- [ ] El usuario solo ve SU workspace en el selector
- [ ] Dashboard solo muestra SUS proyectos
- [ ] Reports solo muestran SUS datos
- [ ] La página Team muestra "Unirme a un Equipo"

**Criterio de Éxito:** ✅ Usuario completamente aislado, sin ver nada de otros

---

### **TEST 2: Owner de Empresa con Empleados** 🟡

**Objetivo:** Verificar que un Owner puede gestionar equipo y ver datos completos.

**Pasos:**
1. ✅ Con TU cuenta (serquin16@gmail.com), crear una nueva organización:
   - Ir a Profile → Organization → "Unirse a organización"
   - Crear manualmente desde Supabase una org de tipo 'business' con tu user_id como owner
   
   **SQL para crear org de prueba:**
   ```sql
   INSERT INTO organizations (name, slug, owner_id, type)
   VALUES ('Test Company S.L.', 'test-company-2026', '07143142-2f7e-4e95-bec1-64e0e842d40f', 'business')
   RETURNING id;
   
   -- Copiar el ID devuelto y usar en:
   INSERT INTO organization_members (organization_id, user_id, role)
   VALUES ('[ID_COPIADO]', '07143142-2f7e-4e95-bec1-64e0e842d40f', 'owner');
   ```

2. ✅ Invitar al "Usuario Empleado":
   - Copiar el ID de la organización
   - Registrar nuevo usuario "Empleado Test"
   - Desde la cuenta del empleado, ir a Team → pegar código de invitación

3. ✅ Crear proyectos en "Test Company S.L."

4. ✅ Ambos usuarios registran tiempo

**Verificación (como Owner - TÚ):**
- [ ] Puedes cambiar entre "Personal Workspace" y "Test Company S.L."
- [ ] En "Test Company", ves TODO el equipo en la página Team
- [ ] En Reports, ves las entradas de TODOS los empleados
- [ ] Puedes gestionar roles del empleado (cambiar a admin, member, etc.)

**Verificación (como Empleado):**
- [ ] Ve "Test Company S.L." en su selector de workspaces
- [ ] También tiene SU "Personal Workspace" separado
- [ ] En "Test Company", solo ve SUS propias entradas de tiempo
- [ ] NO puede ver reportes de otros empleados
- [ ] NO puede crear/editar proyectos (solo owner/admin)

**Criterio de Éxito:** 
- ✅ Owner ve todo de la empresa
- ✅ Member solo ve sus propios datos
- ✅ Workspaces completamente separados

---

### **TEST 3: Usuario Híbrido (Freelance + Empleado)** 🔵

**Objetivo:** Verificar que el mismo usuario puede tener múltiples contextos sin mezcla.

**Pasos:**
1. ✅ Con la cuenta "Usuario Empleado", registrar tiempo en SU workspace personal
2. ✅ Cambiar a "Test Company S.L."
3. ✅ Registrar tiempo en proyectos de la empresa

**Verificación:**
- [ ] Al cambiar workspace, los proyectos visibles cambian completamente
- [ ] Dashboard muestra datos diferentes según contexto activo
- [ ] Reports son independientes (personal vs empresa)
- [ ] Selector de workspace indica cuál está activo

**Criterio de Éxito:** ✅ Contexts totalmente independientes, sin cruce de datos

---

### **TEST 4: Intentos de Acceso No Autorizado** 🔴

**Objetivo:** Probar que RLS bloquea accesos maliciosos.

**Pasos Técnicos (requiere consola de navegador):**

1. ✅ Como "Usuario Empleado", abrir DevTools → Console
2. ✅ Intentar consultar organizaciones ajenas:

   ```javascript
   // Obtener el ID de otra organización (la del freelance)
   const { data } = await supabase
     .from('organizations')
     .select('*')
   
   console.log('Organizaciones visibles:', data)
   // Deberías ver SOLO tus organizaciones (Personal + Test Company)
   ```

3. ✅ Intentar ver time_entries de otro usuario:

   ```javascript
   const { data } = await supabase
     .from('time_entries')
     .select('*, profiles(full_name)')
     .neq('user_id', '[TU_USER_ID]') // Poner tu ID real
   
   console.log('Time entries de otros:', data)
   // Debería estar vacío si eres 'member', o solo de tu org si eres 'admin'
   ```

4. ✅ Intentar cambiar tu rol a 'owner':

   ```javascript
   const { error } = await supabase
     .from('organization_members')
     .update({ role: 'owner' })
     .eq('user_id', '[TU_USER_ID]')
   
   console.log('Error esperado:', error)
   // Debería fallar con un error de permisos
   ```

**Criterio de Éxito:** ✅ Todos los intentos bloqueados por RLS

---

### **TEST 5: Flujo de Invitación** 🟣

**Objetivo:** Verificar que el sistema de invitación funciona end-to-end.

**Pasos:**
1. ✅ Como Owner, ir a Team → copiar código de invitación
2. ✅ Enviar el código (por email/WhatsApp) a un amigo o usar otro navegador
3. ✅ Nuevo usuario se registra y pega el código
4. ✅ Nuevo usuario aparece en el Team del Owner

**Verificación:**
- [ ] El código es el `organization_id` (UUID válido)
- [ ] Al unirse, el usuario ve la organización en su selector
- [ ] El owner ve al nuevo miembro inmediatamente en Team
- [ ] El nuevo miembro NO puede invitar a otros (solo owner/admin)

**Criterio de Éxito:** ✅ Flujo completo funcional sin errores

---

## 🎯 **Checklist de Pre-Producción**

Antes de hacer `git push`:

### Funcionalidad Core
- [ ] Login/Register funcionan correctamente
- [ ] Workspace personal se crea automáticamente al registrarse
- [ ] Selector de workspace cambia contexto correctamente
- [ ] Timer de tracking funciona en background (minimizar app y volver)

### Segregación de Datos
- [ ] Usuario solo ve organizaciones a las que pertenece
- [ ] Proyectos filtrados por organización activa
- [ ] Time entries respetan permisos (member vs admin)
- [ ] Reports muestran datos correctos según rol

### Seguridad
- [ ] RLS bloquea consultas no autorizadas (test 4 pasado)
- [ ] No se puede escalar privilegios vía frontend
- [ ] Perfiles solo visibles dentro de organizaciones compartidas

### UX
- [ ] Indicador visual de workspace activo (debería estar, sino añadir)
- [ ] Logout funciona desde el AvatarDropdown
- [ ] Notificaciones se marcan como leídas correctamente
- [ ] Botón "Limpiar" elimina notificaciones leídas

---

## 📝 **Registro de Testing**

**Plantilla para documentar cada test:**

```
TEST: [Nombre del test]
Ejecutado por: [Tu nombre]
Fecha/Hora: [...]
Resultado: ✅ PASS / ❌ FAIL
Notas: [Cualquier observación, bug encontrado, etc.]
```

---

## 🚨 **Bugs Comunes a Vigilar**

1. **LocalStorage corrupto**
   - Síntoma: App no carga, pantalla en blanco
   - Fix: `localStorage.clear()` en consola

2. **Workspace no cambia visualmente**
   - Síntoma: Selector muestra "Workspace A" pero datos siguen de "Workspace B"
   - Posible causa: `switchOrganization` no actualiza estado
   - Check: `AuthContext.tsx` línea donde se setea `organization`

3. **RLS niega acceso legítimo**
   - Síntoma: Queries devuelven vacío cuando NO deberían
   - Check: Verificar que `organization_members` tiene entrada para ese usuario + org

---

## 🎉 **Criterios de Aprobación Final**

Para considerar la app lista para producción:

✅ **Todos los tests 1-5 pasan sin fallos**  
✅ **Checklist de pre-producción 100% completo**  
✅ **Ningún error en consola del navegador durante testing**  
✅ **Performance aceptable (app responde en <1s)**  

Una vez completo, estás listo para:
```bash
git add .
git commit -m "feat: Implement multi-workspace system with RLS security"
git push origin main
```

---

**Tiempo estimado total:** 30-45 minutos si sigues el plan ordenadamente.

**Consejo:** Toma notas de cualquier bug que encuentres. Si algo falla, NO subas a GitHub hasta resolverlo.
