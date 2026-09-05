CREATE OR REPLACE VIEW public.nutri_payment AS
SELECT 
    u.id AS id,
    c.id AS stripe_customer_id,
    s.id AS stripe_subscription_id,
    s.status AS subscription_status,
    s.current_period_end
FROM auth.users u
JOIN stripe.customers c ON c.email = u.email
LEFT JOIN stripe.subscriptions s ON s.customer = c.id
WHERE u.id = auth.uid();

CREATE OR REPLACE FUNCTION public.has_active_subscription()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, stripe, auth
AS $$
DECLARE
  v_has_sub boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM stripe.subscriptions s
    WHERE (s.metadata->>'supabase_user_id') = auth.uid()::text
      AND s.status IN ('active', 'trialing')
  ) INTO v_has_sub;

  RETURN COALESCE(v_has_sub, false);
END;
$$;

-- 1. Asegurar la extensión pg_net para peticiones HTTP
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- 2. Crear la función del Trigger que llamará a tu Edge Function
CREATE OR REPLACE FUNCTION public.trigger_sync_stripe_seats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
  request_id bigint;
BEGIN
  -- Construir el payload idéntico al que espera la Edge Function
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW)::jsonb END,
    'old_record', CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE row_to_json(OLD)::jsonb END
  );

  -- Realizar la llamada HTTP POST a tu Edge Function
  SELECT net.http_post(
    url := 'https://iivsjutltecehnnhmjok.supabase.co/functions/v1/update-stripe-amount',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := payload
  ) INTO request_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3. Asignar el trigger a la tabla all_users
DROP TRIGGER IF EXISTS tr_sync_stripe_seats ON public.all_users;

CREATE TRIGGER tr_sync_stripe_seats
AFTER INSERT OR UPDATE OR DELETE ON public.all_users
FOR EACH ROW
EXECUTE FUNCTION public.trigger_sync_stripe_seats();