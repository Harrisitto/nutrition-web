import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";
import Stripe from "npm:stripe@^17";

interface WebhookPayload {
  record?: {
    nutri_id?: string;
  };
  old_record?: {
    nutri_id?: string;
  };
}

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "");

// Función auxiliar para recalcular los asientos del nutricionista en Stripe
async function updateNutriSeats(supabase: any, nutriId: string) {
  try {
    // 1. Obtener la suscripción activa del nutricionista desde el esquema 'stripe'
    // usando el metadata que inyectamos en la Checkout Session
    const { data: subscription, error: subErr } = await supabase
      .from("subscriptions")
      .schema("stripe")
      .select("id")
      .eq("metadata->>supabase_user_id", nutriId)
      .in("status", ["active", "trialing"])
      .maybeSingle();

    if (subErr || !subscription?.id) {
      console.log(`No se encontró suscripción activa para el nutri_id: ${nutriId}`);
      return;
    }

    // 2. Obtener el item de la suscripción (subscription_item) en Stripe Engine
    const { data: subItem, error: itemErr } = await supabase
      .from("subscription_items")
      .schema("stripe")
      .select("id")
      .eq("subscription", subscription.id)
      .limit(1)
      .single();

    if (itemErr || !subItem?.id) {
      console.log(`No se encontró el item de suscripción para: ${subscription.id}`);
      return;
    }

    // 3. Contar los clientes actuales asignados en all_users
    const { count, error: countErr } = await supabase
      .from("all_users")
      .select("*", { count: "exact", head: true })
      .eq("nutri_id", nutriId);

    if (countErr) return;

    // Garantizar al menos 1 asiento (o los que determine tu regla de negocio)
    const rawCount = count ?? 0;
    const seatCount = rawCount > 0 ? rawCount : 1;

    // 4. Actualizar la cantidad de asientos en Stripe (Per-Seat Pricing)
    await stripe.subscriptionItems.update(subItem.id, {
      quantity: seatCount,
      proration_behavior: "always_invoice",
    });

  } catch (err: any) {
    console.error(`Error actualizando asientos para nutri ${nutriId}:`, err.message);
  }
}

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (req, ctx) => {
    try {
      const payload: WebhookPayload = await req.json();
      const newNutriId = payload.record?.nutri_id;
      const oldNutriId = payload.old_record?.nutri_id;

      // 1. Si se le asignó un nuevo nutricionista al cliente
      if (newNutriId) {
        await updateNutriSeats(ctx.supabase, newNutriId);
      }

      // 2. Si cambió de nutricionista (o se desvinculó), recalcular el anterior
      if (oldNutriId && oldNutriId !== newNutriId) {
        await updateNutriSeats(ctx.supabase, oldNutriId);
      }

      return Response.json({ success: true });
    } catch (error) {
      return Response.json(
        { error: (error as Error).message },
        { status: 400 }
      );
    }
  }),
};