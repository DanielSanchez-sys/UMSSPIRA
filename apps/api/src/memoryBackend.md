# Contexto backend UMSSPIRA

## Trabajo previo

- Se definieron las condiciones de elegibilidad para mentor: ser egresado, estar verificado y aprobado, no tener restricciones de participacion y completar el perfil minimo.
- Se implemento `MentorshipEligibilityService` para evaluar esas condiciones y devolver los motivos de rechazo y los campos faltantes.
- Se incorporo la desactivacion del rol de mentor conservando la configuracion previa del perfil.

## Perfil minimo requerido

- Datos personales: nombre, apellido, correo valido y telefono.
- Datos academicos: carrera, grado academico y anio de egreso entero.
- Datos profesionales: resumen y anios de experiencia como numero finito no negativo.
- Perfil: descripcion y descripcion de experiencia.
- Elegibilidad de negocio: egresado, verificado, aprobado y sin restriccion de participacion.
- El perfil debe tener `userId` y `isMentorActive: true`; un mentor inactivo nunca es elegible.
- Los campos de texto son obligatorios, deben ser strings no vacios y contener letras; nombre y apellido no pueden contener numeros. El correo y telefono deben tener formatos validos.
- `graduationYear` debe ser un entero entre 1950 y el ano actual. `yearsExperience` debe ser un numero finito de 0 a 80.
- El endpoint de elegibilidad devuelve `eligible: false` con `profile_incomplete`, `invalid_profile_data` y/o las condiciones de negocio que no se cumplen; tambien informa que campos faltan o son invalidos.

## API de mentorship

- `pnpm --filter api dev` inicia NestJS en modo watch en `http://localhost:3000`; no hay consola web, la API se prueba con Postman.
- `GET /mentorship/status` indica `supabase` o `demo`.
- `GET /mentorship/profiles` lista los perfiles disponibles.
- `POST /mentorship/profiles/reset` restaura los perfiles de ejemplo en modo demo.
- `POST /mentorship/eligibility` recibe `{ "profile": { ... } }`; las faltas de campos se devuelven como resultado de validacion, no se aceptan como elegibles.
- `PATCH /mentorship/deactivate/:userId` acepta opcionalmente `{ "reason": "..." }`, solo desactiva un rol actualmente activo y conserva la configuracion previa.
- La coleccion importable de Postman esta en `collection/mentorship-api.postman_collection.json`; usa el environment `collection/environments/local.postman_environment.json`.
- `supabase/seed.sql` carga tres perfiles de ejemplo: elegible, perfil incompleto e inelegible por verificacion/restriccion.
- Aplicar `supabase/migrations/0002_mentorship_eligibility.sql` antes de ejecutar el seed.

## Supabase y modo demo

El API utiliza Supabase REST con `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el entorno de `apps/api`. La clave de servicio es secreta: no se debe exponer al frontend ni guardar en el repositorio. Con ambas variables, los perfiles se leen desde `mentor` y la desactivacion actualiza `esta_activo`, `fecha_actualizacion`, `motivo_desactivacion` y mantiene `configuracion`. Sin ellas, se usa un conjunto local en memoria para probar reglas y flujo; esos cambios no persisten al reiniciar.

Al volver a ejecutar el seed se restauran los estados iniciales de los tres perfiles de prueba.