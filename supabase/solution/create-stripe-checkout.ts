// Reemplaza a: supabase/functions/create-stripe-checkout
//
// Cambios respecto de la version actual:
//  1. Reutiliza (o crea) un Stripe Customer con metadata.supabase_user_id.
//     `customer_email` NO permite fijar metadata en el Customer y, en modo
//     `subscription`, Stripe crea un Customer NUEVO en cada checkout. Eso
//     genera clientes duplicados y deja `stripe.customers.metadata` vacio, que
//     es justo el campo por el que busca `create-stripe-portal` (y el que
//     recomienda la propia guia de la integracion Stripe <-> Supabase).
//  2. Evita crear una segunda suscripcion si ya hay una activa.
//  3. Valida successUrl / cancelUrl contra un allowlist de origenes.
//  4. Usa la ANON key + el JWT del usuario, no la SERVICE ROLE key, para que
//     el conteo de clientes siga pasando por RLS.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@^17";

interface ReqPayload {
  successUrl: string;
  cancelUrl: string;
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
const PRICE_ID = "price_1TvvnXQaPHvpmMJozQR2tjGo";

// Configurable via secretos de la funcion:
//   supabase secrets set ALLOWED_ORIGINS="https://tu-dominio.com,http://localhost:5173"
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Un redirect_url es un vector de phishing si lo controla el cliente: solo se
// aceptan origenes conocidos.
const isAllowedUrl = (raw: unknown): raw is string => {
  if (typeof raw !== "string") return false;
  try {
    const url = new URL(raw);
    if (ALLOWED_ORIGINS.length === 0) return true; // sin allowlist configurada
    return ALLOWED_ORIGINS.includes(url.origin);
  } catch {
    return false;
  }
};

/**
 * Devuelve el Customer de Stripe del usuario, creandolo si hace falta, y se
 * asegura de que lleve metadata.supabase_user_id para que el portal y las
 * vistas SQL puedan enlazarlo.
 */
async function getOrCreateCustomer(userId: string, email: string | undefined) {
  const byMetadata = await stripe.customers.search({
    query: `metadata['supabase_user_id']:'${userId}'`,
    limit: 1,
  });
  if (byMetadata.data.length > 0) return byMetadata.data[0];

  // Migracion de los clientes que ya se crearon con `customer_email` y por
  // tanto no tienen metadata.
  if (email) {
    const byEmail = await stripe.customers.list({ email, limit: 1 });
    if (byEmail.data.length > 0) {
      return await stripe.customers.update(byEmail.data[0].id, {
        metadata: { supabase_user_id: userId },
      });
    }
  }

  return await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader =
      req.headers.get("Authorization") || req.headers.get("authorization");

    if (!authHeader) {
      return json(
        { error: "No se proporcionó la cabecera Authorization." },
        401,
      );
    }

    const jwt = authHeader.replace("Bearer ", "").trim();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: `Bearer ${jwt}` } } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return json(
        { error: "Usuario no autenticado.", details: userError?.message },
        401,
      );
    }

    const userId = user.id;

    let payload: ReqPayload;
    try {
      payload = await req.json();
    } catch {
      return json({ error: "Body JSON inválido." }, 400);
    }

    if (!isAllowedUrl(payload.successUrl) || !isAllowedUrl(payload.cancelUrl)) {
      return json({ error: "successUrl / cancelUrl no permitidas." }, 400);
    }

    const customer = await getOrCreateCustomer(userId, user.email);

    // Sin esto, pulsar "Activar suscripción" dos veces (o volver atras desde
    // Stripe y reintentar) deja al nutricionista con dos suscripciones y dos
    // cobros.
    const existing = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 100,
    });
    const active = existing.data.find((s) =>
      ["active", "trialing", "past_due"].includes(s.status),
    );
    if (active) {
      return json({ error: "already_subscribed", subscriptionId: active.id }, 409);
    }

    const { count, error: countError } = await supabaseClient
      .from("all_users")
      .select("*", { count: "exact", head: true })
      .eq("nutri_id", userId);

    if (countError) {
      return json(
        { error: "No se pudo contar los clientes.", details: countError.message },
        500,
      );
    }

    const quantity = count && count > 0 ? count : 1;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        line_items: [{ price: PRICE_ID, quantity }],
        success_url: payload.successUrl,
        cancel_url: payload.cancelUrl,
        customer: customer.id,
        client_reference_id: userId,
        metadata: { supabase_user_id: userId },
        subscription_data: {
          metadata: { supabase_user_id: userId },
        },
      },
      // Reintentar la peticion no crea dos sesiones/suscripciones.
      { idempotencyKey: `checkout:${userId}:${new Date().toISOString().slice(0, 13)}` },
    );

    return json({ url: session.url });
  } catch (err) {
    console.error("[create-stripe-checkout]", err);
    return json({ error: (err as Error).message }, 500);
  }
});
