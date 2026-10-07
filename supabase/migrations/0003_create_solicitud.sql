-- ============================================================
-- 0004_create_fun_crear_solicitud.sql
-- Hace la creacion de una solicitud
-- ============================================================

CREATE OR REPLACE FUNCTION fun_crear_solicitud(
    -- Datos personales (detalle_solicitud)
    p_id_carrera        UUID,
    p_nombre            VARCHAR(45),
    p_apellido          VARCHAR(45),
    p_telefono          VARCHAR(20),
    p_email             VARCHAR(255),
    p_fecha_titulacion  DATE,
    p_fecha_ingreso     DATE,
    p_ci                VARCHAR(20),
    p_extension_ci      VARCHAR(20),
    p_anio_egreso       SMALLINT,
    p_cod_sis           NUMERIC,
    p_desea_mentor      BOOLEAN,
    -- Documento de respaldo
    p_id_tipo_archivo   UUID,
    p_tamanio_mb        INTEGER,
    p_ruta_storage      TEXT,
    p_es_valido         BOOLEAN,
    -- Solicitud
    p_estado            VARCHAR(20),
    -- Usuario (opcional, puede ir NULL si aún no está autenticado)
    p_id_usuario        UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_detalle     UUID;
    v_id_documento   UUID;
    v_id_solicitud   UUID;
BEGIN
    -- 1. Insertar detalle_solicitud
    INSERT INTO detalle_solicitud (
        id_carrera, nombre, apellido, telefono, email,
        fecha_titulacion, fecha_ingreso, ci, extension_ci,
        anio_egreso, cod_sis, desea_mentor
    )
    VALUES (
        p_id_carrera, p_nombre, p_apellido, p_telefono, p_email,
        p_fecha_titulacion, p_fecha_ingreso, p_ci, p_extension_ci,
        p_anio_egreso, p_cod_sis, COALESCE(p_desea_mentor, FALSE)
    )
    RETURNING id INTO v_id_detalle;

    -- 2. Insertar documento_respaldo
    INSERT INTO documento_respaldo (
        id_tipo_archivo, tamanio_mb, ruta_storage,
        fecha_creacion, es_valido
    )
    VALUES (
        p_id_tipo_archivo, p_tamanio_mb, p_ruta_storage,
        NOW(), COALESCE(p_es_valido, FALSE)
    )
    RETURNING id INTO v_id_documento;

    -- 3. Insertar solicitud
    INSERT INTO solicitud (
        id_detalle_solicitud, id_documento_respaldo,
        estado, fecha_creacion
    )
    VALUES (
        v_id_detalle, v_id_documento,
        COALESCE(p_estado, 'PENDIENTE'), NOW()
    )
    RETURNING id INTO v_id_solicitud;

    -- 4. Vincular usuario (solo si se proporcionó)
    IF p_id_usuario IS NOT NULL THEN
        INSERT INTO usuario_solicitud (
            id_usuario, id_solicitud, detalle_solicitud_id
        )
        VALUES (
            p_id_usuario, v_id_solicitud, v_id_detalle
        );
    END IF;

    RETURN v_id_solicitud;

EXCEPTION
    WHEN OTHERS THEN
        -- Cualquier error revierte TODA la transacción automáticamente
        RAISE EXCEPTION 'Error al crear solicitud: %', SQLERRM;
END;
$$;