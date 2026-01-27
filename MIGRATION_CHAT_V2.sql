-- 1. Agregar columna conversation_id
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS conversation_id UUID;

-- 2. Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_chat_conversation_id ON chat_messages(conversation_id);

-- 3. Migrar datos existentes (agrupar todos los mensajes sin ID en uno nuevo para limpieza)
UPDATE chat_messages 
SET conversation_id = gen_random_uuid()
WHERE conversation_id IS NULL;

-- 4. Opcional: Hacer que sea obligatorio para nuevos registros (Descomentar si se desea estricto)
-- ALTER TABLE chat_messages ALTER COLUMN conversation_id SET NOT NULL;
