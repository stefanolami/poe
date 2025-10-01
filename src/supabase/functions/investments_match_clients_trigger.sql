-- Investments match clients BEFORE trigger: assign NEW.matched_clients in-place
CREATE OR REPLACE FUNCTION public.trg_investments_match_clients()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.matched_clients := (
    SELECT COALESCE(array_agg(c.id), ARRAY[]::uuid[])
    FROM public.clients c
    WHERE EXISTS (
      SELECT 1
      FROM jsonb_array_elements(COALESCE(c.pif, '[]'::jsonb)) AS pf
      WHERE pf->>'value' = 'pif'
        AND EXISTS (
          SELECT 1
          FROM jsonb_array_elements(COALESCE(pf->'geographies', '[]'::jsonb)) AS g
          WHERE g->>'value' = ANY (COALESCE(NEW.geography, ARRAY[]::text[]))
        )
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS investments_match_clients_trg ON public.investments;
CREATE TRIGGER investments_match_clients_trg
BEFORE INSERT OR UPDATE OF geography
ON public.investments
FOR EACH ROW
EXECUTE FUNCTION public.trg_investments_match_clients();
