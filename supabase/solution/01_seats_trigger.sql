-- ============================================================================
-- Corrige el trigger de sincronización de asientos de supabase/intagration/view.sql
--
-- Problemas de la versión actual:
--   1. net.http_post NO envía ninguna cabecera de autenticación. Si
--      `update-stripe-amount` se despliega con verify_jwt = true (el valor por
--      defecto), la plataforma la rechaza con 401 antes de ejecutar el handler
--      y la sincronización nunca ocurre -- en silencio, porque pg_net es
--      asíncrono y el trigger nunca ve la respuesta.
--   2. Dispara en CUALQUIER UPDATE de all_users (goal, last_seen, phone...),
--      no solo cuando cambia nutri_id. Con clientes activos son cientos de
--      llamadas inútiles a la API de Stripe al día.
--   3. FOR EACH ROW sobre una operación en lote hace N llamadas HTTP.
--   4. No hay forma de observar los fallos.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pg_net";

-- El secreto compartido se guarda en Vault, no incrustado en la definición de
-- la función (que es legible por cualquiera con acceso a pg_catalog).
--   select vault.create_secret('<cadena larga aleatoria>', 'seat_sync_secret');
--   select vault.create_secret('<service role key>',       'seat_sync_apikey');

CREATE OR REPLACE FUNCTION public.trigger_sync_stripe_seats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault, net
AS $$
DECLARE
  payload      jsonb;
  v_secret     text;
  v_apikey     text;
  v_request_id bigint;
BEGIN
  -- Nada que hacer si la fila no está (ni estaba) asignada a un nutricionista.
  IF COALESCE(NEW.nutri_id::text, '') = '' AND COALESCE(OLD.nutri_id::text, '') = '' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT decrypted_secret INTO v_secret
    FROM vault.decrypted_secrets WHERE name = 'seat_sync_secret';
  SELECT decrypted_secret INTO v_apikey
    FROM vault.decrypted_secrets WHERE name = 'seat_sync_apikey';

  payload := jsonb_build_object(
    'type',       TG_OP,
    'table',      TG_TABLE_NAME,
    'schema',     TG_TABLE_SCHEMA,
    'record',     CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END,
    'old_record', CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END
  );

  SELECT net.http_post(
    url     := 'https://iivsjutltecehnnhmjok.supabase.co/functions/v1/update-stripe-amount',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      -- `apikey` es la cabecera que la plataforma acepta para llamadas
      -- servidor-a-servidor (pg_net, cron, workers).
      'apikey',        COALESCE(v_apikey, ''),
      'Authorization', 'Bearer ' || COALESCE(v_apikey, ''),
      'X-Sync-Secret', COALESCE(v_secret, '')
    ),
    body    := payload,
    timeout_milliseconds := 5000
  ) INTO v_request_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.trigger_sync_stripe_seats() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS tr_sync_stripe_seats ON public.all_users;

-- INSERT y DELETE siempre cambian el nº de asientos; UPDATE solo cuando se
-- reasigna el cliente. `OF nutri_id` hace que Postgres ni evalúe el trigger
-- para el resto de columnas.
CREATE TRIGGER tr_sync_stripe_seats_ins
AFTER INSERT ON public.all_users
FOR EACH ROW
WHEN (NEW.nutri_id IS NOT NULL)
EXECUTE FUNCTION public.trigger_sync_stripe_seats();

CREATE TRIGGER tr_sync_stripe_seats_upd
AFTER UPDATE OF nutri_id ON public.all_users
FOR EACH ROW
WHEN (NEW.nutri_id IS DISTINCT FROM OLD.nutri_id)
EXECUTE FUNCTION public.trigger_sync_stripe_seats();

CREATE TRIGGER tr_sync_stripe_seats_del
AFTER DELETE ON public.all_users
FOR EACH ROW
WHEN (OLD.nutri_id IS NOT NULL)
EXECUTE FUNCTION public.trigger_sync_stripe_seats();

-- Observabilidad: pg_net guarda las respuestas aquí. Sin esto los 401 son
-- invisibles.
--   select id, status_code, content, created
--     from net._http_response order by created desc limit 20;
