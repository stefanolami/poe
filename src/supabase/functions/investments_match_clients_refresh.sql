-- Investments: refresh matched_clients for a given investment id
CREATE OR REPLACE FUNCTION public.refresh_investments_matched_clients(investment_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  investment_record public.investments%rowtype;
BEGIN
  SELECT * INTO investment_record FROM public.investments WHERE id = investment_id;
  UPDATE public.investments i
  SET matched_clients = (
    SELECT COALESCE(array_agg(c.id), ARRAY[]::uuid[])
    FROM public.clients c
    WHERE EXISTS (
      SELECT 1
      FROM jsonb_array_elements(COALESCE(c.pif, '[]'::jsonb)) AS pf
      WHERE pf->>'value' = 'pif'
        AND EXISTS (
          SELECT 1
          FROM jsonb_array_elements(COALESCE(pf->'geographies', '[]'::jsonb)) AS g
          WHERE g->>'value' = ANY (COALESCE(investment_record.geography, ARRAY[]::text[]))
        )
    )
  )
  WHERE i.id = investment_id;
END;
$$;
