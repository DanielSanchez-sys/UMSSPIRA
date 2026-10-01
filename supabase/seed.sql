--MOCK PARA EPIC 9 CON 30 DATOS AÑADIDOS A LAS TABLAS DETELLE_SOLICITUD Y SOLICITUD, SOLICITU, DICTAMEN
INSERT INTO public.detalle_solicitud (
    id,
    id_carrera,
    nombre,
    apellido,
    telefono,
    email,
    fecha_titulacion,
    fecha_ingreso,
    ci,
    extension_ci,
    anio_egreso,
    cod_sis,
    desea_mentor
)
VALUES
('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 'Juan', 'Perez', '70712345', 'juan.perez@gmail.com', '2024-08-15', '2019-02-04', '6543210', 'CB', 2024, 201900001, TRUE),
('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', 'Maria', 'Gomez', '71234567', 'maria.gomez@gmail.com', '2023-12-10', '2018-02-05', '7654321', 'LP', 2023, 201800002, FALSE),
('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003', 'Carlos', 'Rodriguez', '72345678', 'carlos.rodriguez@gmail.com', '2024-03-22', '2019-02-04', '8765432', 'SC', 2024, 201900003, TRUE),
('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 'Ana', 'Fernandez', '73456789', 'ana.fernandez@gmail.com', '2022-11-18', '2017-02-06', '9876543', 'CB', 2022, 201700004, TRUE),
('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000002', 'Luis', 'Martinez', '74567890', 'luis.martinez@gmail.com', '2023-07-14', '2018-02-05', '5432109', 'OR', 2023, 201800005, FALSE),
('00000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000003', 'Sofia', 'Lopez', '75678901', 'sofia.lopez@gmail.com', '2024-06-20', '2019-02-04', '4321098', 'CB', 2024, 201900006, TRUE),
('00000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000001', 'Diego', 'Vargas', '76789012', 'diego.vargas@gmail.com', '2021-10-12', '2016-02-08', '3210987', 'LP', 2021, 201600007, FALSE),
('00000000-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000002', 'Valeria', 'Castro', '77890123', 'valeria.castro@gmail.com', '2022-05-27', '2017-02-06', '2109876', 'SC', 2022, 201700008, TRUE),
('00000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000003', 'Miguel', 'Rojas', '78901234', 'miguel.rojas@gmail.com', '2023-09-08', '2018-02-05', '1098765', 'CB', 2023, 201800009, TRUE),
('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000001', 'Camila', 'Mendoza', '79012345', 'camila.mendoza@gmail.com', '2024-01-19', '2019-02-04', '1987654', 'CB', 2024, 201900010, FALSE),
('00000000-0000-4000-8000-000000000011', '00000000-0000-4000-8000-000000000002', 'Andres', 'Torrez', '70123456', 'andres.torrez@gmail.com', '2020-12-11', '2015-02-09', '2876543', 'LP', 2020, 201500011, TRUE),
('00000000-0000-4000-8000-000000000012', '00000000-0000-4000-8000-000000000003', 'Gabriela', 'Suarez', '70234567', 'gabriela.suarez@gmail.com', '2021-08-25', '2016-02-08', '3765432', 'CB', 2021, 201600012, FALSE),
('00000000-0000-4000-8000-000000000013', '00000000-0000-4000-8000-000000000001', 'Fernando', 'Alvarez', '70345678', 'fernando.alvarez@gmail.com', '2022-03-16', '2017-02-06', '4654321', 'SC', 2022, 201700013, TRUE),
('00000000-0000-4000-8000-000000000014', '00000000-0000-4000-8000-000000000002', 'Daniela', 'Quispe', '70456789', 'daniela.quispe@gmail.com', '2023-04-21', '2018-02-05', '5543210', 'CB', 2023, 201800014, TRUE),
('00000000-0000-4000-8000-000000000015', '00000000-0000-4000-8000-000000000003', 'Ricardo', 'Mamani', '70567890', 'ricardo.mamani@gmail.com', '2024-09-13', '2019-02-04', '6432109', 'LP', 2024, 201900015, FALSE),
('00000000-0000-4000-8000-000000000016', '00000000-0000-4000-8000-000000000001', 'Patricia', 'Condori', '70678901', 'patricia.condori@gmail.com', '2022-07-29', '2017-02-06', '7321098', 'OR', 2022, 201700016, TRUE),
('00000000-0000-4000-8000-000000000017', '00000000-0000-4000-8000-000000000002', 'Jose', 'Flores', '70890123', 'jose.flores@gmail.com', '2023-02-17', '2018-02-05', '8210987', 'CB', 2023, 201800017, FALSE),
('00000000-0000-4000-8000-000000000018', '00000000-0000-4000-8000-000000000003', 'Lucia', 'Chavez', '70901234', 'lucia.chavez@gmail.com', '2024-05-10', '2019-02-04', '9109876', 'SC', 2024, 201900018, TRUE),
('00000000-0000-4000-8000-000000000019', '00000000-0000-4000-8000-000000000001', 'Marco', 'Gutierrez', '71012345', 'marco.gutierrez@gmail.com', '2021-11-26', '2016-02-08', '1230987', 'CB', 2021, 201600019, TRUE),
('00000000-0000-4000-8000-000000000020', '00000000-0000-4000-8000-000000000002', 'Natalia', 'Paredes', '71123456', 'natalia.paredes@gmail.com', '2022-10-07', '2017-02-06', '2341098', 'LP', 2022, 201700020, FALSE),
('00000000-0000-4000-8000-000000000021', '00000000-0000-4000-8000-000000000003', 'Victor', 'Sanchez', '71345678', 'victor.sanchez@gmail.com', '2023-06-23', '2018-02-05', '3452109', 'CB', 2023, 201800021, TRUE),
('00000000-0000-4000-8000-000000000022', '00000000-0000-4000-8000-000000000001', 'Paola', 'Rivera', '71456789', 'paola.rivera@gmail.com', '2024-02-09', '2019-02-04', '4563210', 'SC', 2024, 201900022, FALSE),
('00000000-0000-4000-8000-000000000023', '00000000-0000-4000-8000-000000000002', 'Alejandro', 'Cortez', '71567890', 'alejandro.cortez@gmail.com', '2020-09-18', '2015-02-09', '5674321', 'CB', 2020, 201500023, TRUE),
('00000000-0000-4000-8000-000000000024', '00000000-0000-4000-8000-000000000003', 'Monica', 'Vega', '71678901', 'monica.vega@gmail.com', '2021-04-30', '2016-02-08', '6785432', 'LP', 2021, 201600024, TRUE),
('00000000-0000-4000-8000-000000000025', '00000000-0000-4000-8000-000000000001', 'Esteban', 'Herrera', '71789012', 'esteban.herrera@gmail.com', '2022-12-16', '2017-02-06', '7896543', 'CB', 2022, 201700025, FALSE),
('00000000-0000-4000-8000-000000000026', '00000000-0000-4000-8000-000000000002', 'Carolina', 'Villarroel', '71890123', 'carolina.villarroel@gmail.com', '2023-08-04', '2018-02-05', '8907654', 'SC', 2023, 201800026, TRUE),
('00000000-0000-4000-8000-000000000027', '00000000-0000-4000-8000-000000000003', 'Roberto', 'Salazar', '71901234', 'roberto.salazar@gmail.com', '2024-04-12', '2019-02-04', '9018765', 'CB', 2024, 201900027, FALSE),
('00000000-0000-4000-8000-000000000028', '00000000-0000-4000-8000-000000000001', 'Veronica', 'Espinoza', '72012345', 'veronica.espinoza@gmail.com', '2021-06-18', '2016-02-08', '1129876', 'OR', 2021, 201600028, TRUE),
('00000000-0000-4000-8000-000000000029', '00000000-0000-4000-8000-000000000002', 'Sergio', 'Navarro', '72123456', 'sergio.navarro@gmail.com', '2022-09-23', '2017-02-06', '2230987', 'CB', 2022, 201700029, FALSE),
('00000000-0000-4000-8000-000000000030', '00000000-0000-4000-8000-000000000003', 'Adriana', 'Mendez', '72234567', 'adriana.mendez@gmail.com', '2023-11-17', '2018-02-05', '3341098', 'LP', 2023, 201800030, TRUE)

ON CONFLICT (id) DO NOTHING;
INSERT INTO public.solicitud (
    id,
    id_detalle_solicitud,
    id_documento_respaldo,
    estado,
    fecha_creacion
)
VALUES
('10000000-0000-4000-9000-000000000001', '00000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'VERIFICADO', '2026-09-01 09:15:00'),
('10000000-0000-4000-9000-000000000002', '00000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', 'OBSERVADO', '2026-09-01 10:20:00'),
('10000000-0000-4000-9000-000000000003', '00000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000003', 'VERIFICADO', '2026-09-02 08:45:00'),
('10000000-0000-4000-9000-000000000004', '00000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000004', 'OBSERVADO', '2026-09-02 11:30:00'),
('10000000-0000-4000-9000-000000000005', '00000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000005', 'VERIFICADO', '2026-09-03 09:10:00'),
('10000000-0000-4000-9000-000000000006', '00000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000006', 'OBSERVADO', '2026-09-03 14:25:00'),
('10000000-0000-4000-9000-000000000007', '00000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000007', 'VERIFICADO', '2026-09-04 10:00:00'),
('10000000-0000-4000-9000-000000000008', '00000000-0000-4000-8000-000000000008', '40000000-0000-4000-8000-000000000008', 'OBSERVADO', '2026-09-04 15:40:00'),
('10000000-0000-4000-9000-000000000009', '00000000-0000-4000-8000-000000000009', '40000000-0000-4000-8000-000000000009', 'VERIFICADO', '2026-09-05 08:20:00'),
('10000000-0000-4000-9000-000000000010', '00000000-0000-4000-8000-000000000010', '40000000-0000-4000-8000-000000000010', 'OBSERVADO', '2026-09-05 11:15:00'),
('10000000-0000-4000-9000-000000000011', '00000000-0000-4000-8000-000000000011', '40000000-0000-4000-8000-000000000011', 'VERIFICADO', '2026-09-06 09:35:00'),
('10000000-0000-4000-9000-000000000012', '00000000-0000-4000-8000-000000000012', '40000000-0000-4000-8000-000000000012', 'OBSERVADO', '2026-09-06 13:50:00'),
('10000000-0000-4000-9000-000000000013', '00000000-0000-4000-8000-000000000013', '40000000-0000-4000-8000-000000000013', 'VERIFICADO', '2026-09-07 08:10:00'),
('10000000-0000-4000-9000-000000000014', '00000000-0000-4000-8000-000000000014', '40000000-0000-4000-8000-000000000014', 'OBSERVADO', '2026-09-07 16:20:00'),
('10000000-0000-4000-9000-000000000015', '00000000-0000-4000-8000-000000000015', '40000000-0000-4000-8000-000000000015', 'VERIFICADO', '2026-09-08 10:45:00'),
('10000000-0000-4000-9000-000000000016', '00000000-0000-4000-8000-000000000016', '40000000-0000-4000-8000-000000000016', 'OBSERVADO', '2026-09-08 12:30:00'),
('10000000-0000-4000-9000-000000000017', '00000000-0000-4000-8000-000000000017', '40000000-0000-4000-8000-000000000017', 'VERIFICADO', '2026-09-09 09:00:00'),
('10000000-0000-4000-9000-000000000018', '00000000-0000-4000-8000-000000000018', '40000000-0000-4000-8000-000000000018', 'OBSERVADO', '2026-09-09 14:15:00'),
('10000000-0000-4000-9000-000000000019', '00000000-0000-4000-8000-000000000019', '40000000-0000-4000-8000-000000000019', 'VERIFICADO', '2026-09-10 08:50:00'),
('10000000-0000-4000-9000-000000000020', '00000000-0000-4000-8000-000000000020', '40000000-0000-4000-8000-000000000020', 'OBSERVADO', '2026-09-10 11:40:00'),
('10000000-0000-4000-9000-000000000021', '00000000-0000-4000-8000-000000000021', '40000000-0000-4000-8000-000000000021', 'VERIFICADO', '2026-09-11 09:25:00'),
('10000000-0000-4000-9000-000000000022', '00000000-0000-4000-8000-000000000022', '40000000-0000-4000-8000-000000000022', 'OBSERVADO', '2026-09-11 15:10:00'),
('10000000-0000-4000-9000-000000000023', '00000000-0000-4000-8000-000000000023', '40000000-0000-4000-8000-000000000023', 'VERIFICADO', '2026-09-12 10:05:00'),
('10000000-0000-4000-9000-000000000024', '00000000-0000-4000-8000-000000000024', '40000000-0000-4000-8000-000000000024', 'OBSERVADO', '2026-09-12 13:45:00'),
('10000000-0000-4000-9000-000000000025', '00000000-0000-4000-8000-000000000025', '40000000-0000-4000-8000-000000000025', 'VERIFICADO', '2026-09-13 09:30:00'),
('10000000-0000-4000-9000-000000000026', '00000000-0000-4000-8000-000000000026', '40000000-0000-4000-8000-000000000026', 'OBSERVADO', '2026-09-13 16:00:00'),
('10000000-0000-4000-9000-000000000027', '00000000-0000-4000-8000-000000000027', '40000000-0000-4000-8000-000000000027', 'VERIFICADO', '2026-09-14 10:20:00'),
('10000000-0000-4000-9000-000000000028', '00000000-0000-4000-8000-000000000028', '40000000-0000-4000-8000-000000000028', 'OBSERVADO', '2026-09-14 14:35:00'),
('10000000-0000-4000-9000-000000000029', '00000000-0000-4000-8000-000000000029', '40000000-0000-4000-8000-000000000029', 'VERIFICADO', '2026-09-15 08:40:00'),
('10000000-0000-4000-9000-000000000030', '00000000-0000-4000-8000-000000000030', '40000000-0000-4000-8000-000000000030', 'OBSERVADO', '2026-09-15 11:55:00')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.dictamen (
    id,
    id_administrador_sistema,
    id_solicitud,
    justificacion,
    fecha_creacion,
    fecha_actualizacion,
    subsanada
)
VALUES
(
    '50000000-0000-4000-8000-000000000001',
    '60000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-9000-000000000002',
    'La solicitud presenta documentación incompleta. Falta adjuntar el documento de solicitud firmado por el postulante y una copia legible del documento de identidad. Además, no se pudo verificar la correspondencia entre los datos registrados en el formulario y la documentación presentada. Se solicita completar la documentación requerida antes de continuar con el proceso de verificación.',
    '2026-09-02 10:30:00',
    '2026-09-05',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000002',
    '60000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-9000-000000000004',
    'Se observa que falta el documento de solicitud debidamente firmado y sellado. Asimismo, el documento de respaldo presentado no permite verificar de manera clara la fecha de titulación registrada. Se requiere presentar una nueva copia legible del documento y completar la documentación faltante para proceder con la revisión.',
    '2026-09-03 11:15:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000003',
    '60000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-9000-000000000006',
    'La documentación presentada requiere subsanación debido a que la copia del documento de identidad se encuentra parcialmente ilegible. También falta adjuntar el documento de solicitud firmado y una copia actualizada del respaldo académico. El solicitante deberá presentar los documentos indicados para continuar con la validación.',
    '2026-09-04 09:45:00',
    '2026-09-07',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000004',
    '60000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-9000-000000000008',
    'Se identificó una inconsistencia entre la información registrada en la solicitud y los datos consignados en la documentación de respaldo. Adicionalmente, falta el documento de solicitud firmado por el interesado y no se adjuntó la constancia correspondiente al egreso. Se solicita corregir la información y completar los documentos pendientes.',
    '2026-09-05 14:20:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000005',
    '60000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-9000-000000000010',
    'La solicitud se encuentra observada debido a la falta de documentación de respaldo. No se adjuntó el documento de solicitud firmado ni la constancia que permita verificar la información académica declarada. También se requiere una copia legible del documento de identidad. La documentación deberá ser completada para continuar con el proceso.',
    '2026-09-06 10:10:00',
    '2026-09-10',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000006',
    '60000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-9000-000000000012',
    'El documento presentado como respaldo no corresponde al tipo de documentación requerido para validar la solicitud. Falta adjuntar el documento de solicitud firmado y la certificación correspondiente a los datos académicos registrados. Se deberá reemplazar el documento observado y completar los requisitos pendientes antes de una nueva revisión.',
    '2026-09-07 15:30:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000007',
    '60000000-0000-4000-8000-000000000007',
    '10000000-0000-4000-9000-000000000014',
    'Se observa la información de contacto registrada en la solicitud, debido a que presenta datos que no coinciden con la documentación proporcionada. Además, falta el documento de solicitud firmado y una copia legible del documento de identidad. Se solicita actualizar la información y adjuntar nuevamente la documentación correspondiente.',
    '2026-09-08 09:25:00',
    '2026-09-11',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000008',
    '60000000-0000-4000-8000-000000000008',
    '10000000-0000-4000-9000-000000000016',
    'La fecha de egreso registrada en la solicitud no coincide con la información contenida en el documento de respaldo presentado. También se encuentra pendiente el documento de solicitud firmado y la certificación académica correspondiente. Se requiere aclarar la diferencia identificada y presentar los documentos faltantes para continuar con la verificación.',
    '2026-09-09 11:40:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000009',
    '60000000-0000-4000-8000-000000000009',
    '10000000-0000-4000-9000-000000000018',
    'La documentación de respaldo presenta problemas de legibilidad, por lo que no es posible verificar completamente la información declarada. Falta además adjuntar el documento de solicitud firmado y una copia clara del documento de identidad. Se solicita presentar nuevamente los documentos observados en condiciones que permitan su correcta revisión.',
    '2026-09-10 13:15:00',
    '2026-09-13',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000010',
    '60000000-0000-4000-8000-000000000010',
    '10000000-0000-4000-9000-000000000020',
    'La solicitud presenta información pendiente de respaldo documental. No se adjuntó el documento de solicitud firmado, falta la certificación de egreso y el documento presentado para acreditar la titulación no contiene información suficiente para realizar la verificación. Se requiere completar la documentación antes de continuar con el trámite.',
    '2026-09-11 10:50:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000011',
    '60000000-0000-4000-8000-000000000011',
    '10000000-0000-4000-9000-000000000022',
    'Los datos de identificación registrados en la solicitud presentan diferencias respecto al documento de identidad adjunto. Asimismo, falta el documento de solicitud firmado y la documentación que permita validar la información académica declarada. Se solicita corregir los datos correspondientes y presentar los documentos faltantes.',
    '2026-09-12 14:05:00',
    '2026-09-15',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000012',
    '60000000-0000-4000-8000-000000000012',
    '10000000-0000-4000-9000-000000000024',
    'No fue posible validar completamente la documentación presentada debido a que falta el documento de solicitud firmado y la constancia de respaldo académico. El documento adjunto no contiene información suficiente para comprobar los datos declarados. Se requiere presentar la documentación completa y legible para realizar una nueva revisión.',
    '2026-09-13 09:35:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000013',
    '60000000-0000-4000-8000-000000000013',
    '10000000-0000-4000-9000-000000000026',
    'La documentación presentada se encuentra incompleta. Falta adjuntar el documento de solicitud firmado, la certificación de egreso y una copia legible del documento de identidad. Adicionalmente, el documento de respaldo presentado requiere ser reemplazado debido a que parte de la información no puede ser verificada. Se solicita subsanar las observaciones indicadas.',
    '2026-09-14 12:20:00',
    '2026-09-17',
    TRUE
),
(
    '50000000-0000-4000-8000-000000000014',
    '60000000-0000-4000-8000-000000000014',
    '10000000-0000-4000-9000-000000000028',
    'Se encuentra pendiente la verificación de información relacionada con la fecha de ingreso y egreso registrada en la solicitud. Falta el documento de solicitud firmado y la documentación académica que permita validar dichos datos. El interesado deberá presentar los documentos faltantes y aclarar la información observada para continuar con el proceso.',
    '2026-09-15 10:05:00',
    NULL,
    FALSE
),
(
    '50000000-0000-4000-8000-000000000015',
    '60000000-0000-4000-8000-000000000015',
    '10000000-0000-4000-9000-000000000030',
    'La solicitud no cumple actualmente con todos los requisitos documentales establecidos. Falta presentar el documento de solicitud firmado, la certificación de egreso y una copia legible del documento de identidad. Asimismo, el documento de respaldo presentado no permite verificar completamente la información declarada. Se solicita completar y reemplazar la documentación observada antes de realizar una nueva evaluación.',
    '2026-09-15 11:55:00',
    '2026-09-18',
    TRUE
)
ON CONFLICT (id) DO NOTHING;