ALTER TABLE public.evento ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.evento TO anon, authenticated;
GRANT INSERT, UPDATE ON TABLE public.evento TO authenticated;

CREATE POLICY "published events are visible to everyone"
  ON public.evento
  FOR SELECT
  TO anon, authenticated
  USING (estado = 'publicado');

CREATE POLICY "administrators can read their own events"
  ON public.evento
  FOR SELECT
  TO authenticated
  USING (
    (SELECT auth.uid()) = id_usuario
    AND EXISTS (
      SELECT 1
      FROM public.usuario
      WHERE usuario_id = (SELECT auth.uid())
        AND lower(rol) IN ('administrador', 'admin')
    )
  );

CREATE POLICY "administrators can create their own events"
  ON public.evento
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = id_usuario
    AND EXISTS (
      SELECT 1
      FROM public.usuario
      WHERE usuario_id = (SELECT auth.uid())
        AND lower(rol) IN ('administrador', 'admin')
    )
  );

CREATE POLICY "administrators can update their own events"
  ON public.evento
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT auth.uid()) = id_usuario
    AND EXISTS (
      SELECT 1
      FROM public.usuario
      WHERE usuario_id = (SELECT auth.uid())
        AND lower(rol) IN ('administrador', 'admin')
    )
  )
  WITH CHECK (
    (SELECT auth.uid()) = id_usuario
    AND EXISTS (
      SELECT 1
      FROM public.usuario
      WHERE usuario_id = (SELECT auth.uid())
        AND lower(rol) IN ('administrador', 'admin')
    )
  );
