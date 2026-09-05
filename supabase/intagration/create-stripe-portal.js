import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@^17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Función auxiliar para obtener la clave Admin/Secret de forma compatible con la versión nueva y heredada
function getSecretKey(): string {
  // 1. Intentar obtener desde la nueva variable JSON (SUPABASE_SECRET_KEYS)
  const secretKeysJson = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeysJson) {
    try {
      const parsed = JSON.parse(secretKeysJson);
      // Extrae la clave 'default' o el primer valor disponible
      const key = parsed.default || Object.values(parsed)[0];
      if (typeof key === "string" && key.length > 0) return key;
    } catch (e) {
      console.warn("No se pudo parsear SUPABASE_SECRET_KEYS JSON:", e);
    }
  }

  // 2. Fallback a la clave legacy (SUPABASE_SERVICE_ROLE_KEY) o ANON_KEY
  return (
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    Deno.env.get("SUPABASE_ANON_KEY") ||
    ""
  );
}

Deno.serve(async (req) => {
  // 1. Manejo de CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Validar token Authorization
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    
    if (!authHeader) {
      console.error("[ERROR] Header Authorization ausente.");
      return Response.json(
        { step: "auth_header", error: "No se proporcionó la cabecera Authorization." },
        { status: 401, headers: corsHeaders }
      );
    }

    const jwt = authHeader.replace("Bearer ", "").trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const adminKey = getSecretKey();

    if (!supabaseUrl || !adminKey) {
      console.error("[ERROR] Faltan variables de entorno básicas (SUPABASE_URL o SECRET_KEY).");
      return Response.json(
        { step: "env_check", error: "Faltan variables de entorno en el servidor de Supabase." },
        { status: 500, headers: corsHeaders }
      );
    }

    // 3. Crear cliente con la Secret Key / Admin Key
    const supabaseClient = createClient(supabaseUrl, adminKey, {
      global: {
        headers: { Authorization: `Bearer ${jwt}` },
      },
    });

    // 4. Validar el usuario autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      console.error("[ERROR] Autenticación fallida:", userError);
      return Response.json(
        { 
          step: "user_auth", 
          error: "Usuario no autenticado o token inválido.", 
          details: userError?.message || "User resolution failed" 
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = user.id;
    let stripeCustomerId: string | null = null;

    // 5. Intento 1: Buscar en el esquema 'stripe' con el cliente Admin
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
    } else {
      // Intento 2 (Fallback): Buscar directamente en la API de Stripe por correo si no existe en BD
      if (user.email) {
        try {
          const stripeCustomers = await stripe.customers.list({
            email: user.email,
            limit: 1,
          });
          if (stripeCustomers.data.length > 0) {
            stripeCustomerId = stripeCustomers.data[0].id;
          }
        } catch (stripeErr: any) {
          console.error("[ERROR] Error al consultar la API de Stripe directamente:", stripeErr);
        }
      }
    }

    if (!stripeCustomerId) {
      console.error(`[ERROR] No se encontró Customer ID de Stripe para el usuario ${userId}`);
      return Response.json(
        { 
          step: "customer_lookup", 
          error: "No se encontró un cliente de Stripe asociado a este usuario.", 
          userId,
          userEmail: user.email 
        },
        { status: 404, headers: corsHeaders }
      );
    }

    // 6. Obtener returnUrl del body si viene presente
    let returnUrl: string | undefined;
    try {
      const body = await req.json();
      returnUrl = body?.returnUrl;
    } catch {
      // Body vacío o no parseable
    }

    // 7. Crear sesión del Customer Portal en Stripe
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl || "http://localhost:5173/#/dashboard",
      });

      return Response.json(
        { url: portalSession.url },
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (portalErr: any) {
      console.error("[ERROR] Error creando sesión en Stripe Portal:", portalErr);
      return Response.json(
        { 
          step: "stripe_portal_creation", 
          error: "Stripe rechazó la creación de la sesión del portal.", 
          details: portalErr?.message || portalErr 
        },
        { status: 500, headers: corsHeaders }
      );
    }

  } catch (err: any) {
    console.error("[CRITICAL ERROR] Error no controlado en Edge Function:", err);
    return Response.json(
      { 
        step: "unhandled_exception", 
        error: err?.message || "Internal Server Error",
        stack: err?.stack
      },
      { status: 500, headers: corsHeaders }
    );
  }
});