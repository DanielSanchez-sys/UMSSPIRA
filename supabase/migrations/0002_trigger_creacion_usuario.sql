-- ============================================================
-- PARTE 1: ALINEAR usuario.usuario_id CON auth.uid()
-- ============================================================

-- 1.1. Quitar el DEFAULT para que usuario_id deba venir de auth.users
ALTER TABLE usuario ALTER COLUMN usuario_id DROP DEFAULT;

-- 1.2. Trigger: al registrarse en auth.users, crear fila en usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.usuario (usuario_id, nombre, rol)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
        COALESCE(NEW.raw_user_meta_data->>'rol', 'usuario')
    )
    ON CONFLICT (usuario_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;

CREATE TRIGGER trg_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
