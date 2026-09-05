import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@^17";

interface ReqPayload {
  successUrl: string;
  cancelUrl: string;
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");
const PRICE_ID = "price_1TvvnXQaPHvpmMJozQR2tjGo";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // 1. Manejo de CORS (Preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Extraer el token de autorización
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    
    if (!authHeader) {
      return Response.json(
        { error: "No se proporcionó la cabecera Authorization." },
        { status: 401, headers: corsHeaders }
      );
    }

    const jwt = authHeader.replace("Bearer ", "").trim();

    // 3. Crear cliente de Supabase con Service Role o Anon Key + el JWT del usuario
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      }
    );

    // 4. Validar el usuario autenticado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return Response.json(
        { error: "Usuario no autenticado.", details: userError?.message },
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = user.id;
    const userEmail = user.email;

    const { successUrl, cancelUrl }: ReqPayload = await req.json();

    // 5. Contar clientes asignados en all_users
    const { count } = await supabaseClient
      .from("all_users")
      .select("*", { count: "exact", head: true })
      .eq("nutri_id", userId);

    const quantity = count && count > 0 ? count : 1;

    // 6. Crear la sesión en Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: PRICE_ID,
          quantity: quantity,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId,
      metadata: {
        supabase_user_id: userId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    });

    return Response.json(
      { url: session.url },
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500, headers: corsHeaders }
    );
  }
});