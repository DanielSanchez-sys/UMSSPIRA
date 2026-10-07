-- 1.1. HU-01: "Expedido en" para CA-01.4
ALTER TABLE detalle_solicitud
    ADD COLUMN IF NOT EXISTS expedido_en VARCHAR(20)
    CHECK (expedido_en IN ('LP','CB','SC','OR','PT','TJ','CH','BE','PD','Extranjero'));

-- 1.2. HU-04: Tipo de dictamen
ALTER TABLE dictamen
    ADD COLUMN IF NOT EXISTS tipo VARCHAR(20)
    CHECK (tipo IN ('APROBADO', 'OBSERVADO', 'RECHAZADO'));

-- 1.3. HU-04: Categoría de observación (CA-04.5 y CA-04.6)
ALTER TABLE dictamen
    ADD COLUMN IF NOT EXISTS categoria VARCHAR(50)
    CHECK (
        categoria IS NULL
        OR categoria IN (
            'DATOS_INCORRECTOS',
            'DOC_ILEGIBLE',
            'DOC_VENCIDO',
            'DOC_NO_CORRESPONDE',
            'FALTA_FIRMA_SELLO',
            'INFO_NO_COINCIDE',
            'OTRO'
        )
    );