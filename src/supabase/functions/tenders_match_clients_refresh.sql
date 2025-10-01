-- Tenders: refresh matched_clients for a given tender id
CREATE OR REPLACE FUNCTION public.refresh_tenders_matched_clients(tender_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  t_record public.tenders%rowtype;
BEGIN
  SELECT * INTO t_record FROM public.tenders WHERE id = tender_id;
  UPDATE public.tenders t
  SET matched_clients = (
    SELECT COALESCE(array_agg(c.id), ARRAY[]::uuid[])
    FROM public.clients c
    WHERE (
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(COALESCE(c.vehicles_type, '[]'::jsonb)) AS v
        WHERE v->>'value' = ANY (COALESCE(t_record.vehicles, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(v->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(t_record.geography, ARRAY[]::text[]))
          )
      )
      AND COALESCE(c.vehicles_contract, ARRAY[]::text[]) && COALESCE(t_record.vehicles_contracts, ARRAY[]::text[])
    )
    OR (
      EXISTS (
        SELECT 1 FROM jsonb_array_elements(COALESCE(c.charging_stations_type, '[]'::jsonb)) AS s
        WHERE s->>'value' = ANY (COALESCE(t_record.stations, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(s->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(t_record.geography, ARRAY[]::text[]))
          )
      )
      AND COALESCE(c.charging_stations_contract, ARRAY[]::text[]) && COALESCE(t_record.stations_contracts, ARRAY[]::text[])
    )
  )
  WHERE t.id = tender_id;
END;
$$;
