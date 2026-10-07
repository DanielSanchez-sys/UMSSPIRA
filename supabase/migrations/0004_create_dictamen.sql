-- ============================================================
-- 0004_create_fun_crear_dictamen.sql
-- Hace la creacion de un dictamen
-- ============================================================

CREATE OR REPLACE FUNCTION fun_crear_dictamen(
    p_id_administrador_sistema UUID,
    p_id_solicitud             UUID,
    p_justificacion            TEXT,
    p_subsanada                BOOLEAN,
    p_nuevo_estado             VARCHAR(20)  -- 'APROBADA', 'RECHAZADA', 'SUBSANACION'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_dictamen       UUID;
    v_estado_actual     VARCHAR(20);
BEGIN
    -- 1. Validar que la solicitud existe y no está ya cerrada
    SELECT estado INTO v_estado_actual
    FROM solicitud
    WHERE id = p_id_solicitud
    FOR UPDATE;   -- bloqueo para evitar doble dictamen concurrente

    IF NOT FOUND THEN
        RAISE EXCEPTION 'La solicitud % no existe', p_id_solicitud;
    END IF;

    IF v_estado_actual IN ('APROBADA', 'RECHAZADA') THEN
        RAISE EXCEPTION 'La solicitud % ya tiene dictamen final (estado: %)',
            p_id_solicitud, v_estado_actual;
    END IF;

    -- 2. Validar que el administrador existe
    IF NOT EXISTS (
        SELECT 1 FROM administrador_sistema WHERE id = p_id_administrador_sistema
    ) THEN
        RAISE EXCEPTION 'El administrador % no existe', p_id_administrador_sistema;
    END IF;

    -- 3. Insertar el dictamen
    INSERT INTO dictamen (
        id_administrador_sistema,
        id_solicitud,
        justificacion,
        fecha_creacion,
        fecha_actualizacion,
        subsanada
    )
    VALUES (
        p_id_administrador_sistema,
        p_id_solicitud,
        p_justificacion,
        NOW(),
        CURRENT_DATE,
        COALESCE(p_subsanada, FALSE)
    )
    RETURNING id INTO v_id_dictamen;

    -- 4. Actualizar estado de la solicitud
    --    Ajusta este CASE según tu lógica de negocio
    UPDATE solicitud
    SET estado = CASE
        WHEN p_nuevo_estado IS NOT NULL THEN p_nuevo_estado
        WHEN p_subsanada = TRUE         THEN 'APROBADA'
        ELSE                                 'RECHAZADA'
    END
    WHERE id = p_id_solicitud;

    RETURN v_id_dictamen;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error al crear dictamen: %', SQLERRM;
END;
$$;