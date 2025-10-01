-- Grants match clients BEFORE trigger: assign NEW.matched_clients in-place
CREATE OR REPLACE FUNCTION public.trg_grants_match_clients()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.matched_clients := (
    SELECT COALESCE(array_agg(c.id), ARRAY[]::uuid[])
    FROM public.clients c
    WHERE (
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(c.deployment, '[]'::jsonb)) AS d
        WHERE d->>'value' = ANY (COALESCE(NEW.deployment, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(d->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(NEW.geography, ARRAY[]::text[]))
          )
      )
      OR
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(c.project, '[]'::jsonb)) AS p
        WHERE p->>'value' = ANY (COALESCE(NEW.project, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements(COALESCE(p->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(NEW.geography, ARRAY[]::text[]))
          )
      )
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grants_match_clients_trg ON public.grants;
CREATE TRIGGER grants_match_clients_trg
BEFORE INSERT OR UPDATE OF geography, deployment, project
ON public.grants
FOR EACH ROW
EXECUTE FUNCTION public.trg_grants_match_clients();
