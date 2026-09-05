-- ============================================================================
-- Corrige public.has_active_subscription() de supabase/intagration/view.sql
--
-- La versión actual enlaza al usuario con Stripe por
-- stripe.subscriptions.metadata->>'supabase_user_id', que solo existe si la
-- suscripción se creó pasando `subscription_data.metadata`. Cualquier
-- suscripción nacida fuera de ese camino (portal de cliente, alta manual desde
-- el dashboard de Stripe, recuperación de un impago) no lleva esa metadata y
-- el nutricionista queda encerrado tras el paywall aunque esté pagando.
--
-- Aquí el enlace canónico pasa a ser stripe.customers.metadata->>'supabase_user_id'
-- (el que recomienda la guía de la integración Stripe<->Supabase, y el que
-- garantiza create-stripe-checkout.ts al crear/reutilizar el Customer), con la
-- metadata de la suscripción como respaldo para lo ya existente.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Backfill: rellenar metadata.supabase_user_id en los Customers antiguos.
--    Los creados con `customer_email` no la tienen. Este UPDATE es solo sobre
--    la copia local; la fuente de verdad es Stripe, así que hay que arreglarlo
--    TAMBIÉN en Stripe (lo hace create-stripe-portal.ts al primer acceso, o un
--    script puntual contra la API).
--    Ejecutar antes de sustituir la función, para no dejar a nadie sin acceso.
-- ---------------------------------------------------------------------------
-- select c.id, c.email, u.id as supabase_user_id
--   from stripe.customers c
--   join auth.users u on u.email = c.email
--  where c.metadata->>'supabase_user_id' is null;

-- ---------------------------------------------------------------------------
-- 2. has_active_subscription()
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_active_subscription()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, stripe, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM stripe.subscriptions s
    LEFT JOIN stripe.customers c ON c.id = s.customer
    WHERE s.status IN ('active', 'trialing')
      AND (
        -- Enlace canónico (nuevo checkout).
        c.metadata->>'supabase_user_id' = auth.uid()::text
        -- Respaldo para suscripciones creadas por la versión anterior.
        OR s.metadata->>'supabase_user_id' = auth.uid()::text
      )
  );
$$;

-- auth.uid() es NULL para peticiones anónimas, así que la función ya devuelve
-- false; aun así solo se concede a usuarios autenticados.
REVOKE ALL ON FUNCTION public.has_active_subscription() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_active_subscription() TO authenticated;

-- ---------------------------------------------------------------------------
-- NOTA: la vista public.nutri_payment de supabase/intagration/view.sql NO se
-- llega a crear en la base de datos (confirmado: no existe, y por eso el
-- bloque `Views` de src/services/supabase/types.ts está vacío). Se descarta a
-- propósito: el frontend no la usa, y mantener dos enlaces distintos entre
-- auth.users y Stripe (email en la vista, metadata en la función) es
-- justamente la incoherencia que este fichero elimina.
-- Conviene borrarla también de supabase/intagration/view.sql.
-- ---------------------------------------------------------------------------

-- Tras aplicar esto, regenerar los tipos:
--   npm run supabase-types
