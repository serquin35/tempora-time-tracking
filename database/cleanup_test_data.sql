-- ============================================================================
-- SCRIPT DE LIMPIEZA DE BASE DE DATOS - TEMPORA
-- ============================================================================
-- Propósito: Limpiar datos de prueba manteniendo la cuenta del desarrollador
-- IMPORTANTE: Este script NO es reversible. Hacer backup antes de ejecutar.
-- ============================================================================

-- CONFIGURACIÓN: Define tu email para preservar tu cuenta
-- CAMBIAR ESTO si tu email es diferente:
DO $$
DECLARE
    v_developer_email TEXT := 'serquin16@gmail.com';
    v_developer_user_id UUID;
BEGIN
    -- Obtener el ID del desarrollador
    SELECT id INTO v_developer_user_id 
    FROM auth.users 
    WHERE email = v_developer_email;
    
    RAISE NOTICE 'Developer User ID: %', v_developer_user_id;
    
    -- ========================================================================
    -- PASO 1: Eliminar datos de prueba (time_entries, notifications, etc.)
    -- ========================================================================
    
    -- Eliminar time entries que NO pertenecen al desarrollador
    DELETE FROM time_entries 
    WHERE user_id != v_developer_user_id;
    
    RAISE NOTICE 'Time entries de otros usuarios eliminadas';
    
    -- Eliminar notificaciones que NO pertenecen al desarrollador
    DELETE FROM notifications 
    WHERE user_id != v_developer_user_id;
    
    RAISE NOTICE 'Notificaciones de otros usuarios eliminadas';
    
    -- Eliminar tareas (todas, si existen)
    DELETE FROM tasks;
    
    RAISE NOTICE 'Todas las tareas eliminadas';
    
    -- ========================================================================
    -- PASO 2: Eliminar membresías de usuarios de prueba
    -- ========================================================================
    
    -- Eliminar membresías de organizaciones que NO son del desarrollador
    DELETE FROM organization_members 
    WHERE user_id != v_developer_user_id;
    
    RAISE NOTICE 'Membresías de usuarios de prueba eliminadas';
    
    -- ========================================================================
    -- PASO 3: Eliminar organizaciones que NO pertenecen al desarrollador
    -- ========================================================================
    
    -- Eliminar organizaciones donde el owner NO es el desarrollador
    DELETE FROM organizations 
    WHERE owner_id != v_developer_user_id;
    
    RAISE NOTICE 'Organizaciones de otros usuarios eliminadas';
    
    -- ========================================================================
    -- PASO 4: Eliminar usuarios de prueba
    -- ========================================================================
    
    -- Eliminar perfiles de usuarios que NO son el desarrollador
    DELETE FROM profiles 
    WHERE id != v_developer_user_id;
    
    RAISE NOTICE 'Perfiles de usuarios de prueba eliminados';
    
    -- Eliminar usuarios de auth que NO son el desarrollador
    -- NOTA: Esto requiere permisos especiales en auth.users
    -- Si falla, hay que hacerlo manualmente desde Supabase Dashboard
    DELETE FROM auth.users 
    WHERE id != v_developer_user_id;
    
    RAISE NOTICE 'Usuarios de prueba eliminados de auth.users';
    
    -- ========================================================================
    -- PASO 5: OPCIONAL - Limpiar también los datos del desarrollador
    -- ========================================================================
    
    -- Descomentar las siguientes líneas si quieres empezar desde cero:
    -- DELETE FROM time_entries WHERE user_id = v_developer_user_id;
    -- DELETE FROM notifications WHERE user_id = v_developer_user_id;
    -- DELETE FROM projects WHERE organization_id IN (
    --     SELECT id FROM organizations WHERE owner_id = v_developer_user_id
    -- );
    
    RAISE NOTICE '✅ Limpieza completada';
    
END $$;

-- ============================================================================
-- VERIFICACIÓN POST-LIMPIEZA
-- ============================================================================

-- Ver lo que quedó
SELECT 
    'Users' as table_name,
    COUNT(*) as remaining_records
FROM auth.users
UNION ALL
SELECT 'Profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'Organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'Org Members', COUNT(*) FROM organization_members
UNION ALL
SELECT 'Time Entries', COUNT(*) FROM time_entries
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Tasks', COUNT(*) FROM tasks;
