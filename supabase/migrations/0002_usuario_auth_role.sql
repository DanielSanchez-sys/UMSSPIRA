ALTER TABLE public.usuario ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE public.usuario TO authenticated;

CREATE POLICY "authenticated users can read their own role"
  ON public.usuario
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = usuario_id);
