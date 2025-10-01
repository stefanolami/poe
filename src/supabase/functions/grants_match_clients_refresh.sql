-- Grants: refresh matched_clients for a given grant id
CREATE OR REPLACE FUNCTION public.refresh_grants_matched_clients(grant_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  grant_record public.grants%rowtype;
BEGIN
  SELECT * INTO grant_record FROM public.grants WHERE id = grant_id;
  UPDATE public.grants g
  SET matched_clients = (
    SELECT COALESCE(array_agg(c.id), ARRAY[]::uuid[])
    FROM public.clients c
    WHERE (
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(COALESCE(c.deployment, '[]'::jsonb)) AS d
        WHERE d->>'value' = ANY (COALESCE(grant_record.deployment, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(d->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(grant_record.geography, ARRAY[]::text[]))
          )
      )
      OR
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(COALESCE(c.project, '[]'::jsonb)) AS p
        WHERE p->>'value' = ANY (COALESCE(grant_record.project, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(p->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(grant_record.geography, ARRAY[]::text[]))
          )
      )
    )
  )
  WHERE g.id = grant_id;
END;
$$;
