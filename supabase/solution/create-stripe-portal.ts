// Reemplaza a: supabase/functions/create-stripe-portal
//
// Cambios respecto de la version actual:
//  1. La busqueda primaria (stripe.customers.metadata->>supabase_user_id) NUNCA
//     acertaba, porque el checkout usaba `customer_email` y Stripe no copia
//     metadata al Customer. Con el nuevo create-stripe-checkout ya si acierta;
//     aqui se mantiene el fallback por email y ademas se rellena la metadata
//     que faltaba (self-healing para los clientes ya creados).
//  2. El return_url por defecto ya no es "http://localhost:5173/#/dashboard"
//     (rompia el portal en produccion): se deriva del Origin de la peticion.
//  3. El body se lee una sola vez y antes de cualquier salida temprana.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@^17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");

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

function getSecretKey(): string {
  const secretKeysJson = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeysJson) {
    try {
      const parsed = JSON.parse(secretKeysJson);
      const key = parsed.default || Object.values(parsed)[0];
      if (typeof key === "string" && key.length > 0) return key;
    } catch (e) {
      console.warn("No se pudo parsear SUPABASE_SECRET_KEYS JSON:", e);
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

const isAllowedUrl = (raw: unknown): raw is string => {
  if (typeof raw !== "string") return false;
  try {
    const url = new URL(raw);
    if (ALLOWED_ORIGINS.length === 0) return true;
    return ALLOWED_ORIGINS.includes(url.origin);
  } catch {
    return false;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader =
      req.headers.get("Authorization") || req.headers.get("authorization");

    if (!authHeader) {
      return json(
        { step: "auth_header", error: "No se proporcionó la cabecera Authorization." },
        401,
      );
    }

    // Leido antes de cualquier return: un Request solo se puede consumir una vez.
    let returnUrl: string | undefined;
    try {
      const body = await req.json();
      if (isAllowedUrl(body?.returnUrl)) returnUrl = body.returnUrl;
    } catch {
      // Body vacio o no parseable: se usa el fallback de mas abajo.
    }

    const jwt = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const adminKey = getSecretKey();

    if (!supabaseUrl || !adminKey) {
      return json(
        { step: "env_check", error: "Faltan variables de entorno en el servidor de Supabase." },
        500,
      );
    }

    const supabaseClient = createClient(supabaseUrl, adminKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return json(
        {
          step: "user_auth",
          error: "Usuario no autenticado o token inválido.",
          details: userError?.message ?? "User resolution failed",
        },
        401,
      );
    }

    const userId = user.id;
    let stripeCustomerId: string | null = null;

    const adminClient = createClient(supabaseUrl, adminKey);
    const { data: customerData, error: customerErr } = await adminClient
      .schema("stripe")
      .from("customers")
      .select("id")
      .eq("metadata->>supabase_user_id", userId)
      .maybeSingle();

    if (customerErr) {
      console.warn("[WARN] Error consultando esquema stripe:", customerErr.message);
    }

    if (customerData?.id) {
      stripeCustomerId = customerData.id;
    } else if (user.email) {
      // Fallback para los Customers creados por la version antigua del
      // checkout (sin metadata). `list` puede devolver varios duplicados: se
      // elige el que tenga una suscripcion viva, no simplemente el primero.
      try {
        const byEmail = await stripe.customers.list({ email: user.email, limit: 100 });
        for (const candidate of byEmail.data) {
          const subs = await stripe.subscriptions.list({
            customer: candidate.id,
            status: "all",
            limit: 10,
          });
          const live = subs.data.some((s) =>
            ["active", "trialing", "past_due"].includes(s.status),
          );
          if (live || !stripeCustomerId) stripeCustomerId = candidate.id;
          if (live) break;
        }

        // Se rellena la metadata que falta para que la proxima vez acierte la
        // busqueda por BD y no haya que pasar por la API de Stripe.
        if (stripeCustomerId) {
          await stripe.customers.update(stripeCustomerId, {
            metadata: { supabase_user_id: userId },
          });
        }
      } catch (stripeErr) {
        console.error("[ERROR] Consultando la API de Stripe:", stripeErr);
      }
    }

    if (!stripeCustomerId) {
      return json(
        {
          step: "customer_lookup",
          error: "No se encontró un cliente de Stripe asociado a este usuario.",
        },
        404,
      );
    }

    const origin = req.headers.get("origin");
    const fallbackUrl =
      (origin && (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin))
        ? `${origin}/#/dashboard/`
        : undefined) ??
      (ALLOWED_ORIGINS[0] ? `${ALLOWED_ORIGINS[0]}/#/dashboard/` : undefined);

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl ?? fallbackUrl,
      });

      return json({ url: portalSession.url });
    } catch (portalErr) {
      console.error("[ERROR] Creando sesión en Stripe Portal:", portalErr);
      return json(
        {
          step: "stripe_portal_creation",
          error: "Stripe rechazó la creación de la sesión del portal.",
          details: (portalErr as Error)?.message,
        },
        500,
      );
    }
  } catch (err) {
    console.error("[CRITICAL] create-stripe-portal:", err);
    // Nunca se devuelve el stack al cliente.
    return json({ step: "unhandled_exception", error: "Internal Server Error" }, 500);
  }
});
