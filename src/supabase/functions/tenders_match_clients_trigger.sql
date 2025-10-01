-- Tenders match clients BEFORE trigger: assign NEW.matched_clients in-place
CREATE OR REPLACE FUNCTION public.trg_tenders_match_clients()
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
        FROM jsonb_array_elements(COALESCE(c.vehicles_type, '[]'::jsonb)) AS v
        WHERE v->>'value' = ANY (COALESCE(NEW.vehicles, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(v->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(NEW.geography, ARRAY[]::text[]))
          )
      )
      AND COALESCE(c.vehicles_contract, ARRAY[]::text[]) && COALESCE(NEW.vehicles_contracts, ARRAY[]::text[])
    )
    OR (
      EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(c.charging_stations_type, '[]'::jsonb)) AS s
        WHERE s->>'value' = ANY (COALESCE(NEW.stations, ARRAY[]::text[]))
          AND EXISTS (
            SELECT 1 FROM jsonb_array_elements(COALESCE(s->'geographies', '[]'::jsonb)) AS g
            WHERE g->>'value' = ANY (COALESCE(NEW.geography, ARRAY[]::text[]))
          )
      )
      AND COALESCE(c.charging_stations_contract, ARRAY[]::text[]) && COALESCE(NEW.stations_contracts, ARRAY[]::text[])
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tenders_match_clients_trg ON public.tenders;
CREATE TRIGGER tenders_match_clients_trg
BEFORE INSERT OR UPDATE OF geography, vehicles, vehicles_contracts, stations, stations_contracts
ON public.tenders
FOR EACH ROW
EXECUTE FUNCTION public.trg_tenders_match_clients();
